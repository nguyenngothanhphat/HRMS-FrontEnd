import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class RejectTable extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  inprogress = () => {
    const { lengthData } = this.props;

    return `In-progress ${lengthData}`;
  };

  onhold = () => {
    const { lengthData } = this.props;

    return `On-hold  ${lengthData}`;
  };

  accepted = () => {
    const { lengthData } = this.props;

    return ` Accepted ${lengthData}`;
  };

  rejected = () => {
    const { lengthData } = this.props;

    return ` Rejected ${lengthData}`;
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
          <TabPane tab={this.inprogress()} key="1" />
          <TabPane tab={this.onhold()} key="2" />
          <TabPane tab={this.accepted()} key="3" />
          <TabPane tab={this.rejected()} key="4" />
        </Tabs>
      </div>
    );
  }
}
