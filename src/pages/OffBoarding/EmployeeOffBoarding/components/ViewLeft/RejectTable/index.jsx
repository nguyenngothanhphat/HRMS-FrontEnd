import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class RejectTable extends PureComponent {
  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  accepted = () => {
    const { lengthData } = this.props;

    return ` Accepted ${lengthData}`;
  };

  rejected = () => {
    const { lengthData } = this.props;

    return ` Rejected ${lengthData}`;
  };

  getCount = (value) => {
    const { totallist = [] } = this.props;
    const result = totallist.find(({ _id }) => _id === value) || {};
    return result.count || 0;
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  render() {
    // const inProjess = totallist.find(({ _id }) => _id === 'IN-PROGRESS');
    // const onHold = totallist.find(({ _id }) => _id === 'ON-HOLD');
    // const accepted = totallist.find(({ _id }) => _id === 'ACCEPTED');
    // const reject = totallist.find(({ _id }) => _id === 'REJECTED');
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
    ];

    return (
      <div className={styles.tabTable}>
        <Tabs
          tabBarGutter={35}
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
