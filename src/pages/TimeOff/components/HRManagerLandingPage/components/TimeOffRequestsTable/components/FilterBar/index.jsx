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
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  render() {
    const {
      dataNumber: {
        inProgressLength = '',
        approvedLength = '',
        rejectedLength = '',
        draftLength = '',
      } = {},
      category = '',
    } = this.props;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab={`In Progress (${this.addZeroToNumber(inProgressLength)})`} key="1" />
          <TabPane tab={`Approved (${this.addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${this.addZeroToNumber(rejectedLength)})`} key="3" />
          {category === 'MY' && (
            <TabPane tab={`Drafts (${this.addZeroToNumber(draftLength)})`} key="4" />
          )}
        </Tabs>
      </div>
    );
  }
}
