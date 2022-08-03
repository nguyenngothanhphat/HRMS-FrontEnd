import React, { PureComponent } from 'react';
import FormContent from './components/FormContent';
import Header from './components/Header';
import styles from './index.less';

class Forms extends PureComponent {
  render() {
    return (
      <div className={styles.Forms}>
        <Header />
        <FormContent />
      </div>
    );
  }
}

export default Forms;
