import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;
const Summary = (props) => {
    const data = [
        {
            value: '1',
            title: 'Assigned',
        },
        {
            value: '2',
            title: 'In Progress',
        },
        {
            value: '3',
            title: 'Client Pending',
        },
        {
            value: '4',
            title: 'Resolved',
        },
        {
            value: '5',
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
