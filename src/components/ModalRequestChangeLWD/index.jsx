import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, DatePicker, Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

class ModalRequestChangeLWD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestLastDate: '',
      commentRequestLastDate: '',
    };
  }

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    this.setState(
      {
        requestLastDate: '',
        commentRequestLastDate: '',
      },
      () => handleCancel(),
    );
  };

  handleSubmit = () => {
    const { handleSubmit = () => {} } = this.props;
    const { requestLastDate, commentRequestLastDate } = this.state;
    const values = { requestLastDate, commentRequestLastDate };
    handleSubmit(values);
  };

  changeDate = (_, requestLastDate) => {
    this.setState({
      requestLastDate,
    });
  };

  handleChange = (e) => {
    this.setState({
      commentRequestLastDate: e.target.value,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  render() {
    const { visible = false, key = '', loading = false } = this.props;
    const { requestLastDate, commentRequestLastDate } = this.state;
    const checkDisabled = !requestLastDate || !commentRequestLastDate;
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
            <span className={styles.titleText}>Extend or shorten last working day</span>
          </div>
          <div className={styles.subText}>Change date</div>
          <DatePicker
            format="MM.DD.YY"
            className={styles.datePicker}
            onChange={this.changeDate}
            disabledDate={this.disabledDate}
          />
          <div className={styles.subText}>Comment change LWD</div>
          <TextArea className={styles.boxComment} onChange={this.handleChange} />

          <Button
            loading={loading}
            className={styles.btnSubmit}
            onClick={this.handleSubmit}
            disabled={checkDisabled}
          >
            Send mail
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ModalRequestChangeLWD;
