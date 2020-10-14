import React, { PureComponent } from 'react';
import FilterBar from '../FilterBar';
import styles from './index.less';

export default class LeaveRequestTab extends PureComponent {
  render() {
    return (
      <div className={styles.LeaveRequestTab}>
        <FilterBar />
      </div>
    );
  }
}
