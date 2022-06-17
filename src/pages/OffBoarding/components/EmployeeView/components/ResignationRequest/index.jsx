import { Col, Row, Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { OFFBOARDING } from '@/utils/offboarding';
import { PageContainer } from '@/layouts/layout/src';
import YourRequest from '../YourRequest';
import OffboardingWorkFlow from '../OffboardingWorkFlow';
import DidYouKnow from '../DidYouKnow';
import ThingToConsider from '../ThingToConsider';
import WhatNext from '../WhatNext';
import ChainOfApproval from '../ChainOfApproval';
import Notes from '../Notes';
import RequestDetail from '../RequestDetail';
import styles from './index.less';
import WhatSteps from '../WhatSteps';
import FirstSchedule from '../FirstSchedule';
import QuickLinks from '@/components/QuickLinks';

const { TabPane } = Tabs;
const { STATUS = {}, MEETING_STATUS = {} } = OFFBOARDING;

const ResignationRequest = (props) => {
  const {
    match: { params: { reId = '' } = {} },
    dispatch,
  } = props;
  const {
    loading = false,
    user: { currentUser: { employee = {} } = {} } = {},
    offboarding: { myRequest = {} } = {},
  } = props;

  const { status = '', step = '', meeting: { status: meetingStatus = '' } = {} } = myRequest;

  const getMyRequest = () => {
    dispatch({
      type: 'offboarding/getMyRequestEffect',
      payload: {},
    });
  };

  useEffect(() => {
    if (reId) {
      dispatch({
        type: 'offboarding/getRequestByIdEffect',
        payload: {
          offBoardingId: reId,
        },
      });
    }
  }, [reId]);

  const renderContent = (statusProps) => {
    switch (statusProps) {
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
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} step={step} status={status} />
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
        if (
          meetingStatus &&
          (meetingStatus === MEETING_STATUS.EMPLOYEE_PICK_DATE ||
            meetingStatus === MEETING_STATUS.MANAGER_PICK_DATE ||
            meetingStatus === MEETING_STATUS.DATE_CONFIRMED ||
            meetingStatus === MEETING_STATUS.MANAGER_REJECT_DATE)
        ) {
          return (
            <Row className={styles.content} gutter={[24, 24]}>
              <Col span={24} lg={16}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <YourRequest
                      data={myRequest}
                      getMyRequest={getMyRequest}
                      employee={employee}
                      step={step}
                      status={status}
                    />
                  </Col>
                  <Col span={24}>
                    <WhatNext employee={employee} item={myRequest} />
                  </Col>
                </Row>
              </Col>
              <Col span={24} lg={8}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <ChainOfApproval employee={employee} status={status} />
                  </Col>
                  <Col span={24}>
                    <Notes status={status} />
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        }
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
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
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ChainOfApproval employee={employee} status={status} />
                </Col>
                <Col span={24}>
                  <Notes status={status} />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      }
      case STATUS.ACCEPTED:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <YourRequest data={myRequest} employee={employee} getMyRequest={getMyRequest} />
                </Col>
                <Col span={24}>
                  <WhatSteps />
                </Col>
              </Row>
            </Col>
            <Col span={24} lg={8}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ChainOfApproval employee={employee} status={status} />
                </Col>
                <Col span={24}>
                  <Notes status={status} />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      default:
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={24} lg={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <FirstSchedule
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

  return (
    <PageContainer>
      <div className={styles.ResignationRequest}>
        <div className={styles.tabs}>
          <Tabs activeKey="list">
            <TabPane tab="Terminate work relationship" key="list">
              <div className={styles.paddingContainer}>
                <Spin spinning={loading}>
                  <div className={styles.root}>{renderContent(status)}</div>
                </Spin>
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
  loading: loading.effects['offboarding/getRequestByIdEffect'],
}))(ResignationRequest);
