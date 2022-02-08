import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';
import SearchTimeOff from '../../../../../SearchTimeOff/index';

const { TabPane } = Tabs;

@connect(({ timeOff, timeOff: { filter = {} } }) => ({
  timeOff,
  filter,
}))
class MineOrTeamTabs extends Component {
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
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
    dispatch({
      type: 'timeOff/clearFilter',
    });
  };

  render() {
    const { tab = 0, type = 0, timeOff: { currentMineOrTeamTab = '' } = {} } = this.props;
    const renderTableTitle = {
      right: <SearchTimeOff />,
    };
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs
          destroyInactiveTabPane
          tabPosition="top"
          // tabBarGutter={40}
          tabBarExtraContent={renderTableTitle}
          onTabClick={(activeKey) => this.saveCurrentTab(activeKey)}
          activeKey={currentMineOrTeamTab}
        >
          <TabPane tab="Team Requests" key="1">
            <TimeOffRequestTab tab={tab} type={type} category="TEAM" />
          </TabPane>
          <TabPane tab="My Requests" key="2">
            <TimeOffRequestTab tab={tab} type={type} category="MY" />
          </TabPane>
          {/* <TabPane tab="All Requests" key="3">
            <TimeOffRequestTab tab={tab} type={type} category="ALL" />
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;
