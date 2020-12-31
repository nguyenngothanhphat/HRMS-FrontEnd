import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

class MineOrTeamTabs extends PureComponent {
  render() {
    const { tab = 0, type = 0, tabName = '' } = this.props;
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs destroyInactiveTabPane tabPosition="top" tabBarGutter={40} defaultActiveKey="1">
          <TabPane tab={`Team ${tabName}`} key="1">
            <TimeOffRequestTab tab={tab} type={type} category="TEAM" />
          </TabPane>
          <TabPane tab={`All ${tabName}`} key="2">
            <TimeOffRequestTab tab={tab} type={type} category="ALL" />
          </TabPane>
          <TabPane tab={`My ${tabName}`} key="3">
            <TimeOffRequestTab tab={tab} type={type} category="MY" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;
