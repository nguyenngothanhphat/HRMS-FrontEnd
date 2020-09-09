import React, { PureComponent } from 'react';

import styles from './index.less';

export default class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.bottomBar}>
        <div className={styles.bottomBar__status}>asdas</div>
        <div className={styles.bottomBar__button}>asdasd</div>
      </div>
    );
  }
}
