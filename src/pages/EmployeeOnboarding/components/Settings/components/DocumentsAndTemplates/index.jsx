import React, { PureComponent } from 'react';
import DocumentsAndTemplatesHeader from './components/DocumentsAndTemplatesHeader';
import Documents from './components/Documents';
import styles from './index.less';

class DocumentsAndTemplates extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplates}>
        <DocumentsAndTemplatesHeader />
        <Documents />
      </div>
    );
  }
}

export default DocumentsAndTemplates;
