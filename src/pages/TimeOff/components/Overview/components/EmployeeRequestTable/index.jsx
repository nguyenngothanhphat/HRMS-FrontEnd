import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { addZeroToNumber } from '@/utils/utils';
import TimeOffRequestTab from './components/TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

const EmployeeRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
      totalByType = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
      },
    } = {},
    loadingTimeOffType = false,
    eligibleForCompOff = false,
    currentScopeTab = '',
  } = props;

  const saveCurrentTypeTab = (type) => {
    let arr = [];
    switch (type) {
      case '1':
        arr = commonLeaves.filter((x) => x.type === 'A');
        break;
      case '2':
        arr = specialLeaves.filter((x) => x.type === 'C');
        break;
      case '3':
        arr = commonLeaves.filter((x) => x.type === 'B');
        break;
      case '4':
        arr = specialLeaves.filter((x) => x.type === 'D');
        break;
      default:
        arr = [];
        break;
    }
    arr = arr.map((item) => item._id);
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentFilterTab: '1',
        currentPayloadTypes: arr,
      },
    });

    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: 1,
      },
    });
    dispatch({
      type: 'timeOff/saveFilter',
      payload: {},
    });
  };

  useEffect(() => {
    saveCurrentTypeTab('1');
  }, [JSON.stringify(yourTimeOffTypes), currentScopeTab]);

  const renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  return (
    <div className={styles.EmployeeRequestTable}>
      <Spin spinning={loadingTimeOffType}>
        <Tabs
          tabPosition="left"
          // tabBarGutter={40}
          activeKey={currentLeaveTypeTab}
          tabBarExtraContent={renderTableTitle}
          onTabClick={(activeKey) => saveCurrentTypeTab(activeKey)}
          destroyInactiveTabPane
        >
          <>
            <TabPane tab={`Leave Requests (${addZeroToNumber(totalByType.A)})`} key="1">
              <TimeOffRequestTab tab={1} type={1} />
            </TabPane>
            <TabPane tab={`Special Leave Requests (${addZeroToNumber(totalByType.C)})`} key="2">
              <TimeOffRequestTab tab={2} type={1} />
            </TabPane>
            <TabPane tab={`LWP Requests (${addZeroToNumber(totalByType.B)})`} key="3">
              <TimeOffRequestTab tab={3} type={1} />
            </TabPane>
            <TabPane tab={`WFH/CP Requests (${addZeroToNumber(totalByType.D)})`} key="4">
              <TimeOffRequestTab tab={4} type={1} />
            </TabPane>
            {eligibleForCompOff && (
              <TabPane tab="Compoff Requests" key="5">
                <TimeOffRequestTab tab={5} type={2} />
              </TabPane>
            )}
          </>
        </Tabs>
      </Spin>
    </div>
  );
};

export default connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingTimeOffType: loading.effects['timeOff/fetchTimeOffTypeByEmployeeEffect'],
}))(EmployeeRequestTable);
