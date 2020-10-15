import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';

import styles from './index.less';

export default class SalaryStructureTemplate extends PureComponent {
  render() {
    return (
      <div className={styles.salaryStructureTemplate}>
        <div className={styles.salaryStructureTemplate_select}>hi</div>
        <div className={styles.salaryStructureTemplate_form}>
          {' '}
          <p>{formatMessage({ id: 'component.salaryStructure.tableWrapper' })}</p>
        </div>
      </div>
    );
  }
}
