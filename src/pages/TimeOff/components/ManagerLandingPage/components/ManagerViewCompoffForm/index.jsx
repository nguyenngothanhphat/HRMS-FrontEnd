import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff, timeOff: { currentUserRole = '' } = {}, loading }) => ({
  timeOff,
  currentUserRole,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
}))
class ManagerViewCompoffForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  findRole = (roles) => {
    const { dispatch } = this.props;

    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const admincla = roles.find((item) => item === 'region-head');

    let role = '';
    role = hrManager || manager || employee || 'employee';
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentUserRole: role,
      },
    });

    if (admincla) {
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentUserRole: 'REGION-HEAD',
        },
      });
    }
  };

  // FETCH LEAVE REQUEST DETAIL
  componentDidMount = () => {
    const listRole = localStorage.getItem('antd-pro-authority');
    this.findRole(JSON.parse(listRole));
    const {
      dispatch,
      match: { params: { reId: id = '' } = {} },
    } = this.props;
    dispatch({
      type: 'timeOff/fetchCompoffRequestById',
      id,
    });
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  // clear viewingLeaveRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/clearViewingCompoffRequest',
    });
  };

  getColorOfStatus = (status) => {
    const { currentUserRole = '' } = this.props;
    if (currentUserRole === 'REGION-HEAD') {
      if (status === TIMEOFF_STATUS.inProgressNext)
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
    } else if (status === TIMEOFF_STATUS.inProgressNext)
      return `${styles.leaveStatus} ${styles.approvedColor}`;

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
    const { currentUserRole = '' } = this.props;
    if (currentUserRole === 'REGION-HEAD' || currentUserRole === 'hr-manager') {
      if (status === TIMEOFF_STATUS.inProgressNext) return 'In Progress (PM Approved)';
    } else if (status === TIMEOFF_STATUS.inProgressNext) return 'Approved (PM Approved)';

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
        return 'Withdraw';
      case TIMEOFF_STATUS.deleted:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  };

  render() {
    const {
      timeOff: {
        viewingCompoffRequest: { status = '', ticketID = '' } = {},
        viewingCompoffRequest = {},
      } = {},
      loadingFetchCompoffRequestById,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ManagerViewCompoffForm}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>
              <div className={this.getColorOfStatus(status)}>
                <span className={styles.dot} />
                <span className={styles.statusText}>{this.getNameOfStatus(status)}</span>
              </div>
            </div>
          </Affix>
          {loadingFetchCompoffRequestById && (
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
          {!loadingFetchCompoffRequestById && (
            <Row className={styles.container} gutter={[20, 20]}>
              <Col xs={24} lg={16}>
                <RequestInformation />
              </Col>
              <Col xs={24} lg={8}>
                <RightContent
                  viewingCompoffRequest={viewingCompoffRequest}
                  loading={loadingFetchCompoffRequestById}
                />
              </Col>
            </Row>
          )}
        </div>
      </PageContainer>
    );
  }
}

export default ManagerViewCompoffForm;
