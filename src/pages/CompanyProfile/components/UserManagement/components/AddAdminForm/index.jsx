/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-template-curly-in-string */
import { Button, Form, Input, Modal, DatePicker, Select } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import _ from 'lodash';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    companiesManagement: { locationsList: workLocations = [] } = {},
    departmentManagement: { listByCompany: listDepartment = [] } = {},
    employee: { listEmployeeActive = [] } = {},
    adminSetting: { listRoleByCompany = [] } = {},
  }) => ({
    currentUser,
    workLocations,
    listDepartment,
    listEmployeeActive,
    listRoleByCompany,
    loadingAdd: loading.effects['employee/addEmployee'],
    loadingUpdate: loading.effects['employee/updateEmployee'],
  }),
)
class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel = () => {} } = this.props;
    handleCancel();
  };

  handleSubmitEmployee = (values) => {
    const { handleSubmit = () => {} } = this.props;
    handleSubmit(values);
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  renderAddEmployeeForm = () => {
    const {
      currentUser: { company = {} } = {},
      workLocations = [],
      listDepartment = [],
      listEmployeeActive = [],
      userSelected = {},
      listRoleByCompany = [],
    } = this.props;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
      },
    };
    const defineRoleAdmin = ['ADMIN-CSA', 'HR-GLOBAL', 'HR-MANAGER'];
    const listRoleAdmin = listRoleByCompany.filter((role) => defineRoleAdmin.includes(role?._id));
    return (
      <div className={styles.addEmployee__form} id="addEmployee__form">
        <Form
          autoComplete="off"
          name="formAddEmployee"
          colon={false}
          labelAlign="left"
          layout="horizontal"
          ref={this.formRef}
          validateMessages={validateMessages}
          id="addEmployeeForm"
          onFinish={this.handleSubmitEmployee}
          initialValues={{ ...userSelected }}
          {...formLayout}
        >
          <Form.Item
            label={formatMessage({ id: 'addEmployee.employeeID' })}
            name="employeeId"
            rules={[
              { required: true },
              {
                pattern: /^([a-zA-Z0-9]((?!__|--)[a-zA-Z0-9_\-\s])+[a-zA-Z0-9])$/,
                message: 'Employee ID is not a validate ID!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.name' })}
            name="firstName"
            rules={[
              { required: true },
              {
                pattern: /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/,
                message: 'Name is not a validate name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.employees.table.joinedDate' })}
            name="joinDate"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
            />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.personalEmail' })}
            name="personalEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input disabled={userSelected._id} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.workEmail' })}
            name="workEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input disabled={userSelected._id} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.roles' })}
            name="roles"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              allowClear
              showArrow
              style={{ width: '100%' }}
              placeholder="Select Roles"
              disabled={userSelected._id}
            >
              {listRoleAdmin.map((item) => (
                <Option key={item?._id}>{item?._id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.company' })}
            name="company"
            initialValue={company._id}
            rules={[{ required: true }]}
          >
            <Select disabled>
              <Option key={company._id} value={company._id}>
                {company.name}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.location' })}
            name="location"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.location' })}
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {workLocations.map((item) => {
                const { name = '', _id = '' } = item;
                if (!_.isEmpty(name)) {
                  return <Option key={_id}>{name}</Option>;
                }
                return null;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.department' })}
            name="department"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.department' })}
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listDepartment.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className={styles.reportingManager}
            label={formatMessage({ id: 'addEmployee.manager' })}
            name="manager"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.manager' })}
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listEmployeeActive.map((item = {}) => (
                <Option key={item?._id}>
                  {`${item.generalInfo.firstName} ${item.generalInfo.lastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  };

  render() {
    const { visible = false, loadingAdd, loadingUpdate } = this.props;
    return (
      <Modal
        className={styles.addEmployee}
        visible={visible}
        title={this.renderHeaderModal()}
        onCancel={this.handleCancel}
        style={{ top: 50 }}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            {formatMessage({ id: 'employee.button.cancel' })}
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="addEmployeeForm"
            loading={loadingAdd || loadingUpdate}
            className={styles.btnSubmit}
          >
            {formatMessage({ id: 'employee.button.submit' })}
          </Button>,
        ]}
      >
        {this.renderAddEmployeeForm()}
      </Modal>
    );
  }
}

export default AddEmployeeForm;
