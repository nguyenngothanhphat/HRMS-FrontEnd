import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class FilterBar extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedFilterTab } = this.props;
    setSelectedFilterTab(activeKey);
  };

  render() {
    const { dataNumber } = this.props;
    return (
      <div className={styles.FilterBar}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab={`In-progress (${`0${dataNumber.inProgressNumber}`.slice(-2)})`} key="1" />

          <TabPane tab={`On-hold (${`0${dataNumber.onHoldNumber}`.slice(-2)})`} key="2" />
          <TabPane tab={`Accepted (${`0${dataNumber.acceptedNumber}`.slice(-2)})`} key="3" />
          <TabPane tab={`Rejected (${`0${dataNumber.rejectedNumber}`.slice(-2)})`} key="4" />
        </Tabs>
      </div>
    );
  }
}
