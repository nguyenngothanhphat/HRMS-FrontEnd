import { Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import RequestScopeTabs from './components/RequestScopeTabs';
import styles from './index.less';

const { TabPane } = Tabs;

const ManagerRequestTable = (props) => {
  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    } = {},
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
  }, [JSON.stringify(yourTimeOffTypes)]);

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
            <TabPane tab="Leave Requests" key="1">
              <RequestScopeTabs tab={1} tabName="Leave Requests" type={1} />
            </TabPane>
            <TabPane tab="Special Leave Requests" key="2">
              <RequestScopeTabs tab={2} tabName="Special Leave Requests" type={1} />
            </TabPane>
            <TabPane tab="LWP Requests" key="3">
              <RequestScopeTabs tab={3} tabName="LWP Requests" type={1} />
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              <RequestScopeTabs tab={4} tabName="WFH/CP Requests" type={1} />
            </TabPane>
            {eligibleForCompOff && (
              <TabPane tab="Compoff Requests" key="5">
                <RequestScopeTabs tab={5} tabName="Compoff Requests" type={2} />
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
