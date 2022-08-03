import React, { PureComponent } from 'react';
import Header from './components/Header';
import Documents from './components/Documents';
import styles from './index.less';

class DocsTemplates extends PureComponent {
  render() {
    return (
      <div className={styles.DocsTemplates}>
        <Header />
        <Documents />
      </div>
    );
  }
}

export default DocsTemplates;
