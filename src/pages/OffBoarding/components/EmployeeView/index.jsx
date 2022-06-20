import { Col, Row, Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { OFFBOARDING } from '@/utils/offboarding';
import { PageContainer } from '@/layouts/layout/src';
import DidYouKnow from './components/DidYouKnow';
import FirstSchedule from './components/FirstSchedule';
import OffboardingWorkFlow from './components/OffboardingWorkFlow';
import QuickLinks from './components/QuickLinks';
import RequestDetail from './components/RequestDetail';
import ThingToConsider from './components/ThingToConsider';
import YourRequest from './components/YourRequest';
import styles from './index.less';

const { TabPane } = Tabs;
const { STATUS = {} } = OFFBOARDING;

const EmployeeView = (props) => {
  const { tabName = '', dispatch } = props;
  const {
    loadingStatus = false,
    user: { currentUser: { employee = {} } = {} } = {},
    offboarding: { myRequest = {} } = {},
  } = props;

  const { status = '' } = myRequest;

  const getMyRequest = () => {
    dispatch({
      type: 'offboarding/getMyRequestEffect',
      payload: {},
    });
  };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/offboarding/my-request`);
    } else getMyRequest();
  }, []);

  const renderContent = () => {
    switch (status) {
      case STATUS.DRAFT:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <YourRequest
                    data={myRequest}
                    employee={employee}
                    status={status}
                    getMyRequest={getMyRequest}
                    action="request-detail"
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} data={myRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <DidYouKnow employee={employee} />
                </Col>
                <Col span={24}>
                  <ThingToConsider />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      case STATUS.IN_PROGRESS: {
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequestDetail data={myRequest} getMyRequest={getMyRequest} employee={employee} />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} data={myRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ThingToConsider />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      }
      case STATUS.ACCEPTED: {
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequestDetail data={myRequest} getMyRequest={getMyRequest} employee={employee} />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} data={myRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ThingToConsider />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      }
      default:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <FirstSchedule data={myRequest} employee={employee} />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} data={myRequest} />
                </Col>
              </Row>
            </Col>
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ThingToConsider />
                </Col>
                <Col span={24}>
                  <QuickLinks />
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
            activeKey={tabName || 'my-request'}
            onChange={(key) => {
              history.push(`/offboarding/${key}`);
            }}
          >
            <TabPane tab="Terminate work relationship" key="my-request">
              <div className={styles.paddingHR}>
                <div className={styles.root}>
                  <Spin spinning={loadingStatus}>
                    {myRequest !== null ? (
                      renderContent()
                    ) : (
                      <Row className={styles.content} gutter={[24, 24]}>
                        <Col span={24} lg={16}>
                          <Row gutter={[24, 24]}>
                            <Col span={24}>
                              <FirstSchedule data={myRequest} employee={employee} />
                            </Col>
                            <Col span={24}>
                              <OffboardingWorkFlow employee={employee} data={myRequest} />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24} lg={8}>
                          <Row gutter={[24, 24]}>
                            <Col span={24}>
                              <ThingToConsider />
                            </Col>
                            <Col span={24}>
                              <QuickLinks />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </Spin>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(({ offboarding, user, loading }) => ({
  offboarding,
  user,
  loadingStatus: loading.effects['offboarding/getMyRequestEffect'],
}))(EmployeeView);
