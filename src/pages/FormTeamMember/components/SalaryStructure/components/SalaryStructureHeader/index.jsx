import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';

import styles from './index.less';

export default class SalaryStructureHeader extends PureComponent {
  render() {
    return (
      <div className={styles.salaryStructureHeader}>
        <p className={styles.salaryStructureHeader__title}>
          {formatMessage({ id: 'component.salaryStructureHeader.title' })}
        </p>
        <p className={styles.salaryStructureHeader__subtitle}>
          {formatMessage({ id: 'component.salaryStructureHeader.subTitle' })}
        </p>
      </div>
    );
  }
}
