import React, { PureComponent } from 'react';
import styles from './index.less';

export default class SalaryStructureHeader extends PureComponent {
  render() {
    return (
      <div className={styles.salaryStructureHeader}>
        <p className={styles.salaryStructureHeader__title}>Salary Structure</p>
        <p className={styles.salaryStructureHeader__subtitle}>
          The pay division as per the position of ‘UX Designer’ has been given below.
        </p>
      </div>
    );
  }
}
