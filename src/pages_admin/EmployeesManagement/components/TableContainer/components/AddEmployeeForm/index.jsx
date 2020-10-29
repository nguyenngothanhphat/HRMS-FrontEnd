/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const { Option } = Select;

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
      statusAddEmployee,
    },
  }) => ({
    rolesList,
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    reportingManagerList,
    statusAddEmployee,
    loadingDepartment: loading.effects['employeesManagement/fetchDepartmentList'],
    loadingLocation: loading.effects['employeesManagement/fetchLocationList'],
    loadingTitle: loading.effects['employeesManagement/fetchJobTitleList'],
    loadingManager: loading.effects['employeesManagement/fetchReportingManagerList'],
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

  static getDerivedStateFromProps(props) {
    if ('statusAddEmployee' in props && props.statusAddEmployee) {
      if (props.company === '') {
        return {
          isDisabledDepartment: true,
          isDisabled: true,
        };
      }
      return { isDisabledDepartment: true };
    }
    return null;
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
    const { dispatch, statusAddEmployee = false } = this.props;
    if (location !== '' && location !== prevState.location) {
      this.formRef.current.setFieldsValue({
        department: undefined,
      });
    }
    if (statusAddEmployee === true) {
      this.formRef.current.resetFields();
      dispatch({
        type: 'employeesManagement/save',
        payload: {
          statusAddEmployee: false,
        },
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
    const { handleCancel, dispatch, company } = this.props;
    let isDisabled = true;
    let payload = {
      companyList: [],
      departmentList: [],
      locationList: [],
      jobTitleList: [],
      reportingManagerList: [],
      statusAddEmployee: false,
    };
    if (company !== '') {
      isDisabled = false;
      payload = {
        companyList: [],
        statusAddEmployee: false,
      };
    }
    dispatch({
      type: 'employeesManagement/save',
      payload,
    });
    this.setState(
      {
        location: '',
        company: '',
        isDisabled,
        isDisabledDepartment: true,
      },
      () => handleCancel(),
    );
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
      loadingLocation,
      loadingTitle,
      loadingManager,
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
            label={formatMessage({ id: 'addEmployee.name' })}
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
            label={formatMessage({ id: 'addEmployee.personalEmail' })}
            name="personalEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.workEmail' })}
            name="workEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
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
            >
              {rolesList.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {company ? (
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
          ) : (
            <Form.Item
              label={formatMessage({ id: 'addEmployee.company' })}
              name="company"
              rules={[{ required: true }]}
            >
              <Select
                placeholder={formatMessage({ id: 'addEmployee.placeholder.company' })}
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
            </Form.Item>
          )}
          <Form.Item
            label={formatMessage({ id: 'addEmployee.location' })}
            name="location"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.location' })}
              showArrow
              showSearch
              disabled={isDisabled || loadingLocation}
              loading={loadingLocation}
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
          <Form.Item
            label={formatMessage({ id: 'addEmployee.department' })}
            name="department"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.department' })}
              showArrow
              showSearch
              loading={loadingDepartment}
              disabled={isDisabledDepartment || loadingDepartment}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'addEmployee.jobTitle' })} name="title">
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.jobTitle' })}
              showArrow
              showSearch
              disabled={isDisabled || loadingTitle}
              loading={loadingTitle}
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
            label={formatMessage({ id: 'addEmployee.manager' })}
            name="manager"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.manager' })}
              showArrow
              showSearch
              disabled={isDisabled || loadingManager}
              loading={loadingManager}
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
            {formatMessage({ id: 'employee.button.cancel' })}
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            form="addEmployeeForm"
            loading={loading}
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
