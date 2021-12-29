import React, { PureComponent } from 'react';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_STATUS, TIMEOFF_LINK_ACTION } from '@/utils/timeOff';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';

import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
  loadingFetchCompoffApprovalFlow: loading.effects['timeOff/getCompoffApprovalFlow'],
}))
class CompoffRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { action: '' };
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        compoffApprovalFlow: {},
      },
    });
  };

  componentDidMount = () => {
    const {
      dispatch,
      match: { params: { action = '', reId = '' } = {} },
    } = this.props;

    this.setState({
      action,
    });

    if (action === TIMEOFF_LINK_ACTION.editCompoffRequest) {
      dispatch({
        type: 'timeOff/fetchCompoffRequestById',
        id: reId,
      });
    }

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
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
        compoffApprovalFlow = {},
      } = {},
      loadingFetchCompoffRequestById,
      loadingFetchCompoffApprovalFlow,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.CompoffRequestForm}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text} />
              {action === TIMEOFF_LINK_ACTION.newCompoffRequest && (
                <>
                  <p className={styles.titlePage__text}>Request for Compoff</p>
                </>
              )}
              {action === TIMEOFF_LINK_ACTION.editCompoffRequest && (
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
            action === TIMEOFF_LINK_ACTION.editCompoffRequest &&
            status !== TIMEOFF_STATUS.drafts &&
            status !== TIMEOFF_STATUS.inProgress && (
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

          {(action === TIMEOFF_LINK_ACTION.newCompoffRequest ||
            (action === TIMEOFF_LINK_ACTION.editCompoffRequest &&
              !loadingFetchCompoffRequestById &&
              (status === TIMEOFF_STATUS.drafts || status === TIMEOFF_STATUS.inProgress))) && (
              <>
                <Row className={styles.container} gutter={[20, 20]}>
                  <Col xs={24} xl={16}>
                    <RequestInformation
                      action={action}
                      status={status}
                      ticketID={ticketID}
                      viewingCompoffRequest={viewingCompoffRequest}
                    />
                  </Col>
                  <Col xs={24} xl={8}>
                    <RightContent
                      compoffApprovalFlow={compoffApprovalFlow}
                      loading={loadingFetchCompoffApprovalFlow}
                    />
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
