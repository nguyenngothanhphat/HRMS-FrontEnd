import React, { PureComponent } from 'react';
import styles from './index.less';

class Administrator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>Primary administrator</div>
          <div className={styles.header__action}>Change</div>
        </div>
        <div className={styles.primaryList}>hello</div>
      </div>
    );
  }
}

export default Administrator;
