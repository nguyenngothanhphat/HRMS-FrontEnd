import React, { PureComponent } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'Do MMM YYYY';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@connect(({ usersManagement }) => ({
  usersManagement,
}))
class EditUserModal extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchCountryList',
    });
  };

  onFinish = (values) => {
    const { email = '', fullName = '', role = '', location = '', company = '' } = values;
    const submitValues = { email, fullName, role, location, company };
    // eslint-disable-next-line no-console
    console.log('Success:', submitValues);
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
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
    const {
      usersManagement: { roles = [], location = [], company = [] },
      editModalVisible = () => {},
      closeEditModal = () => {},
      user = {},
    } = this.props;
    const {
      joinDate = '',
      location: { name: locationName = '' } = {},
      company: { name: companyName = '' } = {},
      generalInfo: { employeeId = '', workEmail = '', firstName = '', lastName = '' } = {},
      status = '',
    } = user;
    const fullName = `${firstName} ${lastName}`;
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
              employeeId,
              joinDate: moment(joinDate),
              workEmail,
              fullName,
              // role,
              locationName,
              companyName,
              status,
            }}
          >
            <Form.Item label="Employee ID" name="employeeId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Joined Date" name="joinDate">
              <DatePicker disabled format={dateFormat} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="workEmail"
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
              label="Roles"
              name="roles"
              rules={[{ required: true, message: 'Please select roles!' }]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow
                style={{ width: '100%' }}
                // defaultValue={['a10', 'c12']}
                // onChange={handleChange}
              >
                {roles.map((item) => {
                  const { _id = '' } = item;
                  return (
                    <Option key={_id} value={_id}>
                      {_id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Location"
              name="locationName"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select onChange={() => {}}>
                {location.map((item) => {
                  const { _id, name } = item;
                  return (
                    <Option key={_id} value={name}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Company"
              name="companyName"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select onChange={() => {}}>
                {company.map((item) => {
                  const { _id, name } = item;
                  return (
                    <Option key={_id} value={name}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select>
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditUserModal;
