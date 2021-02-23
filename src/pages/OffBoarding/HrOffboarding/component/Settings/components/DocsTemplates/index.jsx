import React, { PureComponent } from 'react';
import DocsTemplatesHeader from './components/DocsTemplatesHeader';
import Documents from './components/Documents';
import styles from './index.less';

class DocsTemplates extends PureComponent {
  render() {
    return (
      <div className={styles.DocsTemplates}>
        <DocsTemplatesHeader />
        <Documents />
      </div>
    );
  }
}

export default DocsTemplates;
