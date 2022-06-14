import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Spin, Card } from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeftInitial from './components/ViewLeftInitial';
import ChainOfApproval from './components/ChainOfApproval';
import RequestDraft from './components/RequestDraft';
import ConfirmRequest from './components/ConfirmRequest';
import RelievingFormalities from './RelievingFormalities';
import styles from './index.less';
import OffboardingWorkFlow from './components/OffboardingWorkFlow';
import ViewRightQuicklLink from './components/ViewRightQuicklLink';
import ViewRight from './components/ViewRight';
import DidYouKnow from './components/DidYouKnow';
import ViewRightNote from './components/ViewRightNote';

const { TabPane } = Tabs;

const EmployeeView = (props) => {
  const { tabName = '', dispatch } = props;
  const {
    acceptedRequest = [],
    companyID = '',
    totalList = [],
    hrManager = {},
    employee = {},
    status = '',
    loadingStatus = false,
  } = props;
  const [relievingInQueue, setRelievingInQueue] = useState(false);
  const [loadingFetchList, setLoadingFetchList] = useState(true);
  const [dataDraft, setDataDraft] = useState([]);
  const [dataRequest, setDataRequest] = useState([]);

  const checkIfExistingRequest = () => {
    if (acceptedRequest.length > 0) {
      const accepted = acceptedRequest[0]; // only one offboarding request
      const { _id = '' } = accepted;
      dispatch({
        type: 'offboarding/fetchRelievingDetailsById',
        payload: {
          offboardingId: _id,
          company: companyID,
        },
      }).then((res) => {
        const { data = {} } = res;
        const { item: { relievingStatus = '' } = {} } = data;
        if (relievingStatus === 'IN-QUEUES') {
          setRelievingInQueue(true);
        }
      });
    }
  };

  const fetchOffboardingDetailById = () => {
    dispatch({
      type: 'offboarding/fetchOffboardingDetailById',
      payload: {
        status,
      },
    });
  };

  const fetchStatus = () => {
    dispatch({
      type: 'offboarding/fetchStatus',
      payload: {},
    }).then((data) => {
      if (data !== null) {
        fetchOffboardingDetailById();
      }
    });
  };

  // const fetchData = () => {
  //   dispatch({
  //     type: 'offboarding/fetchList',
  //     payload: {
  //       // status: 'IN-PROGRESS',
  //     },
  //   }).then((data) => {
  //     if (data) {
  //       setDataRequest(
  //         data.filter((value) => value.status !== 'DRAFT' && value.status !== 'WITHDRAW'),
  //       );
  //       setLoadingFetchList(false);
  //     }
  //   });
  //   dispatch({
  //     type: 'offboarding/fetchList',
  //     payload: {
  //       status: 'DRAFT',
  //     },
  //   }).then((data) => {
  //     if (data) {
  //       setDataDraft(data);
  //       setLoadingFetchList(false);
  //     }
  //   });
  //   dispatch({
  //     type: 'offboarding/fetchAcceptedRequest',
  //     payload: {
  //       status: 'ACCEPTED',
  //     },
  //   }).then((data) => {
  //     if (data !== null) {
  //       checkIfExistingRequest();
  //     }
  //   });
  // };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/offboarding/list`);
    } else fetchStatus();
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [status]);

  const renderContent = (statusProps) => {
    switch (statusProps) {
      case '':
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <ViewLeftInitial
                    data={dataRequest.length > 0 ? dataRequest : dataDraft}
                    // fetchData={fetchData}
                    countdata={totalList}
                    hrManager={hrManager}
                    employee={employee}
                  />
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
                  <ViewRightQuicklLink />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      case 'Draft':
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequestDraft
                    data={dataRequest.length > 0 ? dataRequest : dataDraft}
                    // fetchData={fetchData}
                    countdata={totalList}
                    hrManager={hrManager}
                    employee={employee}
                  />
                </Col>
                <Col span={24}>
                  <OffboardingWorkFlow employee={employee} />
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
      case 'In Progress':
        return (
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <RequestDraft
                    data={dataRequest.length > 0 ? dataRequest : dataDraft}
                    // fetchData={fetchData}
                    countdata={totalList}
                    hrManager={hrManager}
                    employee={employee}
                  />
                </Col>
                <Col span={24}>
                  <ConfirmRequest />
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
        return '';
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
                  <Spin spinning={loadingStatus}>{renderContent(status)}</Spin>
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
    offboarding: {
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      acceptedRequest = [],
      status = '',
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
        employee = {},
      } = {},
    } = {},
    loading,
  }) => ({
    status,
    acceptedRequest,
    totalList,
    locationID,
    companyID,
    employee,
    listOffboarding,
    // loadingFetchList: loading.effects['offboarding/fetchList'],
    loadingStatus: loading.effects['offboarding/fetchStatus'],
    hrManager,
  }),
)(EmployeeView);
