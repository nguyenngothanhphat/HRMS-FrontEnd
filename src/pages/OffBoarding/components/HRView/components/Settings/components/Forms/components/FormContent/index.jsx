import React, { PureComponent } from 'react';
import Templates from './components/Templates';
import styles from './index.less';

class FormContent extends PureComponent {
  render() {
    return (
      <div className={styles.FormContent}>
        <Templates />
      </div>
    );
  }
}

export default FormContent;
