/* eslint-disable prefer-destructuring */
import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class RenderTable extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  getCount = (value) => {
    const { countdata = [] } = this.props;
    const result = countdata.find(({ _id }) => _id === value) || {};
    let count = 0;
    if (result.count > 0) {
      count = result.count;
    }
    return count;
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  render() {
    const data = [
      {
        value: '1',
        title: 'In-progress',
        count: this.getCount('IN-PROGRESS'),
        renderTab: this.renderTab('DRAFT'),
      },
      {
        value: '2',
        title: 'On-hold',
        count: this.getCount('ON-HOLD'),
        renderTab: this.renderTab('ON-HOLD'),
      },
      {
        value: '3',
        title: 'Accepted',
        count: this.getCount('ACCEPTED'),
        renderTab: this.renderTab('ACCEPTED'),
      },
      {
        value: '4',
        title: 'Rejected',
        count: this.getCount('REJECTED'),
        renderTab: this.renderTab('REJECTED'),
      },
      {
        value: '5',
        title: 'Draft',
        count: this.getCount('DRAFT'),
        renderTab: this.renderTab('DRAFT'),
      },
      {
        value: '6',
        title: 'Withdraw',
        count: this.getCount('WITHDRAW'),
        renderTab: this.renderTab('WITHDRAW'),
      },
    ];

    return (
      <div className={styles.tabTable}>
        <Tabs
          tabBarGutter={35}
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
        >
          {data.map((item) => (
            <TabPane tab={`${item.title} (${item.count})`} key={item.value} />
          ))}
        </Tabs>
      </div>
    );
  }
}
