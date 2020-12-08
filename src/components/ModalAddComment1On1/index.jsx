import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, DatePicker, Select, Input } from 'antd';
import styles from './index.less';

const formatDate = 'YYYY-MM-DD';

const { TextArea } = Input;

class ModalSet1On1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    this.setState(
      {
        content: '',
      },
      () => handleCancel(),
    );
  };

  handleSubmit = () => {
    const { handleSubmit = () => {}, data: { _id: id = '' } = {} } = this.props;
    const { content = '' } = this.state;
    handleSubmit({ id, content });
  };

  onChangeInput = ({ target: { value } }) => {
    this.setState({
      content: value,
    });
  };

  render() {
    const { visible = false, key = '', data = {}, loading = false } = this.props;
    const { content = '' } = this.state;
    const { meetingDate = '', meetingTime = '' } = data;
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
            <span className={styles.titleText}>Add Comment Set 1 On 1</span>
          </div>
          <div className={styles.flexContent}>
            <div>
              <div className={styles.subText}>Meeting on</div>
              <DatePicker
                format={formatDate}
                className={styles.datePicker}
                defaultValue={moment(meetingDate, formatDate)}
                disabled
              />
            </div>
            <div>
              <div className={styles.subText}>Meeting at</div>
              <Select className={styles.datePicker} disabled value={meetingTime} />
            </div>
          </div>
          <div className={styles.subText}>Content</div>
          <TextArea rows={3} onChange={this.onChangeInput} className={styles.inputContent} />
          <div className={styles.flexContent} style={{ justifyContent: 'center' }}>
            <Button
              loading={loading}
              className={styles.btnSubmit}
              onClick={this.handleSubmit}
              disabled={!content}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalSet1On1;
