import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff }) => ({
  timeOff,
}))
class ViewRequestForm extends PureComponent {
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
      type: 'timeOff/clearViewingLeaveRequest',
    });
  };

  getColorOfStatus = (status) => {
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
        viewingLeaveRequest: { status = '', ticketID = '', approvalManager = {} } = {},
      } = {},
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ViewRequestForm}>
          <Affix offsetTop={42}>
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
              <RequestInformation />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent approvalManager={approvalManager} status={status} />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ViewRequestForm;
