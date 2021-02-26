import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class CompanySignatoryHeader extends PureComponent {
  render() {
    return (
      <div className={styles.CompanySignatoryHeader}>
        <div className={styles.title}>
          {' '}
          {formatMessage({ id: 'component.companySignatory.title' })}
        </div>
        <div className={styles.subTitle}>
          {formatMessage({ id: 'component.companySignatory.description' })}
        </div>
      </div>
    );
  }
}

export default CompanySignatoryHeader;
