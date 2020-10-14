import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './index.less';

const { TabPane } = Tabs;

export default class FilterBar extends PureComponent {
  render() {
    return (
      <div className={styles.FilterBar}>
        <Tabs
          type="line"
          tabBarGutter={35}
          defaultActiveKey="1"
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab="In-progress (05)" key="1">
            In-progress (05)
          </TabPane>{' '}
          <TabPane tab="On-hold (00)" key="2">
            On-hold (00)
          </TabPane>{' '}
          <TabPane tab="Accepted (00)" key="3">
            Accepted (00)
          </TabPane>{' '}
          <TabPane tab="Rejected (00)" key="4">
            Rejected (00)
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
