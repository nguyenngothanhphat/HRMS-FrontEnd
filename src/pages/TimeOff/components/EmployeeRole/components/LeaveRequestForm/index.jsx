import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))
class LeaveRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      action: '',
      status: '',
    };
  }

  componentDidMount = () => {
    const { location: { state: { action = '', status = '' } = {} } = {} } = this.props;
    this.setState({
      action,
      status,
    });

    if (action === 'EDIT-REQUEST') {
      const {
        dispatch,
        match: { params: { reId: id = '' } = {} },
      } = this.props;
      dispatch({
        type: 'timeOff/fetchLeaveRequestById',
        id,
      });
    }
  };

  getColorOfStatus = (status) => {
    switch (status) {
      case 'IN-PROGRESS':
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case 'APPROVED':
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case 'REJECTED':
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case 'DRAFTS':
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    switch (status) {
      case 'IN-PROGRESS':
        return 'In Progress';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'DRAFTS':
        return 'Drafts';
      default:
        return 'Unknown';
    }
  };

  render() {
    const { action, status } = this.state;
    const { timeOff: { viewingLeaveRequest = {} } = {}, loadingFetchLeaveRequestById } = this.props;
    return (
      <PageContainer>
        <div className={styles.leaveRequest}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              {action === 'NEW-REQUEST' && (
                <>
                  <p className={styles.titlePage__text}>Request for Timeoff</p>
                </>
              )}
              {action === 'EDIT-REQUEST' && (
                <>
                  <p className={styles.titlePage__text}>[Ticket ID: 16003134]</p>

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
              <Spin size="medium" />
            </div>
          )}
          {!loadingFetchLeaveRequestById && (
            <>
              <Row className={styles.container} gutter={[20, 20]}>
                <Col xs={24} lg={16}>
                  <RequestInformation
                    action={action}
                    status={status}
                    viewingLeaveRequest={viewingLeaveRequest}
                  />
                </Col>
                <Col xs={24} lg={8}>
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
