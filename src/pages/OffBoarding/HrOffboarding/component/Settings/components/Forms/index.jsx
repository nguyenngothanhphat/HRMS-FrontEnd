import React, { PureComponent } from 'react';
import FormsHeader from './components/FormsHeader';
import Documents from './components/Documents';
import styles from './index.less';

class Forms extends PureComponent {
  render() {
    return (
      <div className={styles.Forms}>
        <FormsHeader />
        <Documents />
      </div>
    );
  }
}

export default Forms;
