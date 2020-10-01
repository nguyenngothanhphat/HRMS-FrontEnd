/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BackgroundCheck from './components/BackgroundCheck';
import MotorVehicleReports from './components/MotorVehicleReports';
import Authorization from './components/Authorization';
import BillingInformation from './components/BillingInformation';

import styles from './index.less';

class BackgroundChecks extends Component {
  render() {
    return (
      <div className={styles.BackgroundChecks}>
        <div className={styles.BackgroundChecks_title}>Background checks</div>
        <div className={styles.BackgroundChecks_subTitle}>
          Run background checks on new and existing workers. <a href="#">Learn More</a>
        </div>
        <div className={styles.BackgroundChecks_forms}>
          <p className={styles.subTitle}>General Settings</p>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              {' '}
              <BackgroundCheck />
            </Col>
            <Col span={24}>
              <MotorVehicleReports />
            </Col>
            <Col span={24}>
              <Authorization />
            </Col>
            <Col span={24}>
              {' '}
              <BillingInformation />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default BackgroundChecks;
