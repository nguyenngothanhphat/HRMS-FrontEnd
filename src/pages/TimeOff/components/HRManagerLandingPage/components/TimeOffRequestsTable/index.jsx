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
          destroyInactiveTabPane
        >
          <>
            <TabPane tab="Leave Request" key="1">
              <MineOrTeamTabs tab={1} type={1} />
            </TabPane>
            <TabPane tab="Special Leave Request" key="2">
              <MineOrTeamTabs tab={2} type={1} />
            </TabPane>
            <TabPane tab="LWP Request" key="3">
              <MineOrTeamTabs tab={3} type={1} />
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              <MineOrTeamTabs tab={4} type={1} />
            </TabPane>
            <TabPane tab="Compoff Request" key="5">
              <MineOrTeamTabs tab={5} type={2} />
            </TabPane>
          </>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
