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
    const {
      dataNumber: {
        inProgressNumber = '',
        approvedNumber = '',
        rejectedNumber = '',
        draftNumber = '',
      } = {},
    } = this.props;

    return (
      <div className={styles.FilterBar}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane
            tab={`In Progress ${
              inProgressNumber !== 0 ? `(${this.addZeroToNumber(inProgressNumber)})` : ''
            } `}
            key="1"
          />
          <TabPane
            tab={`Approved ${
              approvedNumber !== 0 ? `(${this.addZeroToNumber(approvedNumber)})` : ''
            } `}
            key="2"
          />
          <TabPane
            tab={`Rejected ${
              rejectedNumber !== 0 ? `(${this.addZeroToNumber(rejectedNumber)})` : ''
            } `}
            key="3"
          />
          <TabPane
            tab={`Drafts ${draftNumber !== 0 ? `(${this.addZeroToNumber(draftNumber)})` : ''} `}
            key="4"
          />
        </Tabs>
      </div>
    );
  }
}
