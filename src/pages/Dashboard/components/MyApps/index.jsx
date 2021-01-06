/* eslint-disable array-callback-return */
import React, { useState } from 'react';
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
    name: 'Directory',
    icon: <DateIcon />,
    link: '/directory',
  },
  {
    id: 2,
    name: 'Onboarding',
    icon: <DateIcon />,
    link: '/employee-onboarding',
  },
  {
    id: 3,
    name: 'Timeoff',
    icon: <NewsIcon />,
    link: '/time-off',
  },
  {
    id: 4,
    name: 'Offboarding',
    icon: <DateIcon />,
    link: '/offboarding',
  },
  {
    id: 5,
    name: 'Payroll',
    icon: <DateIcon />,
  },
  {
    id: 6,
    name: 'Project management',
    icon: <TimeIcon />,
    link: '/project-management',
  },
  {
    id: 7,
    name: 'Timesheet',
    icon: <DateIcon />,
  },
  {
    id: 8,
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
  const [list, setList] = useState([...[...appList].splice(0, 4), appList[appList.length - 1]]);

  const showMore = () => {
    setList([...appList]);
    console.log('MORE');
  };

  return (
    <div className={s.container}>
      <h3>my apps</h3>
      {/* <Row>{renderAppRow(list)}</Row> */}
      <Row>
        {list.map((app) => {
          const { name = '', icon = '', add = false, link } = app;
          if (add) {
            return (
              <Col span={3}>
                <AppItem add showMore={showMore} />
              </Col>
            );
          }
          return (
            <Col span={3}>
              <AppItem Icon={icon} name={name} link={link} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default MyApps;
