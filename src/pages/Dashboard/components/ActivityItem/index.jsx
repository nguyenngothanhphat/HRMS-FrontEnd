import React from 'react';
import { ReactComponent as MyIcon } from '@/assets/dashboard_launch.svg';
import { Row, Col } from 'antd';

import s from './index.less';

const Date = () => {
  return (
    <div className={s.date}>
      <span>23</span>
      <span>May</span>
    </div>
  );
};

const ActivityItem = () => {
  return (
    <div className={s.container}>
      <Row gutter={10}>
        <Col span={5}>
          <Date />
        </Col>
        <Col span={15}>
          <div className={s.description}>
            <p>
              Resource allocation sheet for Week 17{' '}
              <strong>[22nd August - 28th August, 2020]</strong> received.{' '}
            </p>
          </div>
        </Col>
        <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MyIcon />
        </Col>
      </Row>
      {/* <div /> */}
    </div>
  );
};

export default ActivityItem;
