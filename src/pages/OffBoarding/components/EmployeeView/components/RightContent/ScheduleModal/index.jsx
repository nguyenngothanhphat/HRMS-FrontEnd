/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, DatePicker, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

class ScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  handleSubmit = () => {};

  render() {
    const { visible = false, loading, modalContent } = this.props;
    return (
      <Modal
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
              <DatePicker format="MM/DD" className={styles.datePicker} />
            </div>
            <div>
              <div className={styles.subText}>Meeting at</div>
              <Select className={styles.datePicker}>
                <Option value="">2:00 pm - 3:00pm</Option>
                <Option value="">4:00 pm - 5:00pm</Option>
                <Option value="">6:00 pm - 7:00pm</Option>
              </Select>
            </div>
          </div>
          <div className={styles.subText}>Meeting with</div>
          <div className={styles.flexContent}>
            <div>
              <Select className={styles.selectPicker} />
            </div>
            <Button
              key="submit"
              loading={loading}
              className={styles.btnSubmit}
              onClick={this.handleSubmit}
            >
              Send mail
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ScheduleModal;
