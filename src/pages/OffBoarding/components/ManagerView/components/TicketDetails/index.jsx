import { Affix, Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import RequesteeDetails from './components/RequesteeDetails';
import CurrentProjectDetails from './components/CurrentProjectDetails';
import { getEmployeeName } from '@/utils/offboarding';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import WhatNext from './components/WhatNext';

const TicketDetails = (props) => {
  const {
    dispatch,
    match: { params: { id = '' } = {} },
    offboarding: {
      myRequest: { ticketID = '', employee = {} } = {},
      myRequest = {},
      listProjectByEmployee: projectList = [],
    } = {},
    loadingFetchData = false,
  } = props;

  const fetchData = () => {
    dispatch({
      type: 'offboarding/fetchRequestById',
      payload: {
        id,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <PageContainer>
      <div className={styles.TicketDetails}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>
              [Ticket id: {ticketID}] Terminate work relationship with{' '}
              {getEmployeeName(employee.generalInfo)}
            </p>
          </div>
        </Affix>
        <Spin spinning={loadingFetchData}>
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequesteeDetails employee={employee} />
                </Col>
                <Col span={24}>
                  <CurrentProjectDetails projectList={projectList} />
                </Col>
                <Col span={24}>
                  <ResignationRequestDetail item={myRequest} />
                </Col>
                <Col span={24}>
                  <WhatNext item={myRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={8} />
          </Row>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingFetchData: loading.effects['offboarding/fetchRequestById'],
}))(TicketDetails);
