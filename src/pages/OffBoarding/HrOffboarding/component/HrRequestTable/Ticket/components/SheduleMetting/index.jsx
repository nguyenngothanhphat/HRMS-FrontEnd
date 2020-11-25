/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Button } from 'antd';
import ScheduleModal from '../ModalMettingOnOne';
import styles from './index.less';

class ScheduleMetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleclick = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    // const { visible } = this.state;
    const {
      handleSubmit,
      listMeetingTime,
      handleclick,
      visible,
      handleCandelSchedule,
    } = this.props;
    return (
      <div className={styles.modal__content}>
        <div className={styles.modal__text}>
          A change has been requested for the last working day. To resolve the same:
        </div>
        <Button className={styles.modal__Button} onClick={handleclick}>
          Schedule a 1 -on -1
        </Button>
        <ScheduleModal
          list={listMeetingTime}
          visible={visible}
          handleSubmit={handleSubmit}
          modalContent="Schedule 1-on-1"
          handleCancel={handleCandelSchedule}
        />
      </div>
    );
  }
}

export default ScheduleMetting;
