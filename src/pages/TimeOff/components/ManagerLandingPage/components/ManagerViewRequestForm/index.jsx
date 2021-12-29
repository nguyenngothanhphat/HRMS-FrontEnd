import React, { PureComponent } from 'react';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))
class ManagerViewRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // FETCH LEAVE REQUEST DETAIL
  componentDidMount = () => {
    const {
      dispatch,
      match: { params: { reId: id = '' } = {} },
    } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveRequestById',
      id,
    });
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  // clear viewingLeaveRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        viewingLeaveRequest: {},
        projectsList: [],
      },
    });
  };

  getColorOfStatus = (status) => {
    switch (status) {
      case TIMEOFF_STATUS.inProgress:
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case TIMEOFF_STATUS.accepted:
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case TIMEOFF_STATUS.rejected:
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case TIMEOFF_STATUS.drafts:
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      case TIMEOFF_STATUS.onHold:
        return `${styles.leaveStatus} ${styles.onHoldColor}`;
      case TIMEOFF_STATUS.deleted:
        return `${styles.leaveStatus} ${styles.deletedColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    switch (status) {
      case TIMEOFF_STATUS.inProgress:
        return 'In Progress';
      case TIMEOFF_STATUS.accepted:
        return 'Approved';
      case TIMEOFF_STATUS.rejected:
        return 'Rejected';
      case TIMEOFF_STATUS.drafts:
        return 'Drafts';
      case TIMEOFF_STATUS.onHold:
        return 'Withdrawn';
      case TIMEOFF_STATUS.deleted:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  };

  render() {
    const {
      timeOff: {
        viewingLeaveRequest: {
          status = '',
          ticketID = '',
          employee: { _id: employeeId = '' } = {},
        } = {},
        viewingLeaveRequest = {},
      } = {},
      loadingFetchLeaveRequestById,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ManagerViewRequestForm}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>
              <div className={this.getColorOfStatus(status)}>
                <span className={styles.dot} />
                <span className={styles.statusText}>{this.getNameOfStatus(status)}</span>
              </div>
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
              <Spin size="medium" />
            </div>
          )}
          {!loadingFetchLeaveRequestById && employeeId !== '' && (
            <Row className={styles.container} gutter={[20, 20]}>
              <Col xs={24} lg={16}>
                <RequestInformation employeeId={employeeId} />
              </Col>
              <Col xs={24} lg={8}>
                <RightContent viewingLeaveRequest={viewingLeaveRequest} status={status} />
              </Col>
            </Row>
          )}
        </div>
      </PageContainer>
    );
  }
}

export default ManagerViewRequestForm;
