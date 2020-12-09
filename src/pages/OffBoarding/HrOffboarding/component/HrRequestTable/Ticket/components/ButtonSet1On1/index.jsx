/* eslint-disable compat/compat */
import React, { PureComponent } from 'react';
import { Button } from 'antd';
import ScheduleModal from '../ModalMettingOnOne';
import styles from './index.less';

class ScheduleMetting extends PureComponent {
  render() {
    const {
      loading,
      handleSubmit,
      listMeetingTime,
      handleclick,
      visible,
      keyModal = '',
      handleCandelSchedule,
    } = this.props;
    return (
      <div className={styles.modal__content} key={keyModal === '' ? undefined : keyModal}>
        <div className={styles.modal__text}>
          A change has been requested for the last working day. To resolve the same:
        </div>
        <Button className={styles.modal__Button} onClick={handleclick}>
          Schedule a 1 -on -1
        </Button>
        <ScheduleModal
          loading={loading}
          list={listMeetingTime}
          visible={visible}
          handleSubmit={handleSubmit}
          modalContent="Schedule 1-on-1"
          handleCancel={handleCandelSchedule}
          keyModal={keyModal}
        />
      </div>
    );
  }
}

export default ScheduleMetting;
