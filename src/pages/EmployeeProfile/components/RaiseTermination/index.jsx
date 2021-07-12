import React, { Component } from 'react';
// import edit from '@/asset/edit.svg';
import path from '@/assets/path.svg';

import styles from './index.less';

class RaiseTermination extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { cancel = () => {} } = this.props;
    cancel();
  };

  render() {
    return (
      <div className={styles.raiseTermination}>
        <div className={styles.raiseTermination__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.raiseTermination__titleSection__text}>Raise Termination</p>
            <div onClick={this.handleCancel} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>Raise Termination</div>
        </div>
      </div>
    );
  }
}

export default RaiseTermination;
