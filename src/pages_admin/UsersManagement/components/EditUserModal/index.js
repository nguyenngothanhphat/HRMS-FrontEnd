import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, DatePicker, Space } from 'antd';
import moment from 'moment';

const dateFormat = 'MM/DD/YYYY';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditUserModal extends PureComponent {
  onFinish = (values) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { editModalVisible, closeEditModal, userProfile } = this.props;
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
    } = userProfile;
    return (
      <>
        {userProfile && userProfile.userId && (
          <Modal
            title={`Edit ${fullName} profile`}
            centered
            visible={editModalVisible}
            onOk={closeEditModal}
            onCancel={closeEditModal}
          >
            <Form
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                label="User ID"
                name="userId"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input disabled defaultValue={userId} />
              </Form.Item>
              <Form.Item
                label="Employee ID"
                name="employeeId"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input disabled defaultValue={employeeId} />
              </Form.Item>
              <Form.Item
                label="Joined Date"
                name="joinedDate"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Space direction="vertical" size={12}>
                  <DatePicker
                    disabled
                    defaultValue={moment(joinedDate, dateFormat)}
                    format={dateFormat}
                  />
                </Space>
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input defaultValue={email} />
              </Form.Item>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input defaultValue={fullName} />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input defaultValue={role} />
              </Form.Item>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input defaultValue={location} />
              </Form.Item>
              <Form.Item
                label="Company"
                name="company"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input defaultValue={company} />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Select disabled defaultValue={status}>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </>
    );
  }
}

export default EditUserModal;
