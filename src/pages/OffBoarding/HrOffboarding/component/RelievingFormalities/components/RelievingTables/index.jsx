import React, { PureComponent } from 'react';
import { Tabs, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import filterIcon from '@/assets/filterIcon.svg';
import InQueueTable from '../InQueueTable';
import ClosedTable from '../ClosedTable';

import styles from './index.less';

class RelievingTables extends PureComponent {
  renderSearchFilter = () => (
    <div className={styles.searchFilter}>
      <Button
        type="link"
        shape="round"
        icon={<img src={filterIcon} alt="" className={styles.searchFilter__icon} />}
        size="small"
      />

      <Input
        size="large"
        placeholder="Search for Ticket numer, resignee, request ..."
        onChange={this.onChangeInput}
        prefix={<SearchOutlined />}
        onPressEnter={this.onPressEnter}
        className={styles.searchFilter__input}
      />
    </div>
  );

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
        <Tabs defaultActiveKey={1} tabBarExtraContent={this.renderSearchFilter()}>
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
