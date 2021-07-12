import React, { Component } from 'react';
// import edit from '@/asset/edit.svg';
import path from '@/assets/path.svg';

import styles from './index.less';

class PutOnLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.putOnLeaveRoot}>
        <div className={styles.putOnLeaveRoot__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.putOnLeaveRoot__titleSection__text}>Put on Leave (LWP)</p>
            <div onClick={this.handleMakeChanges} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>PutOnLeave</div>
        </div>
      </div>
    );
  }
}

export default PutOnLeave;
