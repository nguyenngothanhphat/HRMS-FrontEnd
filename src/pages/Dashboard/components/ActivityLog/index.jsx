import React, { useState, useEffect } from 'react';
import { ReactComponent as SortIcon } from '@/assets/dashboard_sort.svg';
import { ReactComponent as FilterIcon } from '@/assets/dashboard_filter.svg';
import { formatMessage } from 'umi';
import { Tabs } from 'antd';

import ActivityItem from '../ActivityItem';

import s from './index.less';

const { TabPane } = Tabs;

const activityList = [
  {
    id: 1,
    day: 22,
    month: 'May',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 2,
    day: 15,
    month: 'June',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 3,
    day: 4,
    month: 'May',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 4,
    day: 8,
    month: 'July',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 5,
    day: 13,
    month: 'Feb',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 6,
    day: 17,
    month: 'Oct',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
  {
    id: 7,
    day: 23,
    month: 'Aug',
    year: 2020,
    info: (
      <p>
        Resource allocation sheet for Week 17 <strong>[08.22.20 - 08.28.20]</strong> received.
      </p>
    ),
  },
];

const allListData = activityList;
const requireListData = activityList.splice(0, 5);

const ActivityLog = () => {
  const [ascending, setAscending] = useState(false);
  const [allList, setAllList] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [requireList, setRequireList] = useState([]);

  const allCount = allList.length < 10 ? `0${allList.length}` : allList.length;
  const requireCount = requireList.length < 10 ? `0${requireList.length}` : requireList.length;

  useEffect(() => {
    setAllList(allListData);
    setRequireList(requireListData);
  }, []);

  const sort = () => {
    let currentList;
    if (activeTab === '1') {
      currentList = [...allList];
    } else {
      currentList = [...requireList];
    }

    if (currentList.length === 0) {
      return;
    }

    // sort
    const newList = currentList.sort((item1, item2) => {
      const date1 = new Date(`${item1.month} ${item1.day},${item1.year}`);
      const date2 = new Date(`${item2.month} ${item2.day},${item2.year}`);
      if (ascending) {
        return date2.getTime() - date1.getTime();
      }
      return date1.getTime() - date2.getTime();
    });

    // Update correspond list
    if (activeTab === '1') {
      setAllList(newList);
    } else {
      setRequireList(newList);
    }

    setAscending((prevState) => !prevState);
  };

  const filter = () => {
    console.log('FILTER');
  };

  return (
    <div className={s.container}>
      <h3>{formatMessage({ id: 'pages.dashboard.activityLog.title' })}</h3>

      <div className={s.actionContainer}>
        <div className={s.action} onClick={() => sort()}>
          <SortIcon />
          <span>{formatMessage({ id: 'pages.dashboard.activityLog.sort' })}</span>
        </div>

        <div className={s.action} onClick={() => filter()}>
          <FilterIcon />
          <span>{formatMessage({ id: 'pages.dashboard.activityLog.filter' })}</span>
        </div>
      </div>

      <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
        <TabPane
          tab={`${formatMessage({ id: 'pages.dashboard.activityLog.all' })} (${allCount})`}
          key="1"
        >
          <div className={s.main}>
            {allList.map((item) => {
              const { day = '', month = '', info = '', id = '' } = item;
              return <ActivityItem key={id} day={day} month={month} info={info} />;
            })}
          </div>
        </TabPane>

        <TabPane
          tab={`${formatMessage({ id: 'pages.dashboard.activityLog.require' })} (${requireCount})`}
          key="2"
        >
          <div className={s.main}>
            {requireList.map((item) => {
              const { day = '', month = '', info = '', id = '' } = item;
              return <ActivityItem key={id} day={day} month={month} info={info} />;
            })}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ActivityLog;
