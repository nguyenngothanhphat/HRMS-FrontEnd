import React, { Component } from 'react';
import { Row, Col, Tabs, Button } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeft from './components/ViewLeft';
import ViewRight from './components/ViewRight';
import RightDataTable from './components/RightContent';

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
    loadingFetchList: loading.effects['offboarding/fetchList'],
    loadingAcceptedRequest: loading.effects['offboarding/fetchAcceptedRequest'],
    hrManager,
  }),
)
class EmployeeOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relievingInQueue: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'IN-PROGRESS',
      },
    });
    dispatch({
      type: 'offboarding/fetchAcceptedRequest',
      payload: {
        status: 'ACCEPTED',
      },
    }).then((data) => {
      if (data !== null) {
        this.checkIfExistingInprogressRequest();
      }
    });
  }

  viewActivityLogs = () => {
    return (
      <Button className={styles.viewActivityLogs} type="secondary">
        View Activity log (15)
      </Button>
    );
  };

  checkIfExistingInprogressRequest = () => {
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
        const { relievingStatus = '' } = data;
        if (relievingStatus === 'IN-QUEUES') {
          this.setState({
            relievingInQueue: true,
          });
        }
      });
    }
  };

  render() {
    const { listOffboarding = [], totalList = [], hrManager = {} } = this.props;
    const { relievingInQueue } = this.state;

    return (
      <PageContainer>
        <div className={styles.EmployeeOffboarding}>
          <div className={styles.tabs}>
            <Tabs defaultActiveKey="1" tabBarExtraContent={this.viewActivityLogs()}>
              <TabPane tab="Terminate work relationship" key="1">
                <div className={styles.paddingHR}>
                  <div className={styles.root}>
                    <Row className={styles.content} gutter={[40, 0]}>
                      <Col span={18}>
                        <ViewLeft
                          data={listOffboarding}
                          countdata={totalList}
                          hrManager={hrManager}
                        />
                      </Col>
                      <Col span={6}>
                        {listOffboarding.length > 0 ? <RightDataTable /> : <ViewRight />}
                      </Col>
                    </Row>
                  </div>
                </div>
              </TabPane>

              <TabPane disabled={!relievingInQueue} tab="Relieving Formalities" key="2">
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
