import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

class MineOrTeamTabs extends PureComponent {
  render() {
    const { data1 = [], data2 = [], type = 0 } = this.props;
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs
          tabPosition="top"
          tabBarGutter={40}
          defaultActiveKey="1"
          // onTabClick={this.onTabClick}
        >
          <TabPane tab="Team Leave Request" key="1">
            <TimeOffRequestTab data={data1} type={type} category="TEAM" />
          </TabPane>
          <TabPane tab="My Leave Request" key="2">
            <TimeOffRequestTab data={data2} type={type} category="MY" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;
