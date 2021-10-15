/* eslint-disable array-callback-return */
import React from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as Onboarding } from './icons/icon_Onboarding.svg';
import { ReactComponent as Timeoff } from './icons/icon_Timeoff.svg';
import { ReactComponent as Directory } from './icons/icon_Directory.svg';
// import { ReactComponent as Offboarding } from './icons/icon_Offboarding.svg';
import AppItem from '../AppItem';

import s from './index.less';

const appList = [
  {
    id: 1,
    name: 'Directory',
    icon: <Directory />,
    link: '/directory',
  },
  {
    id: 2,
    name: 'Onboarding',
    icon: <Onboarding />,
    link: '/onboarding',
  },
  {
    id: 3,
    name: 'Timeoff',
    icon: <Timeoff />,
    link: '/time-off',
  },
  // {
  //   id: 4,
  //   name: 'Offboarding',
  //   icon: <Offboarding />,
  //   link: '/offboarding',
  // },
];

const MyApps = () => {
  return (
    <div className={s.container}>
      <h3>my apps</h3>

      <Row justify="flex-start">
        {appList.map((app) => {
          const { name = '', icon = '', link = '' } = app;
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
