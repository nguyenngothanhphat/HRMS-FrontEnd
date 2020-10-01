/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import BackgroundCheck from './components/BackgroundCheck';
import MotorVehicleReports from './components/MotorVehicleReports';
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
          <BackgroundCheck />
          <MotorVehicleReports />
        </div>
      </div>
    );
  }
}

export default BackgroundChecks;
