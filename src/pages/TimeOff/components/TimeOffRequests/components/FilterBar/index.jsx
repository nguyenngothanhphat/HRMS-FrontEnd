import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class FilterBar extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedFilterTab } = this.props;
    setSelectedFilterTab(activeKey);
  };

  addZeroToNumber = (number) => {
    return `0${number}`.slice(-2);
  };

  render() {
    // const { dataNumber } = this.props;
    return (
      <div className={styles.FilterBar}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          {/* <TabPane
            tab={`In-progress (${this.addZeroToNumber(dataNumber.inProgressNumber)})`}
            key="1"
          />
          <TabPane tab={`On-hold  (${this.addZeroToNumber(dataNumber.onHoldNumber)})`} key="2" />
          <TabPane tab={`Accepted  (${this.addZeroToNumber(dataNumber.acceptedNumber)})`} key="3" />
          <TabPane tab={`Rejected  (${this.addZeroToNumber(dataNumber.rejectedNumber)})`} key="4" /> */}
          <TabPane tab="In Progress" key="1" />
          <TabPane tab="Approved" key="2" />
          <TabPane tab="Rejected" key="3" />
          <TabPane tab="Drafts" key="4" />
        </Tabs>
      </div>
    );
  }
}
