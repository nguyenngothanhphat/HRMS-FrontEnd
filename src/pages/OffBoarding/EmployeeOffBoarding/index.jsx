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
    this.state = {};
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
    const { acceptedRequest = [], loadingAcceptedRequest } = this.props;
    return acceptedRequest.length > 0 && !loadingAcceptedRequest;
  };

  render() {
    const { listOffboarding = [], totalList = [], hrManager = {} } = this.props;
    const openRelievingFormalitiesTab = this.checkIfExistingInprogressRequest();

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

              <TabPane disabled={!openRelievingFormalitiesTab} tab="Relieving Formalities" key="2">
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
