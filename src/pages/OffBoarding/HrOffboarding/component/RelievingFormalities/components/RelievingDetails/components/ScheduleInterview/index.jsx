import React, { PureComponent } from 'react';
import { Modal, Button, DatePicker, TimePicker, Form } from 'antd';
import styles from './index.less';

const { RangePicker } = TimePicker;
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
    console.log('values', values);
  };

  render() {
    const { visible = false, loading, modalContent } = this.props;
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
                name="date"
                rules={[{ required: true, message: 'Please input date!' }]}
              >
                <DatePicker format="MM/DD" className={styles.datePicker} />
              </Form.Item>
              <Form.Item
                label="Meeting at"
                name="time"
                rules={[{ required: true, message: 'Please input time!' }]}
              >
                <RangePicker
                  //   onChange={(time, timeString) => console.log(time, timeString)}
                  picker="time"
                  format="h:mm A"
                  minuteStep={5}
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  className={styles.datePicker}
                />
              </Form.Item>
            </div>
            <Button htmlType="submit" loading={loading} className={styles.btnSubmit}>
              Send mail
            </Button>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default ScheduleInterview;
