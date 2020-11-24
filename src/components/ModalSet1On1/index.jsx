import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, DatePicker, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

class ModalSet1On1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingOn: '',
      meetingAt: '',
    };
  }

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    this.setState(
      {
        meetingOn: '',
        meetingAt: '',
      },
      () => handleCancel(),
    );
  };

  handleSubmit = () => {
    const { handleSubmit = () => {} } = this.props;
    const { meetingOn: meetingDate, meetingAt: meetingTime } = this.state;
    const values = { meetingDate, meetingTime };
    handleSubmit(values);
  };

  // eslint-disable-next-line no-unused-vars
  changeDate = (_, meetingOn) => {
    this.setState({
      meetingOn,
    });
  };

  onChangeMeetingAt = (value) => {
    this.setState({ meetingAt: value });
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  render() {
    const {
      visible = false,
      title = '',
      hideMeetingWith = false,
      textSubmit = 'Send mail',
      listMeetingTime = [],
      key = '',
      loading = false,
    } = this.props;
    const { meetingOn, meetingAt } = this.state;
    const checkDisableHideMeetingWith = !meetingAt || !meetingOn;
    return (
      <Modal
        className={styles.modalSchedule}
        visible={visible}
        key={key === '' ? undefined : key}
        title={false}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        <div className={styles.modalContent}>
          <div style={{ paddingBottom: '25px' }}>
            <span className={styles.titleText}>{title}</span>
          </div>
          <div className={styles.flexContent}>
            <div>
              <div className={styles.subText}>Meeting on</div>
              <DatePicker
                format="YYYY-MM-DD"
                className={styles.datePicker}
                onChange={this.changeDate}
                disabledDate={this.disabledDate}
              />
            </div>
            <div>
              <div className={styles.subText}>Meeting at</div>
              <Select
                className={styles.datePicker}
                onChange={(value) => this.onChangeMeetingAt(value)}
              >
                {listMeetingTime.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          {!hideMeetingWith && <div className={styles.subText}>Meeting with</div>}

          <div
            className={styles.flexContent}
            style={hideMeetingWith ? { justifyContent: 'center' } : {}}
          >
            {!hideMeetingWith && <Select className={styles.selectPicker} />}
            <Button
              loading={loading}
              className={styles.btnSubmit}
              onClick={this.handleSubmit}
              disabled={checkDisableHideMeetingWith}
            >
              {textSubmit}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalSet1On1;
