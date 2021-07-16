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

  getTotalCount = () => {
    const { countdata = [] } = this.props;
    let total = 0;
    if (countdata.length > 0) total = countdata.reduce((a, b) => a.count + b.count);

    return total;
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  render() {
    const data = [
      {
        value: '1',
        title: 'All',
        count: this.getTotalCount(),
        renderTab: this.renderTab('ALL'),
      },
      {
        value: '2',
        title: 'In Progress',
        count: this.getCount('IN-PROGRESS'),
        renderTab: this.renderTab('DRAFT'),
      },
      {
        value: '3',
        title: 'On-hold',
        count: this.getCount('ON-HOLD'),
        renderTab: this.renderTab('ON-HOLD'),
      },
      {
        value: '4',
        title: 'Accepted',
        count: this.getCount('ACCEPTED'),
        renderTab: this.renderTab('ACCEPTED'),
      },
      {
        value: '5',
        title: 'Rejected',
        count: this.getCount('REJECTED'),
        renderTab: this.renderTab('REJECTED'),
      },
      {
        value: '6',
        title: 'Draft',
        count: this.getCount('DRAFT'),
        renderTab: this.renderTab('DRAFT'),
      },
      {
        value: '7',
        title: 'Withdraw',
        count: this.getCount('WITHDRAW'),
        renderTab: this.renderTab('WITHDRAW'),
      },
    ];

    return (
      <div className={styles.tabTable}>
        <Tabs
          // tabBarGutter={35}
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
