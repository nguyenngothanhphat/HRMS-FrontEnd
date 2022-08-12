import { Col, Row, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { OFFBOARDING } from '@/constants/offboarding';
import DidYouKnow from './components/DidYouKnow';
import FirstSchedule from './components/FirstSchedule';
import OffboardingWorkFlow from './components/OffboardingWorkFlow';
import QuickLinks from './components/QuickLinks';
import RequestDetail from './components/RequestDetail';
import ThingToConsider from './components/ThingToConsider';
import YourRequest from './components/YourRequest';
import styles from './index.less';

const { STATUS = {} } = OFFBOARDING;

const MyRequest = (props) => {
  const {
    loadingStatus = false,
    user: { currentUser: { employee = {} } = {} } = {},
    offboarding: { myRequest = {} } = {},
    getMyRequest = () => {},
  } = props;

  const { status = '' } = myRequest;

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
      case STATUS.REJECTED: {
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

  return (
    <div className={styles.MyRequest}>
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
  );
};

export default connect(({ offboarding, user, loading }) => ({
  offboarding,
  user,
  loadingStatus: loading.effects['offboarding/getMyRequestEffect'],
}))(MyRequest);
