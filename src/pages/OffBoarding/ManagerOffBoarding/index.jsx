import React, { Component } from 'react';
import { Col, Tabs, Row, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { Link, connect } from 'umi';
import addIcon from '@/assets/addTicket.svg';
import TabContent from './component/tabContent';
import MyRequestContent from '../components/TabMyRequest';

import styles from './index.less';

@connect(
  ({
    offboarding: { listTeamRequest = [] } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
  }) => ({
    locationID,
    companyID,
    listTeamRequest,
  }),
)
class ManagerOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, locationID, companyID } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchListTeamRequest',
      payload: {
        status: 'IN-PROGRESS',
      },
    });
    dispatch({
      type: 'offboarding/fetchApprovalFlowList',
      payload: {
        company: companyID,
        location: locationID,
      },
    });
  }

  render() {
    const { TabPane } = Tabs;
    const { listTeamRequest = [] } = this.props;

    const resignationRequest = (
      <div style={{ padding: '17px' }}>
        <img src={addIcon} alt="" style={{ marginRight: '5px' }} />
        <Link to="/manager-offboarding/resignation-request">
          <span className={styles.buttonRequest}>Initiate Resignation Request</span>
        </Link>
      </div>
    );

    return (
      <PageContainer>
        <div className={styles.managerContainer}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relationship</p>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                className={styles.tabComponent}
                tabBarExtraContent={resignationRequest}
              >
                <TabPane tab="Team Request" key="1">
                  <div className={styles.tableTab}>
                    <TabContent data={listTeamRequest} />
                  </div>
                </TabPane>
                <TabPane tab="My Request" key="2">
                  <div className={styles.tableTab}>
                    <MyRequestContent />
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ManagerOffBoading;
