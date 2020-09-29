import React, { Component } from 'react';
import styles from './index.less';

class NonExtempNotice extends Component {
  render() {
    return (
      <div className={styles.NonExtempNotice}>
        <div className={styles.NonExtempNotice_title}>Non-Exempt Notice</div>
      </div>
    );
  }
}

export default NonExtempNotice;
