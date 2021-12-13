import React, { PureComponent } from 'react';
import Header from './components/Header';
import TableContainer from './components/TableContainer';
import styles from './index.less';

class DocumentsAndTemplates extends PureComponent {
  render() {
    return (
      <div className={styles.DocumentsAndTemplates}>
        <Header />
        <TableContainer />
      </div>
    );
  }
}

export default DocumentsAndTemplates;
