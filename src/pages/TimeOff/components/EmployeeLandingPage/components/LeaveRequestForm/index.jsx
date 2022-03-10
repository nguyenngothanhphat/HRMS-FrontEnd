// this component is used for creating a new timeoff request
// and for editing (updating) a exist one

import { Affix, Col, Row, Spin } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { TIMEOFF_LINK_ACTION, TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';

const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST } = TIMEOFF_LINK_ACTION;
@connect(({ timeOff, locationSelection: { listLocationsByCompany = [] } = {}, loading }) => ({
  timeOff,
  listLocationsByCompany,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))
class LeaveRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      action: '',
      invalidDates: [],
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      match: { params: { action = '', reId = '' } = {} },
      timeOff: { timeOffTypesByCountry = [] } = {},
    } = this.props;

    this.setState({
      action,
    });

    if (timeOffTypesByCountry.length === 0) {
      this.fetchTimeOffTypes();
    }

    if (action === EDIT_LEAVE_REQUEST) {
      dispatch({
        type: 'timeOff/fetchLeaveRequestById',
        id: reId,
      });
    }

    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
    }).then((res) => {
      if (res.statusCode === 200) {
        let invalidDates = [];
        const { items: leaveRequests = [] } = res?.data;
        leaveRequests.forEach((x) => {
          if ([DRAFTS, IN_PROGRESS, ACCEPTED, ON_HOLD].includes(x.status)) {
            const temp = x.leaveDates.map((y) => {
              return {
                date: y.date,
                timeOfDay: y.timeOfDay,
              };
            });
            invalidDates = [...invalidDates, ...temp];
          }
        });

        this.setState({
          invalidDates,
        });
      }
    });

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  getDateLists = (startDate1, endDate1) => {
    if (startDate1 && endDate1) {
      const now = startDate1.clone();
      const dates = [];

      while (now.isSameOrBefore(endDate1)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
      }
      return dates;
    }
    return [];
  };

  fetchTimeOffTypes = () => {
    const { listLocationsByCompany = [], dispatch } = this.props;

    const find = listLocationsByCompany.find((x) => x._id === getCurrentLocation());
    if (find) {
      const { headQuarterAddress: { country: { _id } = {} || {} } = {} || {} } = find;
      dispatch({
        type: 'timeOff/fetchTimeOffTypesByCountry',
        payload: {
          country: _id,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      });
    }
  };

  getColorOfStatus = (status) => {
    switch (status) {
      case IN_PROGRESS:
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case ACCEPTED:
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case REJECTED:
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case DRAFTS:
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      case ON_HOLD:
        return `${styles.leaveStatus} ${styles.onHoldColor}`;
      case WITHDRAWN:
        return `${styles.leaveStatus} ${styles.withdrawnColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    switch (status) {
      case IN_PROGRESS:
        return 'In Progress';
      case ACCEPTED:
        return 'Approved';
      case REJECTED:
        return 'Rejected';
      case DRAFTS:
        return 'Drafts';
      case ON_HOLD:
        return 'On Hold';
      case WITHDRAWN:
        return 'Withdrawn';
      default:
        return 'Unknown';
    }
  };

  render() {
    const { action, invalidDates } = this.state;
    const {
      timeOff: {
        viewingLeaveRequest = {},
        viewingLeaveRequest: { status = '', ticketID = '' } = {},
      } = {},
      loadingFetchLeaveRequestById,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.leaveRequest}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              {action === NEW_LEAVE_REQUEST && (
                <>
                  <p className={styles.titlePage__text}>Apply for Timeoff</p>
                </>
              )}
              {action === EDIT_LEAVE_REQUEST && (
                <>
                  <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>

                  <div className={this.getColorOfStatus(status)}>
                    <span className={styles.dot} />
                    <span className={styles.statusText}>{this.getNameOfStatus(status)}</span>
                  </div>
                </>
              )}
            </div>
          </Affix>
          {loadingFetchLeaveRequestById && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '100px 0',
              }}
            >
              <Spin size="large" />
            </div>
          )}
          {!loadingFetchLeaveRequestById &&
            action === EDIT_LEAVE_REQUEST &&
            status !== DRAFTS &&
            status !== IN_PROGRESS && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '100px 0',
                }}
              >
                <span>You are not allowed to edit this leave request!</span>
              </div>
            )}

          {(action === NEW_LEAVE_REQUEST ||
            (action === EDIT_LEAVE_REQUEST &&
              !loadingFetchLeaveRequestById &&
              (status === DRAFTS || status === IN_PROGRESS))) && (
              <>
                <Row className={styles.container} gutter={[20, 20]}>
                  <Col xs={24} xl={16}>
                    <RequestInformation
                      action={action}
                      status={status}
                      ticketID={ticketID}
                      invalidDates={invalidDates}
                      viewingLeaveRequest={viewingLeaveRequest}
                    />
                  </Col>
                  <Col xs={24} xl={8}>
                    <RightContent />
                  </Col>
                </Row>
              </>
          )}
        </div>
      </PageContainer>
    );
  }
}

export default LeaveRequestForm;
