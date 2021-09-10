/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { connect } from 'umi';
import { Form, Modal, Button, DatePicker, Select } from 'antd';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;

@connect(({ newCandidateForm: { data: { managerList = [], _id = '' } = {} } = {} }) => ({
  _id,
  managerList,
}))
class ScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { dispatch, _id } = this.props;
    dispatch({
      type: 'newCandidateForm/getCandidateManagerList',
      payload: {
        candidate: _id,
        tenantId: getCurrentTenant(),
      },
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
    // dispatch({
    //   type: 'newCandidateForm/redirectToOnboardList',
    // });
  };

  handleSubmit = () => {};

  onFinish = (values) => {
    const { dispatch, _id } = this.props;
    const { meetingOn, meetingAt, meetingWith } = values;
    dispatch({
      type: 'newCandidateForm/addSchedule',
      payload: {
        candidate: _id,
        schedule: {
          meetingOn: meetingOn._d.toLocaleDateString(),
          meetingAt,
          meetingWith,
        },
      },
    }).then(({ statusCode }) => {
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
                  <DatePicker format="MM.DD.YY" className={styles.datePicker} />
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
                        <Option value={manager?._id || ''}>
                          {`${manager?.generalInfo?.firstName} ${manager?.generalInfo?.lastName}`}
                        </Option>
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
