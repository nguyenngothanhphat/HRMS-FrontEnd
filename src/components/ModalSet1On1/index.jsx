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
      assignee: undefined,
    };
  }

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    this.setState(
      {
        meetingOn: '',
        meetingAt: '',
        assignee: undefined,
      },
      () => handleCancel(),
    );
  };

  selectAssignee = (assignee) => {
    this.setState({
      assignee,
    });
  };

  handleSubmit = () => {
    const { handleSubmit = () => {} } = this.props;
    const { meetingOn: meetingDate, meetingAt: meetingTime, assignee } = this.state;
    const values = { meetingDate, meetingTime, assignee };
    handleSubmit(values);
  };

  changeDate = (_, meetingOn) => {
    this.setState({
      meetingOn,
    });
  };

  onChangeMeetingAt = (value) => {
    this.setState({ meetingAt: value });
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  render() {
    const {
      visible = false,
      title = '',
      hideMeetingWith = false,
      textSubmit = 'Send mail',
      listMeetingTime = [],
      listAssignee = [],
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
          {!hideMeetingWith && <div className={styles.subText}>Assignee</div>}

          <div
            className={styles.flexContent}
            style={hideMeetingWith ? { justifyContent: 'center' } : {}}
          >
            {!hideMeetingWith && (
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                className={styles.selectPicker}
                onChange={this.selectAssignee}
              >
                {listAssignee.map((item = {}) => {
                  const { _id = '', email = '' } = item;
                  return (
                    <Option key={_id} value={_id}>
                      {email}
                    </Option>
                  );
                })}
              </Select>
            )}
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
