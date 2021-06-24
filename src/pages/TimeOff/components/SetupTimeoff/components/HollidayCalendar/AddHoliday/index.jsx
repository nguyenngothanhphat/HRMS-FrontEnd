/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Modal, Input, DatePicker, Form, Button, Select } from 'antd';
import styles from './index.less';

@connect(
  ({
    user: {
      currentUser: {
        location: { _id: idLocation = '', headQuarterAddress = {}, company = '' } = {},
      } = {},
    } = {},
  }) => ({
    idLocation,
    headQuarterAddress,
    company,
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
    const { addHoliday = () => {} } = this.props;

    const {
      idLocation,
      headQuarterAddress: {
        country: { _id },
      },
      company,
    } = this.props;
    const { date, name } = value;
    const datetime = moment(date).format('YYYY-MM-DD');
    const typeHoliday = [];
    typeHoliday.push(value.type);
    const payload = {
      newHoliday: {
        date: datetime,
        type: typeHoliday,
        name,
        company,
        location: idLocation,
        country: _id,
      },
    };
    addHoliday(payload);
  };

  render() {
    const { visible = false } = this.props;
    const listOfSelect = ['Restricted Holiday'];
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
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
          <Form {...layout} name="basic" onFinish={this.onFinish}>
            <Form.Item
              label="Name"
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
              rules={[{ required: true, message: 'Please choose type of holiday!' }]}
            >
              <Select placeholder="Select type" allowClear>
                {listOfSelect.map((item) => (
                  <Select.Option key={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Holidays
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default AddHoliday;
