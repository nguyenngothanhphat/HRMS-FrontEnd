/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';
import DebounceSelect from '@/components/DebounceSelect';

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
    },
    employee: { employeetype = [] },
    user: { companiesOfUser = [], currentUser: { manageLocation = [] } = {} } = {},
    location: { companyLocationList = [] } = {},
  }) => ({
    rolesList,
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    employeetype,
    reportingManagerList,
    companiesOfUser,
    manageLocation, // locations of admin
    companyLocationList,
    loadingCompanyList: loading.effects['employeesManagement/fetchCompanyList'],
    loadingDepartment: loading.effects['employeesManagement/fetchDepartmentList'],
    loadingLocation: loading.effects['employeesManagement/fetchLocationList'],
    loadingTitle: loading.effects['employeesManagement/fetchJobTitleList'],
    loadingManager: loading.effects['employeesManagement/fetchReportingManagerList'],
    loading: loading.effects['employeesManagement/addEmployee'],
  }),
)
class AddEmployeeModal extends Component {
  formRef = React.createRef();

  componentDidUpdate(prevProps) {
    const { company, visible = false } = this.props;
    if (prevProps.visible !== visible && visible && company) {
      this.fetchData(company);
    }
  }

  fetchData = (_id) => {
    const { dispatch, companiesOfUser = [] } = this.props;

    const companyMatch = companiesOfUser.find((item) => item._id === _id);
    const tenantLocation = companyMatch.tenant;

    dispatch({
      type: 'employeesManagement/fetchRolesList',
      payload: {
        tenantId: tenantLocation,
        company: _id,
      },
    });
    dispatch({
      type: 'employeesManagement/fetchLocationList',
      payload: {
        tenantId: tenantLocation,
        company: _id,
      },
    });
    dispatch({
      type: 'employeesManagement/fetchDepartmentList',
      payload: {
        tenantId: tenantLocation,
        company: _id,
      },
    });
  };

  onChangeSelect = (type, value) => {
    const { dispatch } = this.props;
    // const { company, tenantCurrentEmployee } = this.state;

    switch (type) {
      case 'company':
        this.fetchData(value);
        this.formRef.current.setFieldsValue({
          location: undefined,
          title: undefined,
          manager: undefined,
        });
        break;
      case 'department':
        this.formRef.current.setFieldsValue({
          title: undefined,
        });

        dispatch({
          type: 'employeesManagement/fetchJobTitleList',
          payload: {
            department: value,
            tenantId: getCurrentTenant(),
          },
        });
        break;
      default:
        break;
    }
  };

  handleCancel = () => {
    const { handleCancel, dispatch, company } = this.props;

    let payload = {
      listCompany: [],
      departmentList: [],
      locationList: [],
      jobTitleList: [],
      reportingManagerList: [],
    };
    if (company) {
      payload = {
        listCompany: [],
      };
    }
    dispatch({
      type: 'employeesManagement/save',
      payload,
    });
    handleCancel();
  };

  handleChangeAddEmployee = () => {};

  handleSubmitEmployee = (values) => {
    const { dispatch, handleCancel = () => {}, handleRefresh = () => {} } = this.props;
    const payload = {
      ...values,
      tenantId: getCurrentTenant(),
      joinDate: moment(values.joinDate).format('MM.DD.YY'),
    };
    dispatch({
      type: 'employeesManagement/addEmployee',
      payload,
    }).then((res) => {
      if (res.statusCode === 200) {
        handleCancel();
        handleRefresh();
      }
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

  getUserCompanyList = (companyList) => {
    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();
    const childCompanyList = companyList.filter(
      (comp) => comp?.childOfCompany === currentCompany || comp?._id === currentCompany,
    );
    if (!currentLocation) {
      return childCompanyList;
    }
    return childCompanyList.filter((company) => company?._id === currentCompany);
  };

  onEmployeeSearch = (val) => {
    const { dispatch } = this.props;
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'employeesManagement/fetchEmployeeList',
      params: {
        search: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user._id,
      }));
    });
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
      employeetype,
      companyList,
      locationList,
      departmentList,
      jobTitleList,
      loadingDepartment,
      loadingLocation,
      loadingTitle,
      loadingManager,
      company,
    } = this.props;

    const formatCompanyList = this.getUserCompanyList(companyList);

    return (
      <div className={styles.addEmployee__form} id="addEmployee__form">
        <Form
          name="formAddEmployee"
          // requiredMark={false}
          colon={false}
          labelAlign="left"
          layout="horizontal"
          ref={this.formRef}
          validateMessages={validateMessages}
          id="addEmployeeForm"
          onValuesChange={this.handleChangeAddEmployee}
          onFinish={this.handleSubmitEmployee}
          initialValues={{
            company,
          }}
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
            <Input placeholder={formatMessage({ id: 'addEmployee.placeholder.employeeID' })} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.name' })}
            name="firstName"
            rules={[
              { required: true },
              {
                pattern:
                  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
                message: 'Name is not a validate name!',
              },
            ]}
          >
            <Input placeholder={formatMessage({ id: 'addEmployee.placeholder.name' })} />
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
            <Input placeholder={formatMessage({ id: 'addEmployee.placeholder.personalEmail' })} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.workEmail' })}
            name="workEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder={formatMessage({ id: 'addEmployee.placeholder.workEmail' })} />
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'addEmployee.employeeType' })}
            name="empTypeOther"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.employeeType' })}
              showArrow
              showSearch
              // disabled={isDisabledTitle || loadingTitle}
              loading={loadingTitle}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {['Regular', 'Contingent Worker'].map((x, index) => {
                return (
                  <Option key={`${index + 1}`} value={x}>
                    {x}
                  </Option>
                );
              })}
              ]
            </Select>
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'addEmployee.employmentType' })}
            name="employeeType"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.employmentType' })}
              showArrow
              showSearch
              // disabled={isDisabledTitle || loadingTitle}
              loading={loadingTitle}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employeetype.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'addEmployee.company' })}
            name="company"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.company' })}
              showArrow
              showSearch
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              onChange={(value) => this.onChangeSelect('company', value)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled={company}
            >
              {formatCompanyList.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            label={formatMessage({ id: 'addEmployee.roles' })}
            name="roles"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              mode="multiple"
              allowClear
              showArrow
              disabled={isDisabled}
              style={{ width: '100%' }}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              placeholder="Select Roles"
            >
              {rolesList.map((item) => (
                <Option key={item._id} value={item.idSync}>
                  {item.idSync}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

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
              disabled={loadingLocation}
              loading={loadingLocation}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locationList.map((item) => {
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
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.department' })}
              showArrow
              showSearch
              loading={loadingDepartment}
              disabled={loadingDepartment}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
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
          <Form.Item
            label={formatMessage({ id: 'addEmployee.jobTitle' })}
            name="title"
            rules={[{ required: true }]}
          >
            <Select
              autoComplete="dontshow"
              placeholder={formatMessage({ id: 'addEmployee.placeholder.jobTitle' })}
              showArrow
              showSearch
              disabled={loadingTitle}
              loading={loadingTitle}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
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
            // rules={[{ required: true }]}
          >
            <DebounceSelect
              autoComplete="dontshow"
              allowClear
              showArrow
              placeholder={formatMessage({ id: 'addEmployee.placeholder.manager' })}
              fetchOptions={this.onEmployeeSearch}
              showSearch
              disabled={loadingManager}
            />
          </Form.Item>
        </Form>
      </div>
    );
  };

  render() {
    const { visible = false, loading } = this.props;
    return (
      <Modal
        className={styles.AddEmployeeModal}
        visible={visible}
        title={this.renderHeaderModal()}
        onCancel={this.handleCancel}
        style={{ top: 50 }}
        destroyOnClose
        width={650}
        maskClosable={false}
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

export default AddEmployeeModal;
