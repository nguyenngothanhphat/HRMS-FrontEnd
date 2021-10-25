// import React from 'react';
// import { Tabs } from 'antd';
// import styles from './index.less';

// const { TabPane } = Tabs;
// const Summary = (props) => {
//     const data = [
//         {
//             value: '1',
//             title: 'New',
//         },
//         {
//             value: '2',
//             title: 'Assigned',
//         },
//         {
//             value: '3',
//             title: 'In Progress',
//         },
//         {
//             value: '4',
//             title: 'Client Pending',
//         },
//         {
//             value: '5',
//             title: 'Resolved',
//         },
//         {
//             value: '6',
//             title: 'Closed',
//         },
//     ];
//     const handleChange = (activeKey) => {
//     };
//     const renderTab = (value) => {
//         return <div>{value}</div>;
//     };
//     return (
//         <div className={styles.tabTable}>
//             <Tabs
//                 defaultActiveKey="1"
//                 onChange={handleChange}
//             >
//                 {data.map((item) => (
//                     <TabPane tab={item.title} key={item.value} />
//                 ))}
//             </Tabs>
//         </div>
//     )
// }
// export default Summary

// Class Component
import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class Summary extends PureComponent {
  onChangeTab = (activeKey) => {
  };

  getCount = (value) => {
    const { countdata = [] } = this.props;
    const result = countdata.find(({ _id }) => _id === value) || {};
    return result.count || 0;
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  render() {

    const data = [
        {
            value: '1',
            title: 'New',
            count: this.getCount(),
            renderTab: this.renderTab('NEW'),
        },
        {
            value: '2',
            title: 'Assigned',
            count: this.getCount(),
            renderTab: this.renderTab('ASSIGNED'),
        },
        {
            value: '3',
            title: 'In Progress',
            count: this.getCount(),
            renderTab: this.renderTab('IN_PROGRESS'),
        },
        {
            value: '4',
            title: 'Client Pending',
            count: this.getCount(),
            renderTab: this.renderTab('CLIENT_PENDING'),
        },
        {
            value: '5',
            title: 'Resolved',
            count: this.getCount(),
            renderTab: this.renderTab('RESOLVED'),
        },
        {
            value: '6',
            title: 'Closed',
            count: this.getCount(),
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
