import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getShortType } from '@/utils/timeOff';
import SearchContent from '../../../../../SearchContent';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ timeOff, timeOff: { filter = {} }, user: { permissions = {} } }) => ({
  timeOff,
  filter,
  permissions,
}))
class RequestScopeTabs extends PureComponent {
  saveCurrentTab = (type) => {
    const { dispatch, timeOff: { currentScopeTab = '' } = {} } = this.props;

    if (currentScopeTab !== String(type))
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentScopeTab: String(type),
          currentFilterTab: '1',
        },
      });
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
    dispatch({
      type: 'timeOff/clearFilter',
      payload: {},
    });
  };

  getActiveKey = (currentScopeTab) => {
    const { permissions = {} } = this.props;
    const viewManagerTimeoff = permissions.viewManagerTimeoff !== -1;
    const viewHRTimeoff = permissions.viewHRTimeoff !== -1;
    const activeTabKeys = [];
    if (viewHRTimeoff) activeTabKeys.push('1');
    if (viewManagerTimeoff) activeTabKeys.push('2');
    activeTabKeys.push('3');
    if (activeTabKeys.includes(currentScopeTab)) {
      return currentScopeTab;
    }
    return activeTabKeys[0];
  };

  render() {
    const {
      tab = 0,
      type = 0,
      timeOff: { currentScopeTab = '', currentLeaveTypeTab = '' } = {},
      permissions = {},
      saveCurrentTypeTab = () => {},
    } = this.props;

    const renderTableTitle = {
      right: (
        <SearchContent
          saveCurrentTypeTab={saveCurrentTypeTab}
          shortType={getShortType(currentLeaveTypeTab)}
        />
      ),
    };

    const viewManagerTimeoff = permissions.viewManagerTimeoff !== -1;
    const viewHRTimeoff = permissions.viewHRTimeoff !== -1;

    return (
      <div className={styles.RequestScopeTabs}>
        <Tabs
          destroyInactiveTabPane
          tabPosition="top"
          // tabBarGutter={40}
          tabBarExtraContent={renderTableTitle}
          onTabClick={(activeKey) => this.saveCurrentTab(activeKey)}
          activeKey={this.getActiveKey(currentScopeTab)}
        >
          {viewHRTimeoff && (
            <TabPane tab="Company Wide Requests" key="1">
              <TimeOffRequestTab tab={tab} type={type} category="ALL" />
            </TabPane>
          )}
          {viewManagerTimeoff && (
            <TabPane tab="Team Requests" key="2">
              <TimeOffRequestTab tab={tab} type={type} category="TEAM" />
            </TabPane>
          )}
          <TabPane tab="My Requests" key="3">
            <TimeOffRequestTab tab={tab} type={type} category="MY" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RequestScopeTabs;
