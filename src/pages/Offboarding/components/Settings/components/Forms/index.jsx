import React, { PureComponent } from 'react';
import FormContent from './components/FormContent';
import FormsHeader from './components/FormsHeader';
import styles from './index.less';

class Forms extends PureComponent {
  render() {
    return (
      <div className={styles.Forms}>
        <FormsHeader />
        <FormContent />
      </div>
    );
  }
}

export default Forms;
