import React, { PureComponent } from 'react';
import styles from './index.less';

export default class PayrollSettingsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.PayrollSettingsHeader}>
        <p className={styles.title}>Payroll Settings</p>
        <p className={styles.subtitle}>
          All documents supporting candidate’s employment eligibility will be displayed here
        </p>
      </div>
    );
  }
}
