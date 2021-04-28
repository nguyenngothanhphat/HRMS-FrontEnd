import React, { Component } from 'react';
import { EditFilled } from '@ant-design/icons';

import styles from './index.less';

export class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>User Infomation</div>
          <div className={styles.header__icon}>
            <EditFilled /> <span>Edit</span>
          </div>
        </div>
        <div className={styles.userInfo}>hello</div>
      </div>
    );
  }
}

export default ViewProfile;
