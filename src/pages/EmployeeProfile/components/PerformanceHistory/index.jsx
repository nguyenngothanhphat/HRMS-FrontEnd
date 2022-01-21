/* eslint-disable react/jsx-no-target-blank */
import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
import PerformanceReview from './components/PerformanceReview';
import CareerGraph from './components/CareerGraph';
import PRReports from './components/PRReports';
import ProjectHistory from './components/ProjectHistory';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <div
          style={{
            marginBottom: '24px',
          }}
        >
          <WorkInProgress />
        </div>
        <div className={styles.performanceHistory_syncEPASS}>
          <a href="http://epas.terralogic.com/E-PAS/#/login" target="_blank">
            <Button
              onClick="window.open('http://epas.terralogic.com/E-PAS/#/login')"
              className={styles.performanceHistory_syncEPASS_btn}
              block
            >
              <img className={styles.iconSync} src="/assets/images/iconSync.svg" alt="iconSync" />
              <u>{formatMessage({ id: 'pages.employeeProfile.performanceTab.syncWithEPAS' })}</u>
            </Button>
          </a>
        </div>
        <PerformanceReview />
        <CareerGraph />
        <PRReports />
        <ProjectHistory />
      </div>
    );
  }
}

export default PerformanceHistory;
