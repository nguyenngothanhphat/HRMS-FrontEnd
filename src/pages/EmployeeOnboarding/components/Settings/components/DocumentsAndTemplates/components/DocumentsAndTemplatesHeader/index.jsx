import React, { PureComponent } from 'react';
import styles from './index.less';

class DocumentsAndTemplatesHeader extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplatesHeader}>
        <div className={styles.title}>Document & Templates</div>
        <div className={styles.subTitle}>
          You can manage all of your documents , templates and custom emails here. The app can
          generate and send your company’s offer letters, employee handbooks, hiring agreements and
          custom emails to your new hires.
        </div>
      </div>
    );
  }
}

export default DocumentsAndTemplatesHeader;
