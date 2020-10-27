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
      rolesList = [],
      companyList = [],
      locationList = [],
      departmentList = [],
      jobTitleList = [],
      reportingManagerList = [],
    },
  }) => ({
    rolesList,
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    reportingManagerList,
    loadingDepartment: loading.effects['employeesManagement/fetchDepartmentList'],
    loading: loading.effects['employeesManagement/addEmployee'],
  }),
)
class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isDisabled: true,
      isDisabledDepartment: true,
      company: '',
      location: '',
    };
  }

  componentDidMount() {
    const { company } = this.props;
    if (company !== '') {
      this.setState({
        isDisabled: false,
      });
      this.fetchData(company._id);
    }
  }

  componentDidUpdate(prevState) {
    const { location } = this.state;
    if (location !== '' && location !== prevState.location) {
      this.formRef.current.setFieldsValue({
        department: undefined,
      });
    }
  }

  fetchData = (_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchReportingManagerList',
      payload: {
        company: _id,
      },
    });
    dispatch({
      type: 'employeesManagement/fetchLocationList',
      payload: {
        company: _id,
      },
    });
    dispatch({
      type: 'employeesManagement/fetchJobTitleList',
      payload: {
        company: _id,
      },
    });
  };

  onChangeSelect = (type, value) => {
    const { dispatch } = this.props;
    const { company } = this.state;

    switch (type) {
      case 'company':
        this.fetchData(value);
        this.setState({
          isDisabled: false,
          company: value,
        });
        this.formRef.current.setFieldsValue({
          location: undefined,
          title: undefined,
          manager: undefined,
        });
        break;
      case 'location':
        this.setState({
          location: value,
          isDisabledDepartment: false,
        });
        dispatch({
          type: 'employeesManagement/fetchDepartmentList',
          payload: {
            company,
            location: value,
          },
        });
        break;
      default:
        break;
    }
  };

  handleCancel = () => {
    const { handleCancel, dispatch } = this.props;
    this.setState(
      {
        location: '',
        company: '',
        isDisabled: true,
        isDisabledDepartment: true,
      },
      () => handleCancel(),
    );
    dispatch({
      type: 'employeesManagement/save',
      payload: {
        companyList: [],
        departmentList: [],
        locationList: [],
        jobTitleList: [],
        reportingManagerList: [],
      },
    });
  };

  handleChangeAddEmployee = () => {};

  handleSubmitEmployee = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/addEmployee',
      payload: values,
    });
    this.formRef.current.resetFields();
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
      wrapperCol: { span: 16 },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
      },
    };
    const {
      rolesList,
      companyList,
      locationList,
      departmentList,
      jobTitleList,
      reportingManagerList,
      loadingDepartment,
      company,
    } = this.props;
    const { isDisabled, isDisabledDepartment } = this.state;
    return (
      <div className={styles.addEmployee__form}>
        <Form
          name="formAddEmployee"
          requiredMark={false}
          colon={false}
          labelAlign="left"
          layout="horizontal"
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
          <Form.Item
            label="Roles"
            name="roles"
            rules={[{ required: true, message: 'Please select roles!' }]}
          >
            <Select mode="multiple" allowClear showArrow style={{ width: '100%' }}>
              {rolesList.map((item) => {
                const { _id = '', name = '' } = item;
                return (
                  <Option key={_id} value={_id}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Company" name="company" rules={[{ required: true }]}>
            {company ? (
              <Select defaultValue={company._id} disabled>
                <Option value={company._id}>{company.name}</Option>
              </Select>
            ) : (
              <Select
                placeholder="Select Company"
                showArrow
                showSearch
                onChange={(value) => this.onChangeSelect('company', value)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {companyList.map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select
              placeholder="Select Location"
              showArrow
              showSearch
              disabled={isDisabled}
              onChange={(value) => this.onChangeSelect('location', value)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locationList.map((item) => (
                <Option key={item._id}>{item.headQuarterAddress.address}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select
              placeholder="Select Department"
              showArrow
              showSearch
              loading={loadingDepartment}
              disabled={isDisabledDepartment}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Job Title" name="title">
            <Select
              placeholder="Select Job Title"
              showArrow
              showSearch
              disabled={isDisabled}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {jobTitleList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className={styles.reportingManager}
            label="Reporting Manager"
            name="manager"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Reporting Manager"
              showArrow
              showSearch
              disabled={isDisabled}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {reportingManagerList.map((item) => (
                <Option key={item._id}>
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
