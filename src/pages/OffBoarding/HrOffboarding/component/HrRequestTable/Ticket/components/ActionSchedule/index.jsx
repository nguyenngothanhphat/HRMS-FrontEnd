/* eslint-disable compat/compat */
import React, { Component, Fragment } from 'react';
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
    const { list1On1, nameFrist, onclose = () => {}, handleEdit = () => {} } = this.props;
    const lastArray = list1On1[list1On1.length - 1];
    const array = [lastArray];
    return (
      <div>
        {list1On1.length !== 0 &&
          array.map((item) => (
            <Fragment key={item}>
              <div className={styles.modalSchedule__content}>
                <div className={styles.flex}>
                  <div className={styles.modal__Content}>1-on-1 scheduled with {nameFrist}</div>
                  <div style={{ marginTop: '-5px' }}>
                    <img src={EditIcon} alt="" style={{ padding: '5px' }} onClick={handleEdit} />
                    <img src={CloseIcon} alt="" onClick={onclose} />
                  </div>
                </div>
                <div className={styles.modal__text}>
                  Schedule on: {moment(item.meetingDate).format('DD.MM.YYYY')} | {item.meetingTime}
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    );
  }
}

export default ActionSchedule;
