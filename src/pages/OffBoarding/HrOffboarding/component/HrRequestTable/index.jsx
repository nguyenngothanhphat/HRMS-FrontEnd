import React, { Component } from 'react';
import { Col, Tabs, Row } from 'antd';
// import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
import { Link, connect } from 'umi';
import addIcon from '@/assets/addTicket.svg';
import TabContent from './tabContent';
import MyRequestContent from '../../../components/TabMyRequest';
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
    const { listTeamRequest = [] } = this.props;

    const resignationRequest = (
      <div style={{ padding: '17px' }}>
        <img src={addIcon} alt="" style={{ marginRight: '5px' }} />
        <Link to="/hr-offboarding/resignation-request">
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
    );
  }
}

export default HRrequestTable;
