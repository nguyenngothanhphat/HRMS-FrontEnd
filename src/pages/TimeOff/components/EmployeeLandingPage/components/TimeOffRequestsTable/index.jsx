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

  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  render() {
    return (
      <div className={styles.TimeOffRequestsTable}>
        <Tabs
          tabPosition="left"
          tabBarGutter={40}
          defaultActiveKey="1"
          tabBarExtraContent={this.renderTableTitle}
          onTabClick={this.onTabClick}
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
