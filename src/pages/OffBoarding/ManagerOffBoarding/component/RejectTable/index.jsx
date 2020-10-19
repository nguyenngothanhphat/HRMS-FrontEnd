import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class RejectTable extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  render() {
    return (
      <div className={styles.tabTable}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab="In-progress (05)" key="1" />
          <TabPane tab="On-hold (00)" key="2" />
          <TabPane tab="Accepted (00)" key="3" />
          <TabPane tab="Rejected (00)" key="4" />
        </Tabs>
      </div>
    );
  }
}
