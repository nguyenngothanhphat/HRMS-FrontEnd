import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import LeaveRequestTab from './components/LeaveRequestTab';

import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOffRequests extends PureComponent {
  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Time Off Requests</span>
      </div>
    ),
  };

  render() {
    return (
      <div className={styles.TimeOffRequests}>
        <Tabs tabBarGutter={40} defaultActiveKey="1" tabBarExtraContent={this.renderTableTitle}>
          <TabPane tab="Leave Request" key="1">
            <LeaveRequestTab />
          </TabPane>
          <TabPane tab="Special Leave Request" key="2">
            <h2>Special Leave Request</h2>
          </TabPane>
          <TabPane tab="LWP Request" key="3">
            <h2>LWP Request</h2>
          </TabPane>
          <TabPane tab="Compoff Request" key="4">
            <h2>Compoff Request</h2>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
