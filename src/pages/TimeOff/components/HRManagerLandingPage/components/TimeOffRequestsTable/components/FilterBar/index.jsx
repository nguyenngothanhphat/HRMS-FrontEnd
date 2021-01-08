import React, { PureComponent } from 'react';
import { Tabs, Badge } from 'antd';
import moment from 'moment';

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
        onHoldLength = '',
        deletedLength = '',
      } = {},
      category = '',
    } = this.props;

    const { selectedTab } = this.props;

    const withdrawExist = onHoldLength > 0;
    const inProgressExist = inProgressLength > 0;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane
            tab={
              inProgressExist ? (
                <Badge dot>
                  <span>In Progress ({this.addZeroToNumber(inProgressLength)}) </span>
                </Badge>
              ) : (
                <span>In Progress ({this.addZeroToNumber(inProgressLength)}) </span>
              )
            }
            key="1"
          />
          <TabPane tab={`Approved (${this.addZeroToNumber(approvedLength)})`} key="2" />
          <TabPane tab={`Rejected (${this.addZeroToNumber(rejectedLength)})`} key="3" />
          {category === 'MY' && (
            <TabPane tab={`Drafts (${this.addZeroToNumber(draftLength)})`} key="4" />
          )}
          {onHoldLength !== 0 && (
            <TabPane
              tab={
                withdrawExist ? (
                  <Badge dot>
                    <span>Withdraw ({this.addZeroToNumber(onHoldLength)}) </span>
                  </Badge>
                ) : (
                  <span>Withdraw ({this.addZeroToNumber(onHoldLength)}) </span>
                )
              }
              key="5"
            />
          )}
          {deletedLength !== 0 && (
            <TabPane tab={`Deleted (${this.addZeroToNumber(deletedLength)})`} key="6" />
          )}
        </Tabs>
      </div>
    );
  }
}
