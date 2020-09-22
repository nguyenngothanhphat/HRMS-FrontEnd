import React, { PureComponent } from 'react';
import addButton from './assets/addButton.svg';
import DocumentsAndTemplatesHeader from './components/DocumentsAndTemplatesHeader';
import Documents from './components/Documents';
import styles from './index.less';

class DocumentsAndTemplates extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplates}>
        <DocumentsAndTemplatesHeader />

        <Documents />

        <img className={styles.addButton} src={addButton} alt="add button" />
      </div>
    );
  }
}

export default DocumentsAndTemplates;
