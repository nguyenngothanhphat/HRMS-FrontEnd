import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import RequestScopeTabs from './components/RequestScopeTabs';
import styles from './index.less';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { TabPane } = Tabs;
const { IN_PROGRESS, ON_HOLD } = TIMEOFF_STATUS;

const ManagerRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
      countTotal = [],
      currentScopeTab = '1',
      currentFilterTab = '',
      typeLeaveCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
      },
    } = {},
    loadingTimeOffType = false,
    eligibleForCompOff = false,
  } = props;

  const fetchCountTotal = () => {
    // Get all type ID
    const leavesTemp = [...commonLeaves, ...specialLeaves];

    const typeId = leavesTemp.map((item) => {
      return item._id;
    });
    //

    // Fetch all countTotal
    let typeAPI = '';
    switch (currentScopeTab) {
      case '1':
        typeAPI = 'timeOff/fetchAllLeaveRequests';
        break;
      case '2':
        typeAPI = 'timeOff/fetchTeamLeaveRequests';
        break;
      case '3':
        typeAPI = 'timeOff/fetchLeaveRequestOfEmployee';
        break;
      default:
        break;
    }

    dispatch({
      type: typeAPI,
      payload: {
        type: typeId,
        isCountTotal: true,
      },
    });
  };

  const countByStatus = (status) => {
    const typeTotalCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    // get data of count follow status
    countTotal.forEach((item) => {
      if (status.includes(item._id)) {
        item.types.forEach((ele) => {
          typeTotalCount[`${ele.type}`] += ele.count;
        });
      }
    });

    dispatch({
      type: 'timeOff/save',
      payload: {
        typeLeaveCount: typeTotalCount,
      },
    });
  };

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
    fetchCountTotal();
  }, [JSON.stringify(yourTimeOffTypes)]);

  useEffect(() => {
    fetchCountTotal();
  }, [currentLeaveTypeTab, currentScopeTab, currentFilterTab]);

  useEffect(() => {
    countByStatus([IN_PROGRESS, ON_HOLD]);
  }, [countTotal]);

  const renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  const addZeroToNumber = (number) => {
    if (number === 0) return 0;
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
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
            <TabPane tab={`Leave Requests (${addZeroToNumber(typeLeaveCount.A)})`} key="1">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={1}
                tabName="Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`Special Leave Requests (${addZeroToNumber(typeLeaveCount.C)})`} key="2">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={2}
                tabName="Special Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`LWP Requests (${addZeroToNumber(typeLeaveCount.B)})`} key="3">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={3}
                tabName="LWP Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`WFH/CP Requests (${addZeroToNumber(typeLeaveCount.D)})`} key="4">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                tab={4}
                tabName="WFH/CP Requests"
                type={1}
              />
            </TabPane>
            {eligibleForCompOff && (
              <TabPane tab="Compoff Requests" key="5">
                <RequestScopeTabs
                  saveCurrentTypeTab={saveCurrentTypeTab}
                  tab={5}
                  tabName="Compoff Requests"
                  type={2}
                />
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
}))(ManagerRequestTable);
