import React, { PureComponent } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select, notification } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM.DD.YY';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@connect(({ usersManagement, loading }) => ({
  usersManagement,
  loadingUpdateEmployee: loading.effects['usersManagement/updateEmployee'],
  loadingUpdateGeneralInfo: loading.effects['usersManagement/updateGeneralInfo'],
  loadingUpdateRoles: loading.effects['usersManagement/updateRolesByEmployee'],
}))
class EditUserModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      locationId: '',
    };
  }

  getRoleOfEmployee = (rolesByEmployee) => {
    const { roles = [] } = rolesByEmployee;
    return roles;
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    const { user = {} } = this.props;
    const {
      location: { _id: locationId = '' } = {},
      company: { _id: companyId = '' } = {},
      _id = '',
      tenant = '',
    } = user;

    dispatch({
      type: 'usersManagement/getRolesByEmployee',
      payload: {
        employee: _id,
        tenantId: tenant,
      },
    }).then((res) => {
      const { statusCode, data = [] } = res;
      if (statusCode === 200) {
        this.formRef.current.setFieldsValue({
          roles: this.getRoleOfEmployee(data),
        });
      }
    });

    dispatch({
      type: 'usersManagement/fetchCountryList',
    });
    this.setState({
      locationId,
      companyId,
    });
  };

  refreshUsersList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchActiveEmployeesList',
    });
    dispatch({
      type: 'usersManagement/fetchInActiveEmployeesList',
    });
  };

  onFinish = (values) => {
    const { dispatch, user = {} } = this.props;
    const { _id = '', tenant = '', generalInfo: { _id: generalInfoId = '' } = {} } = user;
    const { companyId, locationId } = this.state;
    const { workEmail = '', firstName = '', lastName = '', roles = [], status = '' } = values;
    const submitValues = { workEmail, firstName, lastName, roles, locationId, companyId };
    // eslint-disable-next-line no-console
    console.log('Success:', submitValues);
    dispatch({
      type: 'usersManagement/updateRolesByEmployee',
      payload: {
        employee: _id,
        roles,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateGeneralInfo',
      payload: {
        id: generalInfoId,
        workEmail,
        firstName,
        lastName,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateEmployee',
      payload: {
        id: _id,
        location: locationId,
        company: companyId,
        status,
        tenantId: tenant,
      },
    }).then((statusCode) => {
      if (statusCode === 200) {
        notification.success({
          message: 'Update user successfully',
        });
        const { closeEditModal = () => {} } = this.props;
        closeEditModal();
        this.refreshUsersList();
      }
    });
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
      loadingUpdateEmployee = false,
      loadingUpdateGeneralInfo = false,
      loadingUpdateRoles = false,
    } = this.props;

    const roleList = roles.map((role) => role._id);
    const {
      joinDate = '',
      location: { _id: locationName = '' } = {},
      company: { _id: companyName = '' } = {},
      generalInfo: { workEmail = '', firstName = '', lastName = '' } = {},
      employeeId = '',
      status = '',
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
              loading={loadingUpdateEmployee || loadingUpdateGeneralInfo || loadingUpdateRoles}
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
            ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={{
              remember: true,
              employeeId,
              joinDate: moment(joinDate),
              workEmail,
              firstName,
              lastName,
              locationName,
              companyName,
              status,
            }}
          >
            <Form.Item label="Employee ID" labelAlign="left" name="employeeId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Created Date" labelAlign="left" name="joinDate">
              <DatePicker disabled format={dateFormat} />
            </Form.Item>
            <Form.Item
              label="Email"
              labelAlign="left"
              name="workEmail"
              rules={[{ required: false, message: 'Please input work email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="First Name"
              labelAlign="left"
              name="firstName"
              rules={[{ required: false, message: 'Please input first name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              labelAlign="left"
              name="lastName"
              rules={[{ required: false, message: 'Please input last name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Roles"
              labelAlign="left"
              name="roles"
              rules={[{ required: false, message: 'Please select roles!' }]}
            >
              <Select mode="multiple" allowClear showArrow style={{ width: '100%' }}>
                {roleList.map((item) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Location"
              labelAlign="left"
              name="locationName"
              rules={[{ required: false, message: 'Please select location!' }]}
            >
              <Select
                onChange={(key) => {
                  this.setState({
                    locationId: key,
                  });
                }}
              >
                {location.map((item) => {
                  const { _id = '', name = '' } = item;
                  return (
                    <Option key={_id} value={_id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Company"
              labelAlign="left"
              name="companyName"
              rules={[{ required: false, message: 'Please select company!' }]}
            >
              <Select
                onChange={(_, key) => {
                  const { value = '' } = key;
                  this.setState({
                    companyId: value,
                  });
                }}
              >
                {company.map((item) => {
                  const { _id = '', name = '' } = item;
                  return (
                    <Option key={_id} value={_id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              labelAlign="left"
              name="status"
              rules={[{ required: false, message: 'Please input!' }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditUserModal;
