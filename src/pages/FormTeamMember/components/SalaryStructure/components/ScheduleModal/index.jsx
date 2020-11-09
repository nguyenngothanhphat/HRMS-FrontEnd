/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import { Form, Modal, Button, DatePicker, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

@connect(({ candidateInfo: { data: { managerList = [], candidate = '' } = {} } = {} }) => ({
  candidate,
  managerList,
}))
class ScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { dispatch, candidate } = this.props;
    dispatch({
      type: 'candidateInfo/getCandidateManagerList',
      payload: {
        candidate,
      },
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    console.log('ye');
    this.setState({}, () => handleCancel());
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('handle');
  };

  onFinish = (values) => {
    const { dispatch, candidate } = this.props;
    const { meetingOn, meetingAt, meetingWith } = values;
    console.log(meetingOn._d.toLocaleDateString());
    dispatch({
      type: 'candidateInfo/addSchedule',
      payload: {
        candidate,
        schedule: {
          meetingOn: meetingOn._d.toLocaleDateString(),
          meetingAt,
          meetingWith: meetingWith,
        },
      },
    }).then(({ statusCode }) => {
      console.log('ye');
      if (statusCode === 200) {
        this.handleCancel();
      }
    });
  };
  render() {
    const { visible = false, loading, modalContent, managerList } = this.props;
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
          <Form onFinish={this.onFinish}>
            <div style={{ paddingBottom: '25px' }}>
              <span className={styles.titleText}>{modalContent}</span>
            </div>
            <div className={styles.flexContent}>
              <div>
                <Form.Item name="meetingOn" label="Meeting on">
                  <DatePicker format="MM/DD/YYYY" className={styles.datePicker} />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="meetingAt" label="Meeting at">
                  <Select className={styles.datePicker}>
                    <Option value="2:00 pm - 3:00pm">2:00 pm - 3:00pm</Option>
                    <Option value="4:00 pm - 5:00pm">4:00 pm - 5:00pm</Option>
                    <Option value="6:00 pm - 7:00pm">6:00 pm - 7:00pm</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className={styles.flexContent}>
              <div>
                <Form.Item name="meetingWith" label="Meeting with">
                  <Select className={styles.datePicker} placeHolder="Select one">
                    {managerList.map((manager) => {
                      return (
                        <Option
                          value={manager._id}
                        >{`${manager.generalInfo.firstName} ${manager.generalInfo.lastName}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              <Button htmlType="submit" loading={loading} className={styles.btnSubmit}>
                Send mail
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default ScheduleModal;
