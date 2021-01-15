import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff, timeOff: { currentUserRole = '' } = {} }) => ({
  timeOff,
  currentUserRole,
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
    const admincla = roles.find((item) => item === 'admin-cla');

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
          currentUserRole: 'ADMIN-CLA',
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
    if (currentUserRole === 'ADMIN-CLA') {
      if (status === 'IN-PROGRESS-NEXT') return `${styles.leaveStatus} ${styles.inProgressColor}`;
    } else if (status === 'IN-PROGRESS-NEXT')
      return `${styles.leaveStatus} ${styles.approvedColor}`;

    switch (status) {
      case 'IN-PROGRESS':
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case 'ACCEPTED':
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case 'REJECTED':
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case 'DRAFTS':
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      case 'ON-HOLD':
        return `${styles.leaveStatus} ${styles.onHoldColor}`;
      case 'DELETED':
        return `${styles.leaveStatus} ${styles.deletedColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    const { currentUserRole = '' } = this.props;
    if (currentUserRole === 'ADMIN-CLA') {
      if (status === 'IN-PROGRESS-NEXT') return 'In Progress (PM Approved)';
    } else if (status === 'IN-PROGRESS-NEXT') return 'Approved (PM Approved)';

    switch (status) {
      case 'IN-PROGRESS':
        return 'In Progress';
      case 'ACCEPTED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'DRAFTS':
        return 'Drafts';
      case 'ON-HOLD':
        return 'Withdraw';
      case 'DELETED':
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
    } = this.props;

    const {
      match: { params: { reId: id = '' } = {} },
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ManagerViewCompoffForm}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>
              <div className={this.getColorOfStatus(status)}>
                <span className={styles.dot} />
                <span className={styles.statusText}>{this.getNameOfStatus(status)}</span>
              </div>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <RequestInformation id={id} />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent viewingCompoffRequest={viewingCompoffRequest} />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ManagerViewCompoffForm;
