/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const Option = Select;

@connect(
  ({
    loading,
    employeesManagement: {
      companyList = [],
      locationList = [],
      departmentList = [],
      jobTitleList = [],
    },
  }) => ({
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    loading: loading.effects['employeesManagement/addEmployee'],
  }),
)
class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isDisabled: false,
    };
  }

  onChangeSelectCompany = (value) => {
    console.log('value', value);
    this.setState({
      isDisabled: true,
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  handleChangeAddEmployee = () => {};

  handleSubmitEmployee = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/addEmployee',
      payload: values,
    });
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
    const formLayout = {
      labelCol: { span: 8 },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
      },
    };
    const { companyList, locationList, departmentList, jobTitleList } = this.props;
    const { isDisabled } = this.state;
    return (
      <div className={styles.addEmployee__form}>
        <Form
          name="formAddEmployee"
          requiredMark={false}
          colon={false}
          labelAlign="left"
          ref={this.formRef}
          validateMessages={validateMessages}
          id="addEmployeeForm"
          onValuesChange={this.handleChangeAddEmployee}
          onFinish={this.handleSubmitEmployee}
          {...formLayout}
        >
          <Form.Item
            label="Name"
            name="firstName"
            rules={[
              { required: true },
              {
                pattern: /^[a-zA-Z ]*$/,
                message: 'Name is not a validate name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Personal Email"
            name="personalEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Work Email"
            name="workEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Company" name="company" rules={[{ required: true }]}>
            <Select
              placeholder="Select Company"
              showArrow
              showSearch
              onChange={this.onChangeSelectCompany}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {companyList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select
              placeholder="Select Location"
              showArrow
              showSearch
              disabled={isDisabled}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locationList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select
              placeholder="Select Department"
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Job Title" name="jobTitle">
            <Select
              placeholder="Select Job Title"
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {jobTitleList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Reporting Manager" name="reportingManager" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  };

  render() {
    const { visible = false, loading } = this.props;
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
            Cancel
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="addEmployeeForm"
            loading={loading}
            className={styles.btnSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        {this.renderAddEmployeeForm()}
      </Modal>
    );
  }
}

export default AddEmployeeForm;
