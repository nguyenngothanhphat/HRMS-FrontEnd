import React, { PureComponent } from 'react';
import styles from './index.less';

class PerformanceHistory extends PureComponent {
  render() {
    return (
      <div className={styles.performanceHistory}>
        <span>Performance History</span>
      </div>
    );
  }
}

export default PerformanceHistory;
