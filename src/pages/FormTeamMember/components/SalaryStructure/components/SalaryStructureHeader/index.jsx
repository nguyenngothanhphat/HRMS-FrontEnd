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
          {formatMessage({ id: 'component.salaryStructureHeader.subTitle1' })}
          <span className={styles.salaryStructureHeader__subtitle__span}>
            {formatMessage({ id: 'component.salaryStructureHeader.subTitle2' })}
          </span>
          {formatMessage({ id: 'component.salaryStructureHeader.subTitle3' })}
        </p>
      </div>
    );
  }
}
