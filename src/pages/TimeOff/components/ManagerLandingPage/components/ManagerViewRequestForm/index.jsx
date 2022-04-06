import React, { PureComponent } from 'react';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_COLOR, TIMEOFF_STATUS_NAME } from '@/utils/timeOff';
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
                  {TIMEOFF_STATUS_NAME[status]}
                </span>
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
