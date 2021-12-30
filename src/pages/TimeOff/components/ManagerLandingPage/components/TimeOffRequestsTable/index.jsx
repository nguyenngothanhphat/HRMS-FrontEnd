import React, { useEffect } from 'react';
import { Tabs, Skeleton } from 'antd';
import { connect } from 'umi';
import MineOrTeamTabs from './components/MineOrTeamTabs';

import styles from './index.less';

const { TabPane } = Tabs;

const TimeOffRequestsTable = (props) => {
  const {
    dispatch,
    timeOff: { currentLeaveTypeTab = '', timeOffTypesByCountry = [] } = {},
    loadingTimeOffType = false,
  } = props;

  const saveCurrentTypeTab = (type) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentFilterTab: '1',
      },
    });
    let arr = [];
    switch (type) {
      case '1':
        arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'A');
        break;
      case '2':
        arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'C');
        break;
      case '3':
        arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'B');
        break;
      case '4':
        arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'D');
        break;
      default:
        arr = [];
        break;
    }
    arr = arr.map((item) => item._id);
    dispatch({
      type: 'timeOff/saveFilter',
      payload: {
        type: arr,
        isSearch: true,
      },
    });
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: 1,
      },
    });
  };

  useEffect(() => {
    saveCurrentTypeTab('1');
  }, [JSON.stringify(timeOffTypesByCountry)]);

  const renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  if (loadingTimeOffType)
    return (
      <div className={styles.TimeOffRequestsTable} style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );

  return (
    <div className={styles.TimeOffRequestsTable}>
      <Tabs
        tabPosition="left"
        // tabBarGutter={40}
        activeKey={currentLeaveTypeTab}
        tabBarExtraContent={renderTableTitle}
        onTabClick={(activeKey) => saveCurrentTypeTab(activeKey)}
        destroyInactiveTabPane
      >
        <>
          <TabPane tab="Leave Requests" key="1">
            <MineOrTeamTabs tab={1} tabName="Leave Requests" type={1} />
          </TabPane>
          <TabPane tab="Special Leave Requests" key="2">
            <MineOrTeamTabs tab={2} tabName="Special Leave Requests" type={1} />
          </TabPane>
          <TabPane tab="LWP Requests" key="3">
            <MineOrTeamTabs tab={3} tabName="LWP Requests" type={1} />
          </TabPane>
          <TabPane tab="WFH/CP Requests" key="4">
            <MineOrTeamTabs tab={4} tabName="WFH/CP Requests" type={1} />
          </TabPane>
          <TabPane tab="Compoff Requests" key="5">
            <MineOrTeamTabs tab={5} tabName="Compoff Requests" type={2} />
          </TabPane>
        </>
      </Tabs>
    </div>
  );
};

export default connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingTimeOffType: loading.effects['timeOff/fetchTimeOffTypesByCountry'],
}))(TimeOffRequestsTable);
