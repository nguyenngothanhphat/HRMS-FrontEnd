/* eslint-disable compat/compat */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Modal, Input, DatePicker, Form, Button } from 'antd';
import styles from './index.less';

@connect(
  ({ loading, user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {} }) => ({
    loading: loading.effects['timeOff/addHoliday'],
    idLocation,
  }),
)
class AddHoliday extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  onFinish = (value) => {
    const { idLocation, dispatch } = this.props;
    const { date, name, type } = value;
    const datetime = moment(date).format('YYYY-MM-DD');
    const payload = { newHoliday: { datetime, name, type }, location: idLocation };
    // dispatch({
    //   type: 'timeOff/addHoliday',
    //   payload,
    // });
  };

  render() {
    const { visible = false } = this.props;
    return (
      <Modal
        className={styles.modal}
        visible={visible}
        title={false}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        <div className={styles.modal__content}>
          <Form name="basic" onFinish={this.onFinish}>
            <Form.Item
              label="name"
              name="name"
              rules={[{ required: true, message: 'Please input Holiday Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please input Holiday date!' }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input Holiday Type!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default AddHoliday;
