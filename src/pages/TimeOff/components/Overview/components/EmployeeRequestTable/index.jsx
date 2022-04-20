import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import TimeOffRequestTab from './components/TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

const EmployeeRequestTable = (props) => {
  const {
    dispatch,
    timeOff: { currentLeaveTypeTab = '', timeOffTypesByCountry = [] } = {},
    loadingTimeOffType = false,
    eligibleForCompOff = false,
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
            <TabPane tab="Leave Requests" key="1">
              <TimeOffRequestTab tab={1} type={1} />
            </TabPane>
            <TabPane tab="Special Leave Requests" key="2">
              <TimeOffRequestTab tab={2} type={1} />
            </TabPane>
            <TabPane tab="LWP Requests" key="3">
              <TimeOffRequestTab tab={3} type={1} />
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
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
  loadingTimeOffType: loading.effects['timeOff/fetchTimeOffTypesByCountry'],
}))(EmployeeRequestTable);
