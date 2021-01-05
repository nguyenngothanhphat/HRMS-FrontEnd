import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
}))
class CompoffRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { action: '' };
  }

  componentDidMount = () => {
    const {
      dispatch,
      match: { params: { action = '', reId = '' } = {} },
    } = this.props;

    this.setState({
      action,
    });

    if (action === 'edit-compoff-request') {
      dispatch({
        type: 'timeOff/fetchCompoffRequestById',
        id: reId,
      });
    }

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
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
      default:
        return 'Unknown';
    }
  };

  render() {
    const { action } = this.state;
    const {
      timeOff: {
        viewingCompoffRequest = {},
        viewingCompoffRequest: { status = '', ticketID = '' } = {},
      } = {},
      loadingFetchCompoffRequestById,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.CompoffRequestForm}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text} />
              {action === 'new-compoff-request' && (
                <>
                  <p className={styles.titlePage__text}>Request for Compoff</p>
                </>
              )}
              {action === 'edit-compoff-request' && (
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

          {!loadingFetchCompoffRequestById &&
            action === 'edit-compoff-request' &&
            (status === 'ACCEPTED' || status === 'REJECTED') && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '100px 0',
                }}
              >
                <span>You are not allowed to edit this compoff request!</span>
              </div>
            )}

          {!loadingFetchCompoffRequestById && status !== 'ACCEPTED' && status !== 'REJECTED' && (
            <>
              <Row className={styles.container} gutter={[20, 20]}>
                <Col xs={24} lg={16}>
                  <RequestInformation
                    action={action}
                    status={status}
                    ticketID={ticketID}
                    viewingCompoffRequest={viewingCompoffRequest}
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

export default CompoffRequestForm;
