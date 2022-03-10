import React, { PureComponent } from 'react';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_COLOR, TIMEOFF_STATUS } from '@/utils/timeOff';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DELETED, DRAFTS, WITHDRAWN } = TIMEOFF_STATUS;
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
        return 'Withdraw Request';
      case DELETED:
        return 'Deleted';
      case WITHDRAWN:
        return 'Withdrawn';
      default:
        return 'Unknown';
    }
  };

  render() {
    const {
      timeOff: {
        viewingLeaveRequest: { status = '', ticketID = '' } = {},
        viewingLeaveRequest = {},
      } = {},
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ViewRequestForm}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>
              <div className={styles.leaveStatus}>
                <span
                  className={styles.dot}
                  style={{
                    backgroundColor: TIMEOFF_COLOR[status],
                  }}
                />
                <span
                  className={styles.statusText}
                  style={{
                    color: TIMEOFF_COLOR[status],
                  }}
                >
                  {this.getNameOfStatus(status)}
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <RequestInformation />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent data={viewingLeaveRequest} status={status} />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ViewRequestForm;
