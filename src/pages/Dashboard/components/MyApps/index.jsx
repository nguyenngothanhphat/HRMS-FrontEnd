/* eslint-disable array-callback-return */
import React from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as DateIcon } from '@/assets/dashboard_date.svg';
import { ReactComponent as NewsIcon } from '@/assets/newspaper.svg';
import { ReactComponent as TimeIcon } from '@/assets/time.svg';
import { ReactComponent as ReportIcon } from '@/assets/report.svg';
import AppItem from '../AppItem';

import s from './index.less';

const appList = [
  {
    id: 1,
    name: 'Timesheets',
    icon: <DateIcon />,
  },
  {
    id: 2,
    name: 'Timeoff',
    icon: <NewsIcon />,
    link: '/time-off',
  },
  {
    id: 3,
    name: 'Directory',
    icon: <DateIcon />,
    link: '/directory',
  },
  {
    id: 4,
    name: 'Expenso',
    icon: <TimeIcon />,
  },
  {
    id: 5,
    name: 'Report',
    icon: <ReportIcon />,
  },
  {
    id: 6,
    add: true,
  },
];

const renderAppRow = (list) => {
  return (
    <>
      {list.map((app) => {
        const { name = '', icon = '', add = false, link } = app;
        if (add) {
          return (
            <Col span={3}>
              <AppItem add />
            </Col>
          );
        }
        return (
          <Col span={3}>
            <AppItem Icon={icon} name={name} link={link} />
          </Col>
        );
      })}
    </>
  );
};

// const renderApps = (list, amount) => {
//   const arr = [];
//   let subArr = [];

//   // Split array into smaller array
//   list.map((app, index) => {
//     subArr.push(app);
//     if (((index + 1) % amount === 0 && index !== 0) || index === list.length - 1) {
//       arr.push(subArr);
//       subArr = [];
//     }
//   });
//   return arr.map((arrItem) => renderAppRow(arrItem));
// };

const MyApps = () => {
  return (
    <div className={s.container}>
      <h3>my apps</h3>
      <Row>{renderAppRow(appList)}</Row>
    </div>
  );
};

export default MyApps;
