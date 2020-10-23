/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select, Tooltip } from 'antd';
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
      reportingManagerList = [],
    },
  }) => ({
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    reportingManagerList,
    loading: loading.effects['employeesManagement/addEmployee'],
  }),
)
class AddEmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isDisabled: true,
      isDisabledManager: true,
      department: [],
      location: [],
    };
  }

  static getDerivedStateFromProps(props) {
    const { reportingManagerList } = props;
    if (reportingManagerList.length > 0) {
      return {
        isDisabledManager: false,
      };
    }
    return {
      isDisabledManager: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;
    const { department, location } = this.state;
    if (
      (prevState.department !== department || prevState.location !== location) &&
      department.length > 0 &&
      location.length > 0
    ) {
      dispatch({
        type: 'employeesManagement/fetchReportingManagerList',
        payload: {
          department,
          location,
        },
      });
    }
  }

  onChangeSelect = (type, value) => {
    const { dispatch } = this.props;
    const location = [];
    const department = [];
    switch (type) {
      case 'company':
        dispatch({
          type: 'employeesManagement/fetchLocationList',
          payload: {
            company: value,
          },
        });
        dispatch({
          type: 'employeesManagement/fetchDepartmentList',
          payload: {
            company: value,
          },
        });
        dispatch({
          type: 'employeesManagement/fetchJobTitleList',
          payload: {
            company: value,
          },
        });
        this.setState({
          isDisabled: false,
        });
        break;
      case 'location':
        location.push(value);
        this.setState({
          location,
        });
        break;
      case 'department':
        department.push(value);
        this.setState({
          department,
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
        location: [],
        department: [],
        isDisabled: true,
        isDisabledManager: true,
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
      companyList,
      locationList,
      departmentList,
      jobTitleList,
      reportingManagerList,
    } = this.props;
    const { isDisabled, isDisabledManager } = this.state;
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
          <Form.Item label="Company" name="company" rules={[{ required: true }]}>
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
              disabled={isDisabled}
              onChange={(value) => this.onChangeSelect('department', value)}
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
            name="reportingManager"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={isDisabledManager ? 'No Data' : 'Select Reporting Manager'}
              showArrow
              showSearch
              disabled={isDisabledManager}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {reportingManagerList.map((item) => (
                <Option key={item}>
                  {`${item.generalInfo.firstName} ${item.generalInfo.lastName}`}
                </Option>
              ))}
            </Select>
            <Tooltip
              placement="top"
              title="Reporting manager is got according to department and location."
              overlayClassName={styles.GenEITooltip}
              color="#568afa"
            >
              <span className={styles.reportingManager__tooltip}>?</span>
            </Tooltip>
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
