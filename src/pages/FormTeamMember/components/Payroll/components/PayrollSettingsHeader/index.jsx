import React, { PureComponent } from 'react';
import styles from './index.less';

export default class PayrollSettingsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.PayrollSettingsHeader}>
        <p className={styles.title}>Payroll Settings</p>
        <p className={styles.subtitle}>
          Please choose all the acceptable documents that the candidate can provide. The mandatory
          documents are required and cannot be deselected.
        </p>
      </div>
    );
  }
}
