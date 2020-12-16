import React from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as MyIcon } from '@/assets/dashboard_date.svg';
import AppItem from '../AppItem';

import s from './index.less';

const appList = [
  {
    id: 1,
    name: 'Timesheets',
    icon: <MyIcon />,
  },
  {
    id: 2,
    name: 'Timeoff',
    icon: <MyIcon />,
  },
  {
    id: 3,
    name: 'Directory',
    icon: <MyIcon />,
  },
  {
    id: 4,
    name: 'Expenso',
    icon: <MyIcon />,
  },
  {
    id: 4,
    name: 'Expenso',
    icon: <MyIcon />,
  },
  {
    id: 5,
    name: 'Report',
    icon: <MyIcon />,
  },
  {
    id: 6,
    add: true,
  },
];

const renderAppRow = (list) => {
  return (
    <Row style={{ marginBottom: '24px' }}>
      {list.map((app) => {
        const { name = '', icon = '', add = false } = app;
        if (add) {
          return (
            <Col span={6}>
              <AppItem add />
            </Col>
          );
        }
        return (
          <Col span={6}>
            <AppItem Icon={icon} name={name} />
          </Col>
        );
      })}
    </Row>
  );
};

const renderApps = (list, amount) => {
  const arr = [];
  let subArr = [];
  console.log(list);

  // Split array into smaller array
  list.map((app, index) => {
    subArr.push(app);
    if (((index + 1) % amount === 0 && index !== 0) || index === list.length - 1) {
      arr.push(subArr);
      subArr = [];
    }
  });

  return arr.map((arrItem) => renderAppRow(arrItem));
  //   return arr;
};

const MyApps = () => {
  return (
    <div className={s.container}>
      <h3>my apps</h3>

      {renderApps(appList, 4)}

      {/* <Row style={{ marginBottom: '24px' }}>
        {appList.map((app) => {
          const { name = '', icon = '', add = false } = app;
          return (
            <Col span={8}>
              <AppItem Icon={icon} name={name} />
            </Col>
          );
        })}
      </Row> */}
      {/* <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Timesheets" />
        </Col>
      </Row> */}

      {/* <Row style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Timesheets" />
        </Col>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Timeoff" />
        </Col>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Directory" />
        </Col>
      </Row>

      <Row style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Expenso" />
        </Col>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Report" />
        </Col>
        <Col span={8}>
          <AppItem Icon={<MyIcon />} name="Add an app" add />
        </Col>
      </Row> */}
    </div>
  );
};

export default MyApps;
