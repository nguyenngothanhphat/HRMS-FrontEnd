import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi';
import BackgroundCheck from './components/BackgroundCheck';
import MotorVehicleReports from './components/MotorVehicleReports';
import Authorization from './components/Authorization';
import BillingInformation from './components/BillingInformation';

import styles from './index.less';

class BackgroundChecks extends PureComponent {
  render() {
    return (
      <div className={styles.BackgroundChecks}>
        <div className={styles.BackgroundChecks_title}>
          {formatMessage({ id: 'component.backgroundChecks.title' })}
        </div>
        <div className={styles.BackgroundChecks_subTitle}>
          {formatMessage({ id: 'component.backgroundChecks.subTitle' })}{' '}
          <a href="#"> {formatMessage({ id: 'component.backgroundChecks.learnMore' })}</a>
        </div>
        <div className={styles.BackgroundChecks_forms}>
          <p className={styles.subTitle}>
            {' '}
            {formatMessage({ id: 'component.backgroundChecks.generalSettings' })}
          </p>
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
