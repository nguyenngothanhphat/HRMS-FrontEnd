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
    const { countData: { totalStatus = [] } = {} } = this.props;
    const find = totalStatus.find((val) => val.status === value);
    return find?.total || 0;
  };

  render() {
    const data = [
      {
        value: '1',
        title: 'Assigned',
        count: this.getCount('Assigned'),
        renderTab: this.renderTab('Assigned'),
      },
      {
        value: '2',
        title: 'In Progress',
        count: this.getCount('In Progress'),
        renderTab: this.renderTab('In Progress'),
      },
      {
        value: '3',
        title: 'Client Pending',
        count: this.getCount('Client Pending'),
        renderTab: this.renderTab('Client Pending'),
      },
      {
        value: '4',
        title: 'Resolved',
        count: this.getCount('Resolved'),
        renderTab: this.renderTab('Resolved'),
      },
      {
        value: '5',
        title: 'Closed',
        count: this.getCount('Closed'),
        renderTab: this.renderTab('Closed'),
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
