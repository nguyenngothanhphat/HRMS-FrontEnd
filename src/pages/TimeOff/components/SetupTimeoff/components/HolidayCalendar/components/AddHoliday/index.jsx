/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable compat/compat */
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

@connect(
  ({
    user: { currentUser: { location: { _id: idLocation = '', company = '' } = {} } = {} } = {},
  }) => ({
    idLocation,
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
    const { date, name } = value;
    const datetime = new Date(date).toISOString();
    const newDateTime = moment(datetime).format(DATE_FORMAT_YMD);
    const typeHoliday = [];
    typeHoliday.push(value.type);
    const payload = {
      // newHoliday: {
      date: newDateTime,
      type: typeHoliday,
      name,
      // company,
      // location: idLocation,
      // country: _id,
      // },
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
        title="Create a new holiday"
        onCancel={this.handleCancel}
        destroyOnClose
        footer={
          <>
            <CustomSecondaryButton
              key="cancel"
              className={styles.btnCancel}
              onClick={this.handleCancel}
            >
              Cancel
            </CustomSecondaryButton>
            <CustomPrimaryButton
              key="submit"
              htmlType="submit"
              form="basic"
              className={styles.btnSubmit}
            >
              Add
            </CustomPrimaryButton>
          </>
        }
      >
        <div className={styles.modal__content}>
          <Form {...layout} name="basic" onFinish={this.onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input Holiday Name!' }]}
            >
              <Input placeholder="Input name of holiday" />
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
          </Form>
        </div>
      </Modal>
    );
  }
}

export default AddHoliday;
