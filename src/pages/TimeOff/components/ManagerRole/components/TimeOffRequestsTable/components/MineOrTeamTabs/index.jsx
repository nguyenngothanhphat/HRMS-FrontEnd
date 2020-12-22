import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

class MineOrTeamTabs extends PureComponent {
  render() {
    const { tab = 0, type = 0 } = this.props;
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs tabPosition="top" tabBarGutter={40} defaultActiveKey="1">
          <TabPane tab="Team Leave Request" key="1">
            <TimeOffRequestTab tab={tab} type={type} category="TEAM" />
          </TabPane>
          <TabPane tab="My Leave Request" key="2">
            <TimeOffRequestTab tab={tab} type={type} category="MY" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;
