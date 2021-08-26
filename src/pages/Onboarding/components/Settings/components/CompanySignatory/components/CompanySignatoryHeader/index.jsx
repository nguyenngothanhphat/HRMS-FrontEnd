import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class CompanySignatoryHeader extends PureComponent {
  render() {
    const { showAddSignatoryModal = () => {} } = this.props;
    return (
      <div className={styles.CompanySignatoryHeader}>
        <div className={styles.leftPart}>
          <div className={styles.title}>
            {' '}
            {formatMessage({ id: 'component.companySignatory.title' })}
          </div>
          <div className={styles.subTitle}>
            {formatMessage({ id: 'component.companySignatory.description' })}
          </div>
        </div>
        <div className={styles.rightPart}>
          <div className={styles.addButton} onClick={() => showAddSignatoryModal(true)}>
            <span>Create New Signature</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanySignatoryHeader;
