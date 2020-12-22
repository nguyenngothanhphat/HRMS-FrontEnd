import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
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

  renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '160px 0',
          // height: '310px',
        }}
      >
        <Spin size="medium" />
      </div>
    );
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
            <TabPane tab="Leave Request" key="1">
              <TimeOffRequestTab tab={1} type={1} />
            </TabPane>
            <TabPane tab="Special Leave Request" key="2">
              <TimeOffRequestTab tab={2} type={1} />
            </TabPane>
            <TabPane tab="LWP Request" key="3">
              <TimeOffRequestTab tab={3} type={1} />
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              <TimeOffRequestTab tab={4} type={1} />
            </TabPane>
            <TabPane tab="Compoff Request" key="5">
              <TimeOffRequestTab tab={5} type={2} />
            </TabPane>
          </>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
