import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

export default class Summary extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  getCount = (value) => {
    const { countdata = [] } = this.props;

    console.log(value);
  };

  render() {
    const data = [
      {
        value: '1',
        title: 'New',
        count: this.getCount('New'),
        renderTab: this.renderTab('NeW'),
      },
      {
        value: '2',
        title: 'Assigned',
        count: 6,
        renderTab: this.renderTab('ASSIGNED'),
      },
      {
        value: '3',
        title: 'In Progress',
        count: 6,
        renderTab: this.renderTab('IN_PROGRESS'),
      },
      {
        value: '4',
        title: 'Client Pending',
        count: 6,
        renderTab: this.renderTab('CLIENT_PENDING'),
      },
      {
        value: '5',
        title: 'Resolved',
        count: 6,
        renderTab: this.renderTab('RESOLVED'),
      },
      {
        value: '6',
        title: 'Closed',
        count: 6,
        renderTab: this.renderTab('CLOSED'),
      },
    ];

    return (
      <div className={styles.tabTable}>
        <Tabs
          defaultActiveKey="1"
          onChange={(activeKey) => this.onChangeTab(activeKey)}
          tabBarExtraContent={this.renderTableTitle}
        >
          {data.map((item) => (
            <TabPane tab={`${item.title} (${item.count})`} key={item.value} />
          ))}
        </Tabs>
      </div>
    );
  }
}
