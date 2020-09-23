import React, { PureComponent } from 'react';
import PerformanceReview from './components/PerformanceReview';
import CareerPath from './components/CareerPath';
import PRReports from './components/PRReports';
import ProjectHistory from './components/ProjectHistory';
import styles from './index.less';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <PerformanceReview />
        <CareerPath />
        <PRReports />
        <ProjectHistory />
      </div>
    );
  }
}

export default PerformanceHistory;
