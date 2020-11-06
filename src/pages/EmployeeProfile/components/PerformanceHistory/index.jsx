import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
import PerformanceReview from './components/PerformanceReview';
import CareerGraph from './components/CareerGraph';
import PRReports from './components/PRReports';
import ProjectHistory from './components/ProjectHistory';
import styles from './index.less';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <div className={styles.performanceHistory_syncEPASS}>
          <Button className={styles.performanceHistory_syncEPASS_btn} block>
            <img className={styles.iconSync} src="/assets/images/iconSync.svg" alt="iconSync" />
            <u>{formatMessage({ id: 'pages.employeeProfile.performanceTab.syncWithEPAS' })}</u>
          </Button>
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
