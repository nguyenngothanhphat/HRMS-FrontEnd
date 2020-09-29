import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class DocumentsAndTemplatesHeader extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplatesHeader}>
        <div className={styles.title}>
          {formatMessage({ id: 'component.documentAndTemplates.title' })}
        </div>
        <div className={styles.subTitle}>
          {formatMessage({ id: 'component.documentAndTemplates.subTitle' })}
        </div>
      </div>
    );
  }
}

export default DocumentsAndTemplatesHeader;
