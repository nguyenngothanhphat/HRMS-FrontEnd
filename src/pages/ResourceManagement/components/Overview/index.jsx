import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import NewJoinees from './components/NewJoinees';
import People from './components/People';
import Utilization from './components/Utilization';
import styles from './index.less';

const Overview = () => {
  return (
    <div className={styles.Overview}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Utilization />
        </Col>
        <Col xs={24} lg={12}>
          <People />
        </Col>
        <Col xs={24} lg={12}>
          <NewJoinees />
        </Col>
      </Row>
    </div>
  );
};

export default connect(() => ({}))(Overview);
