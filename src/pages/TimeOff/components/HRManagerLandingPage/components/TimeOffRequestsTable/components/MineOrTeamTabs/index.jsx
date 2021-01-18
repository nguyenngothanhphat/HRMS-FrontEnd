import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ timeOff }) => ({
  timeOff,
}))
class MineOrTeamTabs extends PureComponent {
  saveCurrentTab = (type) => {
    const { dispatch, timeOff: { currentMineOrTeamTab = '' } = {} } = this.props;
    if (currentMineOrTeamTab !== String(type))
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentMineOrTeamTab: String(type),
          currentFilterTab: '1',
        },
      });
  };

  render() {
    const {
      tab = 0,
      type = 0,
      tabName = '',
      timeOff: { currentMineOrTeamTab = '' } = {},
    } = this.props;
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs
          destroyInactiveTabPane
          tabPosition="top"
          tabBarGutter={40}
          onTabClick={(activeKey) => this.saveCurrentTab(activeKey)}
          activeKey={currentMineOrTeamTab}
        >
          <TabPane tab={`Team ${tabName}`} key="1">
            <TimeOffRequestTab tab={tab} type={type} category="TEAM" />
          </TabPane>
          <TabPane tab={`My ${tabName}`} key="2">
            <TimeOffRequestTab tab={tab} type={type} category="MY" />
          </TabPane>
          <TabPane tab={`All ${tabName}`} key="3">
            <TimeOffRequestTab tab={tab} type={type} category="ALL" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;
