import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import InQueueTable from '../InQueueTable';
import ClosedTable from '../ClosedTable';
import TableSearch from '../TableSearch';

import styles from './index.less';

class RelievingTables extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      queuesList: '',
    };
  }

  onSearch = (value) => {
    this.setState({ queuesList: value });
  };

  render() {
    const { TabPane } = Tabs;
    const { queuesList } = this.state;
    const data = [
      {
        id: 1,
        name: 'In Queues',
        component: <InQueueTable dataSearch={queuesList} />,
      },
      {
        id: 2,
        name: 'Closed records',
        component: <ClosedTable dataSearch={queuesList} />,
      },
    ];
    return (
      <div className={styles.relievingTables}>
        <Tabs defaultActiveKey={1} tabBarExtraContent={<TableSearch onSearch={this.onSearch} />}>
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
