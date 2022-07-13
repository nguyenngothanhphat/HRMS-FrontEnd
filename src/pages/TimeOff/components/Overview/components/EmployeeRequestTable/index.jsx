import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import TimeOffRequestTab from './components/TimeOffRequestTab';
import styles from './index.less';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { TabPane } = Tabs;
const { IN_PROGRESS, ON_HOLD } = TIMEOFF_STATUS;

const EmployeeRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
      countTotal = [],
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

  const countInProgress = () => {
    // Get all type ID

    const leavesTemp = [...commonLeaves, ...specialLeaves];

    const typeId = leavesTemp.map((item) => {
      return item._id;
    });

    //
    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
      payload: {
        status: [IN_PROGRESS, ON_HOLD],
        type: typeId,
        isCountTotal: true,
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

  const countByStatus = (status) => {
    const typeTotalCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
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

  useEffect(() => {
    saveCurrentTypeTab('1');
  }, [JSON.stringify(yourTimeOffTypes)]);

  useEffect(() => {
    countInProgress();
  }, []);

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
            <TabPane tab={`Leave Requests (${addZeroToNumber(typeLeaveCount.A)})`} key="1">
              <TimeOffRequestTab tab={1} type={1} />
            </TabPane>
            <TabPane tab={`Special Leave Requests (${addZeroToNumber(typeLeaveCount.C)})`} key="2">
              <TimeOffRequestTab tab={2} type={1} />
            </TabPane>
            <TabPane tab={`LOP Requests (${addZeroToNumber(typeLeaveCount.B)})`} key="3">
              <TimeOffRequestTab tab={3} type={1} />
            </TabPane>
            <TabPane tab={`WFH/CP Requests (${addZeroToNumber(typeLeaveCount.D)})`} key="4">
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
