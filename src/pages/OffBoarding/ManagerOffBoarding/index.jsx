import React, { Component } from 'react';
import { Col, Tabs, Row, Affix, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import { Link, connect } from 'umi';
// import TableAssigned from '@/components/TableAssigned';
import filterIcon from '@/assets/filterIcon.svg';
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
    const { dispatch } = this.props;
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

    const checkInprogress = totalList.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    const checkAccepted = totalList.find(({ _id }) => _id === 'ACCEPTED') || {};

    const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;

    const renderSearchFilter = () => (
      <div className={styles.searchFilter}>
        <Button
          type="link"
          shape="round"
          icon={<img src={filterIcon} alt="" className={styles.searchFilter__icon} />}
          size="small"
        />

        <Input
          size="large"
          placeholder="Search for Ticket numer, resignee, request ..."
          onChange={this.onChangeInput}
          prefix={<SearchOutlined />}
          onPressEnter={this.onPressEnter}
          className={styles.searchFilter__input}
        />
      </div>
    );

    return (
      <PageContainer>
        <div className={styles.managerContainer}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship / Initiate Resignation Request
              </p>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={24}>
              <div className={styles.content__top}>
                <div className={styles.text}>Team Requests</div>
                <>
                  {!checkSendRequest && (
                    <Button className={styles.btnInitiate}>
                      <Link to="/offboarding/resignation-request">
                        <span className={styles.btnText}>Initiate Resignation Request</span>
                      </Link>
                    </Button>
                  )}
                </>
              </div>
            </Col>
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                className={styles.tabComponent}
                tabBarExtraContent={renderSearchFilter()}
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
                {/* <TabPane tab="Assigned" key="3">
                  <div style={{ padding: '10px 18px' }}>
                    <TableAssigned />
                  </div>
                </TabPane> */}
              </Tabs>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ManagerOffBoading;
