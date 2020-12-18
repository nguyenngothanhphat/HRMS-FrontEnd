import React, { Component } from 'react';
import { Col, Tabs, Row } from 'antd';
// import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
import { Link, connect } from 'umi';
import addIcon from '@/assets/addTicket.svg';
import TeamRequest from './TeamRequest';
import MyRequestContent from '../../../components/TabMyRequest';
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
    totalListTeamRequest,
    totalList,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
  }),
)
class HRrequestTable extends Component {
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
    const {
      listTeamRequest = [],
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
    } = this.props;

    const resignationRequest = (
      <div style={{ padding: '17px' }}>
        <img src={addIcon} alt="" style={{ marginRight: '5px' }} />
        <Link to="offboarding/resignation-request">
          <span className={styles.buttonRequest}>Initiate Resignation Request</span>
        </Link>
      </div>
    );

    return (
      <Row className={styles.hrContent} gutter={[40, 0]}>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            tabBarExtraContent={resignationRequest}
          >
            <TabPane tab="Team request" key="1">
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
                <MyRequestContent data={listOffboarding} countdata={totalList} />
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

export default HRrequestTable;
