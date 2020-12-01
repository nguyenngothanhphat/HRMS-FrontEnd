import React, { PureComponent } from 'react';
import { Modal, Button, DatePicker, Form, Select } from 'antd';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

// const { RangePicker } = TimePicker;

const { Option } = Select;
class ScheduleInterview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  handleSendSchedule = (values) => {
    const { handleSendSchedule = () => {} } = this.props;
    handleSendSchedule(values);
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  render() {
    const { visible = false, loadingCreateSchedule, modalContent, listMeetingTime } = this.props;
    return (
      <Modal
        className={styles.scheduleInterview}
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
          <Form layout="vertical" requiredMark={false} onFinish={this.handleSendSchedule}>
            <div className={styles.flexContent}>
              <Form.Item
                label="Meeting on"
                name="meetingDate"
                rules={[{ required: true, message: 'Please input date!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  className={styles.datePicker}
                  disabledDate={this.disabledDate}
                />
              </Form.Item>
              <Form.Item
                label="Meeting at"
                name="meetingTime"
                rules={[{ required: true, message: 'Please input time!' }]}
              >
                {/* <RangePicker
                  //   onChange={(time, timeString) => console.log(time, timeString)}
                  picker="time"
                  format="h:mm A"
                  minuteStep={5}
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  className={styles.datePicker}
                /> */}
                <Select className={styles.datePicker}>
                  {listMeetingTime.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Button htmlType="submit" loading={loadingCreateSchedule} className={styles.btnSubmit}>
              {formatMessage({ id: 'pages.relieving.btn.sendMail' })}
            </Button>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default ScheduleInterview;
