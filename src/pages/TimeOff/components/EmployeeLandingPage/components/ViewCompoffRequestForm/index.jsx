import React, { PureComponent } from 'react';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DELETED, DRAFTS } =
  TIMEOFF_STATUS;
@connect(({ timeOff, timeOff: { currentUserRole = '' } = {}, loading }) => ({
  timeOff,
  currentUserRole,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
}))
class ViewCompoffRequestForm extends PureComponent {
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
      type: 'timeOff/fetchCompoffRequestById',
      id,
    });
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  // clear viewingCompoffRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/clearViewingCompoffRequest',
    });
  };

  getColorOfStatus = (status) => {
    switch (status) {
      case IN_PROGRESS:
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case IN_PROGRESS_NEXT:
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case ACCEPTED:
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case REJECTED:
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case DRAFTS:
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      case ON_HOLD:
        return `${styles.leaveStatus} ${styles.onHoldColor}`;
      case DELETED:
        return `${styles.leaveStatus} ${styles.deletedColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    switch (status) {
      case IN_PROGRESS:
        return 'In Progress';
      case IN_PROGRESS_NEXT:
        return 'In Progress (PM Approved)';
      case ACCEPTED:
        return 'Approved';
      case REJECTED:
        return 'Rejected';
      case DRAFTS:
        return 'Drafts';
      case ON_HOLD:
        return 'Withdrawn';
      case DELETED:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  };

  render() {
    const {
      timeOff: {
        viewingCompoffRequest = {},
        viewingCompoffRequest: { ticketID = '', status = '' } = {},
      } = {},
      loadingFetchCompoffRequestById,
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ViewCompoffRequestForm}>
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
              <RightContent
                viewingCompoffRequest={viewingCompoffRequest}
                loading={loadingFetchCompoffRequestById}
              />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ViewCompoffRequestForm;
