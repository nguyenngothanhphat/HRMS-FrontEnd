import React, { PureComponent } from 'react';
import Content from './components/Content';
import Header from './components/Header';
import styles from './index.less';

class CustomEmails extends PureComponent {
  render() {
    return (
      <div className={styles.CustomEmails}>
        <Header />
        <Content />
      </div>
    );
  }
}

export default CustomEmails;
