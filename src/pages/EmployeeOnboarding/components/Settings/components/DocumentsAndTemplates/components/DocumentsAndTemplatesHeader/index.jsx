import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class DocumentsAndTemplatesHeader extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplatesHeader}>
        <div className={styles.leftPart}>
          <div className={styles.title}>Document & Templates</div>
          <div className={styles.subTitle}>
            You can manage all of your documents & templates related to off boarding here. The app
            can generate and send your company’s relieving & experience letters.
          </div>
        </div>
        <div className={styles.rightPart}>
          <div className={styles.addButton}>
            <span>Create New Templates</span>
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentsAndTemplatesHeader;
