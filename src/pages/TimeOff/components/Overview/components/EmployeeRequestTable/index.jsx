import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { addZeroToNumber, splitArrayItem } from '@/utils/utils';
import TimeOffRequestTab from './components/TimeOffRequestTab';
import styles from './index.less';
import { getTypeListByTab } from '@/utils/timeOff';

const { TabPane } = Tabs;

const EmployeeRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
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
    typeList = [],
  } = props;

  const saveCurrentTypeTab = (type) => {
    const listType = getTypeListByTab(typeList, type);
    const listIdType = splitArrayItem(listType.map((item) => item.ids));
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentFilterTab: '1',
        currentPayloadTypes: listIdType,
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
            <TabPane tab={`LOP Requests (${addZeroToNumber(totalByType.B)})`} key="3">
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

export default connect(({ timeOff, user, loading, timeOffManagement: { typeList = [] } }) => ({
  timeOff,
  user,
  typeList,
  loadingTimeOffType: loading.effects['timeOff/fetchTimeOffTypeByEmployeeEffect'],
}))(EmployeeRequestTable);
