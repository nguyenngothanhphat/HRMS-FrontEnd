import React from 'react';
import { Tabs } from 'antd';

import ActivityItem from '../ActivityItem';

import s from './index.less';

const { TabPane } = Tabs;

const ActivityLog = () => {
  return (
    <div className={s.container}>
      <h3>activity log</h3>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All (11)" key="1">
          <ActivityItem />
        </TabPane>
        <TabPane tab="Requires my approvals (02)" key="2">
          b
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ActivityLog;
