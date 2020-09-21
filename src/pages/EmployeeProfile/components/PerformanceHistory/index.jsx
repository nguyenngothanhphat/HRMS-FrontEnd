import React, { PureComponent } from 'react';
import PerformanceReview from './components/PerformanceReview';
import ProjectHistory from './components/ProjectHistory';
import styles from './index.less';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <PerformanceReview />
        <ProjectHistory />
      </div>
    );
  }
}

export default PerformanceHistory;
