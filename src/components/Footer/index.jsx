import React, { PureComponent } from 'react';
import styles from './index.less';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.Footer}>
        <div>© 2021 HRMS Inc</div>
        <div>Version 1.0</div>
      </div>
    );
  }
}
