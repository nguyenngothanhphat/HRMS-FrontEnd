import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;
const Summary = (props) => {
    const data = [
        {
            value: '1',
            title: 'New',
        },
        {
            value: '2',
            title: 'Assigned',
        },
        {
            value: '3',
            title: 'In Progress',
        },
        {
            value: '4',
            title: 'Client Pending',
        },
        {
            value: '5',
            title: 'Resolved',
        },
        {
            value: '6',
            title: 'Closed',
        },
    ];
    const handleChange = (activeKey) => {
    };
    const renderTab = (value) => {
        return <div>{value}</div>;
    };
    return (
      <div className={styles.tabTable}>
        <Tabs
          defaultActiveKey="1"
          onChange={handleChange}
        >
          {data.map((item) => (
            <TabPane tab={item.title} key={item.value} />
                ))}
        </Tabs>
      </div>
    )
}

export default Summary
