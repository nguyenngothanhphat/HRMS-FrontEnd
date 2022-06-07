import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Spin } from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeft from './components/ViewLeft';
import ViewRightNote from './components/ViewRightNote';
import ViewLeftInitial from './components/ViewLeftInitial';

import RelievingFormalities from './RelievingFormalities';
import styles from './index.less';

const { TabPane } = Tabs;

const EmployeeView = (props) => {
  const { tabName = '', dispatch } = props;
  const {
    acceptedRequest = [],
    companyID = '',
    totalList = [],
    hrManager = {},
    employee = {},
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
          id: _id,
          company: companyID,
          packageType: '',
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

  const fetchData = () => {
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        // status: 'IN-PROGRESS',
      },
    }).then((data) => {
      if (data) {
        setDataRequest(
          data.filter((value) => value.status !== 'DRAFT' && value.status !== 'WITHDRAW'),
        );
        setLoadingFetchList(false);
      }
    });
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'DRAFT',
      },
    }).then((data) => {
      if (data) {
        setDataDraft(data);
        setLoadingFetchList(false);
      }
    });
    dispatch({
      type: 'offboarding/fetchAcceptedRequest',
      payload: {
        status: 'ACCEPTED',
      },
    }).then((data) => {
      if (data !== null) {
        checkIfExistingRequest();
      }
    });
  };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/offboarding/list`);
    } else fetchData();
  }, []);

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
                  <Row className={styles.content} gutter={[20, 20]}>
                    <Col span={16}>
                      {loadingFetchList ? (
                        <Spin className={styles.spinLoading} />
                      ) : (
                        <>
                          {dataDraft.length > 0 || dataRequest.length > 0 ? (
                            <ViewLeft
                              data={
                                // listOffboarding.length > 0 ? listOffboarding : acceptedRequest
                                dataRequest.length > 0 ? dataRequest : dataDraft
                              }
                              fetchData={fetchData}
                              countdata={totalList}
                              hrManager={hrManager}
                            />
                          ) : (
                            <ViewLeftInitial hrManager={hrManager} employee={employee} />
                          )}
                        </>
                      )}
                    </Col>
                    <Col span={8}>
                      {/* {listOffboarding.length > 0 ? <RightDataTable /> : <ViewRight />} */}
                      <ViewRightNote />
                    </Col>
                  </Row>
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
    acceptedRequest,
    totalList,
    locationID,
    companyID,
    employee,
    listOffboarding,
    // loadingFetchList: loading.effects['offboarding/fetchList'],
    loadingAcceptedRequest: loading.effects['offboarding/fetchAcceptedRequest'],
    hrManager,
  }),
)(EmployeeView);
