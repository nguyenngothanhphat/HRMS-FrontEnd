import React, { PureComponent } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditUserModal extends PureComponent {
  onFinish = (values) => {
    const { email, fullName, role, location, company } = values;
    const submitValues = { email, fullName, role, location, company };
    console.log('Success:', submitValues);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  renderHeaderModal = () => {
    const { titleModal = 'Edit User Profile' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  render() {
    const { editModalVisible, closeEditModal, user } = this.props;
    const {
      userId,
      employeeId,
      joinedDate,
      email,
      fullName,
      role,
      location,
      company,
      status,
    } = user;
    return (
      <>
        <Modal
          className={styles.modalEdit}
          onCancel={closeEditModal}
          footer={[
            <Button className={styles.btnCancel} onClick={closeEditModal}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
            >
              Save
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={editModalVisible}
        >
          <Form
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...layout}
            name="basic"
            id="myForm"
            onFinish={this.onFinish}
            initialValues={{
              remember: true,
              userId,
              employeeId,
              joinedDate: moment(joinedDate, dateFormat),
              email,
              fullName,
              role,
              location,
              company,
              status,
            }}
          >
            <Form.Item
              label="User ID"
              name="userId"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Employee ID"
              name="employeeId"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Joined Date"
              name="joinedDate"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              {/* <Space direction="vertical" size={12}> */}
              <DatePicker disabled format={dateFormat} />
              {/* </Space> */}
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select disabled>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditUserModal;
