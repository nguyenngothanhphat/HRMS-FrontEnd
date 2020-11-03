/* eslint-disable compat/compat */
import React, { Component } from 'react';
import CloseIcon from '@/assets/xclose.svg';
import EditIcon from '@/assets/xEdit.svg';
import styles from './index.less';

class ActionSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.modalSchedule__content}>
        <div className={styles.flex}>
          <div className={styles.modal__Content}>1-on-1 scheduled with Venkat</div>
          <div style={{ marginTop: '-5px' }}>
            <img src={EditIcon} alt="" style={{ padding: '5px' }} />
            <img src={CloseIcon} alt="" />
          </div>
        </div>
        <div className={styles.modal__text}>Schedule on: 22.05.20 | 12PM</div>
      </div>
    );
  }
}

export default ActionSchedule;
