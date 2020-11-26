import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import InQueueTable from '../InQueueTable';
import ClosedTable from '../ClosedTable';
import styles from './index.less';

class RelievingTables extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const data = [
      {
        id: 1,
        name: 'In Queues',
        component: <InQueueTable />,
      },
      {
        id: 2,
        name: 'Closed records',
        component: <ClosedTable />,
      },
    ];
    return (
      <div className={styles.relievingTables}>
        <Tabs defaultActiveKey={1}>
          {data.map((item) => {
            return (
              <TabPane tab={item.name} key={item.id}>
                {item.component}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default RelievingTables;
