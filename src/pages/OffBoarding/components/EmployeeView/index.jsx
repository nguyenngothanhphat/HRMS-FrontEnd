import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Spin } from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeftInitial from './components/ViewLeftInitial';
import ChainOfApproval from './components/ChainOfApproval';
import RequestDetail from './components/RequestDetail';
import YourRequest from './components/YourRequest';
import WhatNext from './components/WhatNext';
import RelievingFormalities from './RelievingFormalities';
import styles from './index.less';
import OffboardingWorkFlow from './components/OffboardingWorkFlow';
import ViewRightQuickLink from './components/ViewRightQuickLink';
import ViewRight from './components/ViewRight';
import DidYouKnow from './components/DidYouKnow';
import ViewRightNote from './components/ViewRightNote';
import { OFFBOARDING } from '@/utils/offboarding';

const { TabPane } = Tabs;
const { STATUS = {} } = OFFBOARDING;
const EmployeeView = (props) => {
  const { tabName = '', dispatch } = props;
  const {
    employee = {},
    myRequest: { status = '', step = '' } = {},
    myRequest = {},
    loadingStatus = false,
  } = props;

  const [relievingInQueue, setRelievingInQueue] = useState(false);

  const getMyRequest = () => {
    dispatch({
      type: 'offboarding/getMyRequestEffect',
      payload: {},
    });
  };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/offboarding/list`);
    } else getMyRequest();
  }, []);

  const renderContent = (statusProps) => {
    switch (statusProps) {
      case STATUS.DELETED:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ViewLeftInitial employee={employee} />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} />
                </Col>
              </Row>
            </Col>
            <Col span={7}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ViewRight />
                </Col>
                <Col span={24}>
                  <ViewRightQuickLink />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      case STATUS.DRAFT:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <YourRequest
                    data={myRequest}
                    employee={employee}
                    status={status}
                    getMyRequest={getMyRequest}
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} step={step} status={status} />
                </Col>
              </Row>
            </Col>
            <Col span={7}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <DidYouKnow employee={employee} />
                </Col>
                <Col span={24}>
                  <ViewRight />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      case STATUS.IN_PROGRESS:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequestDetail
                    data={myRequest}
                    // fetchData={fetchData}
                    getMyRequest={getMyRequest}
                    employee={employee}
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} step={step} status={status} />
                </Col>
              </Row>
            </Col>
            <Col span={7}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ChainOfApproval employee={employee} />
                </Col>
                <Col span={24}>
                  <ViewRightNote status={status} />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      default:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ViewLeftInitial
                    data={myRequest}
                    // fetchData={fetchData}
                    employee={employee}
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} status={status} step={step} />
                </Col>
              </Row>
            </Col>
            <Col span={7}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ViewRight />
                </Col>
                <Col span={24}>
                  <ViewRightQuickLink />
                </Col>
              </Row>
            </Col>
          </Row>
        );
    }
  };

  if (!tabName) return '';
  return (
    <PageContainer>
      <div className={styles.EmployeeView}>
        <div className={styles.tabs}>
          <Tabs
            activeKey={tabName || 'list'}
            onChange={(key) => {
              history.push(`/offboarding/${key}`);
            }}
          >
            <TabPane tab="Terminate work relationship" key="list">
              <div className={styles.paddingHR}>
                <div className={styles.root}>
                  <Spin spinning={loadingStatus}>
                    {myRequest !== null ? (
                      renderContent(status)
                    ) : (
                      <Row className={styles.content} gutter={[24, 24]}>
                        <Col span={17}>
                          <Row gutter={[24, 24]}>
                            <Col span={24}>
                              <ViewLeftInitial
                                data={myRequest}
                                // fetchData={fetchData}
                                employee={employee}
                              />
                            </Col>
                            <Col span={24}>
                              <OffboardingWorkFlow
                                employee={employee}
                                status={status}
                                step={step}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={7}>
                          <Row gutter={[24, 24]}>
                            <Col span={24}>
                              <ViewRight />
                            </Col>
                            <Col span={24}>
                              <ViewRightQuickLink />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </Spin>
                </div>
              </div>
            </TabPane>

            <TabPane
              disabled={!relievingInQueue}
              tab="Relieving Formalities"
              key="relieving-formalities"
            >
              <RelievingFormalities />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    offboarding: { myRequest = {} } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
        employee = {},
      } = {},
    } = {},
    loading,
  }) => ({
    myRequest,
    locationID,
    companyID,
    employee,
    loadingStatus: loading.effects['offboarding/getMyRequestEffect'],
  }),
)(EmployeeView);
