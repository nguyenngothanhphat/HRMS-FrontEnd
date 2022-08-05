import { Affix, Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { TIMEOFF_COLOR, TIMEOFF_STATUS_NAME } from '@/constants/timeOff';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import History from '../../../History';
import TimeOffHistory from '../../../TimeOffHistory';
import { goToTop } from '@/utils/utils';

const ManagerViewRequestForm = (props) => {
  const {
    timeOff: {
      viewingLeaveRequest: {
        status = '',
        ticketID = '',
        employee: { _id: employeeId = '' } = {},
        history = [],
      } = {},
      viewingLeaveRequest = {},
    } = {},
    loadingFetchLeaveRequestById = false,
    match: { params: { reId: id = '' } = {} },
    dispatch,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'timeOff/fetchLeaveRequestById',
      id,
    });

    goToTop();

    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          viewingLeaveRequest: {},
          projectsList: [],
        },
      });
    };
  }, []);

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
              <RequestInformation employeeId={employeeId} reId={id} />
            </Col>
            <Col xs={24} lg={8}>
              {!isEmpty(history) ? (
                <>
                  <History data={viewingLeaveRequest} status={status} />
                </>
              ) : (
                <>
                  <RightContent data={viewingLeaveRequest} status={status} />
                </>
              )}
              <TimeOffHistory data={viewingLeaveRequest} />
            </Col>
          </Row>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))(ManagerViewRequestForm);
