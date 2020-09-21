import React, { PureComponent } from 'react';
import PerformanceReview from './components/PerformanceReview';
import styles from './index.less';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <PerformanceReview />
      </div>
    );
  }
}

export default PerformanceHistory;
