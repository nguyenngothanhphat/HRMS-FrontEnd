import React, { PureComponent } from 'react';
import { Button } from 'antd';
import PerformanceReview from './components/PerformanceReview';
import CareerPath from './components/CareerPath';
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
            <u>Click here to Sync With EPASS</u>
          </Button>
        </div>
        <PerformanceReview />
        <CareerPath />
        <PRReports />
        <ProjectHistory />
      </div>
    );
  }
}

export default PerformanceHistory;
