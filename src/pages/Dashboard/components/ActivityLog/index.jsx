import React from 'react';
import { Tabs } from 'antd';

import ActivityItem from '../ActivityItem';

import s from './index.less';

const { TabPane } = Tabs;

const activityList = [
  {
    id: 1,
    day: 23,
    month: 'May',
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[22nd August - 28th August, 2020]</strong>{' '}
        received.
      </p>
    ),
  },
  {
    id: 2,
    day: 23,
    month: 'May',
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[22nd August - 28th August, 2020]</strong>{' '}
        received.
      </p>
    ),
  },
  {
    id: 3,
    day: 23,
    month: 'May',
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[22nd August - 28th August, 2020]</strong>{' '}
        received.
      </p>
    ),
  },
];

const ActivityLog = () => {
  return (
    <div className={s.container}>
      <h3>activity log</h3>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All (11)" key="1">
          <div style={{ margin: '4px 0' }}>
            {/* <ActivityItem /> */}
            {activityList.map((item) => {
              const { day = '', month = '', info = '', id = '' } = item;
              return <ActivityItem key={id} day={day} month={month} info={info} />;
            })}
          </div>
        </TabPane>
        <TabPane tab="Requires my approvals (02)" key="2">
          b
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ActivityLog;
