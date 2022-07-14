import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { addZeroToNumber } from '@/utils/utils';
import { TIMEOFF_TYPE } from '@/utils/timeOff';
import RequestScopeTabs from './components/RequestScopeTabs';
import styles from './index.less';

const { TabPane } = Tabs;

const ManagerRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      currentScopeTab = '',
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
    // eligibleForCompOff = false,
  } = props;

  const saveCurrentTypeTab = (type = '') => {
    let arr = [];

    switch (type) {
      case '1':
        arr = commonLeaves.filter((x) => x.type === TIMEOFF_TYPE.A);
        break;
      case '2':
        arr = specialLeaves.filter((x) => x.type === TIMEOFF_TYPE.C);
        break;
      case '3':
        arr = commonLeaves.filter((x) => x.type === TIMEOFF_TYPE.B);
        break;
      case '4':
        arr = specialLeaves.filter((x) => x.type === TIMEOFF_TYPE.D);
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
    <div className={styles.ManagerRequestTable}>
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
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={1}
                tabName="Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`Special Leave Requests (${addZeroToNumber(totalByType.C)})`} key="2">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={2}
                tabName="Special Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`LOP Requests (${addZeroToNumber(totalByType.B)})`} key="3">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={3}
                tabName="LOP Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`WFH/CP Requests (${addZeroToNumber(totalByType.D)})`} key="4">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={4}
                tabName="WFH/CP Requests"
                type={1}
              />
            </TabPane>
            {/* {eligibleForCompOff && (
              <TabPane tab="Compoff Requests" key="5">
                <RequestScopeTabs
                  saveCurrentTypeTab={saveCurrentTypeTab}
                  tab={5}
                  tabName="Compoff Requests"
                  type={2}
                />
              </TabPane>
            )} */}
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
}))(ManagerRequestTable);
