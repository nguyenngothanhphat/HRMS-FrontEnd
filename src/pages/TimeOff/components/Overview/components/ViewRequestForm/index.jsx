import { Affix, Col, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_COLOR, TIMEOFF_STATUS_NAME } from '@/constants/timeOff';
import RequestHistory from '../RequestHistory';
import RequestInformation from './components/RequestInformation';
import RightContent from './components/RightContent';
import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
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

  render() {
    const {
      timeOff: {
        viewingLeaveRequest: { status = '', ticketID = '', history = [] } = {},
        viewingLeaveRequest = {},
      } = {},
      loadingFetchLeaveRequestById = false,
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
                  {TIMEOFF_STATUS_NAME[status]}
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Spin spinning={loadingFetchLeaveRequestById}>
                <RequestInformation />
              </Spin>
            </Col>
            <Col xs={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  {!loadingFetchLeaveRequestById && (
                    <>
                      {!isEmpty(history) ? (
                        <>
                          <RequestHistory data={viewingLeaveRequest} status={status} />
                        </>
                      ) : (
                        <>
                          <RightContent data={viewingLeaveRequest} status={status} />
                        </>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ViewRequestForm;
