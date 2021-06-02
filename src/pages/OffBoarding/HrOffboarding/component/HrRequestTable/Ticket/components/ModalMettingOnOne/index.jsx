/* eslint-disable compat/compat */
import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, DatePicker, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

class ScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingDate: '',
      meetingTime: '',
    };
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState(
      {
        meetingDate: '',
        meetingTime: '',
      },
      () => handleCancel(),
    );
  };

  handleSubmit = () => {
    const { handleSubmit = () => {} } = this.props;
    const { meetingDate, meetingTime } = this.state;
    const data = { meetingDate, meetingTime };
    handleSubmit(data);
  };

  meetingTime = (value) => {
    this.setState({ meetingTime: value });
  };

  mettingDate = (_, date) => {
    this.setState({ meetingDate: date });
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  render() {
    const { visible = false, loading, modalContent, list, keyModal: key } = this.props;
    const { meetingDate, meetingTime } = this.state;
    const check = !meetingDate || !meetingTime;
    return (
      <Modal
        key={key === '' ? undefined : key}
        className={styles.modalSchedule}
        visible={visible}
        title={false}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        <div className={styles.modalContent}>
          <div style={{ paddingBottom: '25px' }}>
            <span className={styles.titleText}>{modalContent}</span>
          </div>
          <div className={styles.flexContent}>
            <div>
              <div className={styles.subText}>Meeting on</div>
              <DatePicker
                format="MM.DD.YY"
                className={styles.datePicker}
                onChange={this.mettingDate}
                disabledDate={this.disabledDate}
              />
            </div>
            <div>
              <div className={styles.subText}>Meeting at</div>
              <Select className={styles.datePicker} onChange={(value) => this.meetingTime(value)}>
                {list.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className={styles.center}>
            <Button
              key="submit"
              loading={loading}
              disabled={check}
              className={styles.btnSubmit}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ScheduleModal;
