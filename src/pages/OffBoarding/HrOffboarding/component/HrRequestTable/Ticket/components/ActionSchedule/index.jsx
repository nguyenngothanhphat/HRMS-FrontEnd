/* eslint-disable compat/compat */
import React, { Component } from 'react';
import CloseIcon from '@/assets/xclose.svg';
import moment from 'moment';
import EditIcon from '@/assets/xEdit.svg';
import styles from './index.less';

class ActionSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { nameFrist, onclose = () => {}, handleEdit = () => {}, itemSet1On1 = {} } = this.props;
    const { meetingDate, meetingTime } = itemSet1On1;
    return (
      <div className={styles.actionSchedule}>
        <div className={styles.flex}>
          <div className={styles.modalContent}>1-on-1 scheduled with {nameFrist}</div>
          <div style={{ marginTop: '-5px' }}>
            <img
              src={EditIcon}
              alt=""
              style={{ padding: '5px', cursor: 'pointer' }}
              onClick={handleEdit}
            />
            <img src={CloseIcon} style={{ cursor: 'pointer' }} alt="" onClick={onclose} />
          </div>
        </div>
        <div className={styles.modal__text}>
          Schedule on: {moment(meetingDate).format('DD.MM.YYYY')} | {meetingTime}
        </div>
      </div>
    );
  }
}

export default ActionSchedule;
