import { Affix, Col, Row, Spin } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { TIMEOFF_COLOR, TIMEOFF_STATUS_NAME } from '@/utils/timeOff';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';

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
      loadingFetchLeaveRequestById = false,
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

          <Spin spinning={loadingFetchLeaveRequestById}>
            <Row className={styles.container} gutter={[20, 20]}>
              <Col xs={24} lg={16}>
                <RequestInformation employeeId={employeeId} />
              </Col>
              <Col xs={24} lg={8}>
                <RightContent viewingLeaveRequest={viewingLeaveRequest} status={status} />
              </Col>
            </Row>
          </Spin>
        </div>
      </PageContainer>
    );
  }
}

export default ManagerViewRequestForm;
