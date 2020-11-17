import React, { Component } from 'react';
import { Col, Tabs, Row } from 'antd';
// import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
import { Link } from 'umi';
import addIcon from '@/assets/addTicket.svg';
import TabContent from './tabContent';
// import MyRequest from '../../../EmployeeOffBoarding/';
import styles from './index.less';

class HRrequestTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { TabPane } = Tabs;

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
            {/* {data.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <div className={styles.tableTab}>
                  <TabContent />
                </div>
              </TabPane>
            ))} */}
            <TabPane tab="'Team request" key="1">
              <div className={styles.tableTab}>
                <TabContent />
              </div>
            </TabPane>
            <TabPane tab="My Request" key="2">
              tab2
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

export default HRrequestTable;
