import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import TimeOffRequestTab from './components/TimeOffRequestTab';

import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff, loading, user }) => ({
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  timeOff,
  user,
}))
class TimeOffRequestsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveCurrentTypeTab = (type) => {
    const {
      dispatch,
      timeOff: { timeOffTypesByCountry = [] },
    } = this.props;
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

  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  render() {
    const { timeOff: { currentLeaveTypeTab = '' } = {} } = this.props;
    return (
      <div className={styles.TimeOffRequestsTable}>
        <Tabs
          tabPosition="left"
          // tabBarGutter={40}
          activeKey={currentLeaveTypeTab}
          tabBarExtraContent={this.renderTableTitle}
          onTabClick={(activeKey) => this.saveCurrentTypeTab(activeKey)}
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
            <TabPane tab="Compoff Requests" key="5">
              <TimeOffRequestTab tab={5} type={2} />
            </TabPane>
          </>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
