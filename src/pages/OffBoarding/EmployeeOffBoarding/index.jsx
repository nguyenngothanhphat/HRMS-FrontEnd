import React, { Component } from 'react';
import { Row, Col, Tabs, Button, Spin } from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeft from './components/ViewLeft';
import ViewRight from './components/ViewRight';
// import RightDataTable from './components/RightContent';
import ViewLeftInitial from './components/ViewLeftInitial';

import RelievingFormalities from './RelievingFormalities';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
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
      } = {},
    } = {},
    loading,
  }) => ({
    acceptedRequest,
    totalList,
    locationID,
    companyID,
    listOffboarding,
    // loadingFetchList: loading.effects['offboarding/fetchList'],
    loadingAcceptedRequest: loading.effects['offboarding/fetchAcceptedRequest'],
    hrManager,
  }),
)
class EmployeeOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relievingInQueue: false,
      dataDraft: [],
      dataRequest: [],
      loadingFetchList: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        // status: 'IN-PROGRESS',
      },
    }).then((data) => {
      if (data) {
        this.setState({
          dataRequest: data.filter(
            (value) => value.status !== 'DRAFT' && value.status !== 'WITHDRAW',
          ),
          loadingFetchList: false,
        });
      }
    });
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'DRAFT',
      },
    }).then((data) => {
      if (data) {
        this.setState({
          dataDraft: data,
          loadingFetchList: false,
        });
      }
    });
    dispatch({
      type: 'offboarding/fetchAcceptedRequest',
      payload: {
        status: 'ACCEPTED',
      },
    }).then((data) => {
      if (data !== null) {
        this.checkIfExistingRequest();
      }
    });
  };

  viewActivityLogs = () => {
    return (
      <Button className={styles.viewActivityLogs} type="secondary">
        View Activity log (15)
      </Button>
    );
  };

  checkIfExistingRequest = () => {
    const { acceptedRequest = [], companyID = '', dispatch } = this.props;
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
          this.setState({
            relievingInQueue: true,
          });
        }
      });
    }
  };

  render() {
    const {
      // listOffboarding = [],
      totalList = [],
      hrManager = {},
      // acceptedRequest = [],
      tabName = '',
    } = this.props;
    const { relievingInQueue, dataDraft = [], dataRequest = [], loadingFetchList } = this.state;

    return (
      <PageContainer>
        <div className={styles.EmployeeOffboarding}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={tabName || 'terminate-work-relationship'}
              onChange={(key) => {
                history.push(`/offboarding/${key}`);
              }}
            >
              <TabPane tab="Terminate work relationship" key="terminate-work-relationship">
                <div className={styles.paddingHR}>
                  <div className={styles.root}>
                    <Row className={styles.content} gutter={[20, 20]}>
                      <Col span={18}>
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
                                fetchData={this.fetchData}
                                countdata={totalList}
                                hrManager={hrManager}
                              />
                            ) : (
                              <ViewLeftInitial hrManager={hrManager} />
                            )}
                          </>
                        )}
                      </Col>
                      <Col span={6}>
                        {/* {listOffboarding.length > 0 ? <RightDataTable /> : <ViewRight />} */}
                        <ViewRight />
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
  }
}

export default EmployeeOffBoading;
