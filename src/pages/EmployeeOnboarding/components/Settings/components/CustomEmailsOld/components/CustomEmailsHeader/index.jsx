import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class CustomEmailsHeader extends PureComponent {
  render() {
    return (
      <div className={styles.CustomEmailsHeader}>
        <div className={styles.title}>
          {' '}
          {formatMessage({ id: 'component.customEmailsTableField.title' })}
        </div>
        <div className={styles.subTitle}>
          {formatMessage({ id: 'component.customEmailsTableField.description' })}
        </div>
      </div>
    );
  }
}

export default CustomEmailsHeader;
