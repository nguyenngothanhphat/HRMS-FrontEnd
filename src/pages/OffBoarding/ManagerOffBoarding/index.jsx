import React, { Component } from 'react';
import { Col, Tabs, Row, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { Link, connect } from 'umi';
import TableAssigned from '@/components/TableAssigned';
import addIcon from '@/assets/addTicket.svg';
import TeamRequest from './component/TeamRequest';
import MyRequestContent from '../components/TabMyRequest';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      listTeamRequest = [],
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
  }) => ({
    listOffboarding,
    totalList,
    totalListTeamRequest,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
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
      type: 'offboarding/fetchList',
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
    const {
      listTeamRequest = [],
      totalListTeamRequest,
      listOffboarding = [],
      totalList = [],
      hrManager = {},
    } = this.props;

    const resignationRequest = (
      <div style={{ padding: '17px' }}>
        <img src={addIcon} alt="" style={{ marginRight: '5px' }} />
        <Link to="/offboarding/resignation-request">
          <span className={styles.buttonRequest}>Initiate Resignation Request</span>
        </Link>
      </div>
    );

    const checkInprogress = totalList.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    const checkAccepted = totalList.find(({ _id }) => _id === 'ACCEPTED') || {};

    const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;

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
                tabBarExtraContent={!checkSendRequest && resignationRequest}
              >
                <TabPane tab="Team Request" key="1">
                  <div className={styles.tableTab}>
                    <TeamRequest
                      data={listTeamRequest}
                      countdata={totalListTeamRequest}
                      hrManager={hrManager}
                    />
                  </div>
                </TabPane>
                <TabPane tab="My Request" key="2">
                  <div className={styles.tableTab}>
                    <MyRequestContent
                      data={listOffboarding}
                      countdata={totalList}
                      hrManager={hrManager}
                    />
                  </div>
                </TabPane>
                <TabPane tab="Assigned" key="3">
                  <div style={{ padding: '10px 18px' }}>
                    <TableAssigned />
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
