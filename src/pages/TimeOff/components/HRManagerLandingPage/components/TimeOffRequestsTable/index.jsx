import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import MineOrTeamTabs from './components/MineOrTeamTabs';

import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff, user }) => ({
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
  }
}

export default TimeOffRequestsTable;
