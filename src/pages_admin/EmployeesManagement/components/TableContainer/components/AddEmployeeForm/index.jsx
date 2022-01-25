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
    employee: { employeetype = [] },
    user: { companiesOfUser = [], currentUser: { manageLocation = [] } = {} } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    rolesList,
    companyList,
    locationList,
    departmentList,
    jobTitleList,
    employeetype,
    reportingManagerList,
    statusAddEmployee,
    companiesOfUser,
    manageLocation, // locations of admin
    listLocationsByCompany,
    loadingCompanyList: loading.effects['employeesManagement/fetchCompanyList'],
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
      isDisabledTitle: true,
      // tenantCurrentEmployee: '',
    };
  }

  static getDerivedStateFromProps(props) {
    if ('statusAddEmployee' in props && props.statusAddEmployee) {
      if (!props.company) {
        return {
          isDisabledTitle: true,
          isDisabled: true,
        };
      }
      return { isDisabledTitle: true };
    }
    return null;
  }

  // componentDidMount() {
  //   const { company, visible = false } = this.props;
  //   if (company) {
  //     this.setState({
  //       isDisabled: false,
  //     });
  //     this.fetchData(company);
  //   }
  // }

  componentDidUpdate(prevProps) {
    const { dispatch, statusAddEmployee = false, company, visible = false } = this.props;
    if (statusAddEmployee) {
      this.formRef.current.resetFields();
      dispatch({
        type: 'employeesManagement/save',
        payload: {
          statusAddEmployee: false,
        },
      });
    }
    if (prevProps.visible !== visible && visible && company) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isDisabled: false,
      });
      this.fetchData(company);
    }
  }

  fetchData = (_id) => {
    const { dispatch, companiesOfUser = [], listLocationsByCompany = [] } = this.props;

    const companyMatch = companiesOfUser.find((item) => item._id === _id);
    const tenantLocation = companyMatch.tenant;

    // this.setState({
    //   tenantCurrentEmployee: companyMatch.tenant,
    // });

    const locationPayload = listLocationsByCompany.map(
      ({ headQuarterAddress: { country: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listLocationsByCompany.forEach(
          ({ headQuarterAddress: { country: countryItem2 = '', state: stateItem2 = '' } = {} }) => {
            if (countryItem1 === countryItem2) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      },
    );

    dispatch({
      type: 'employeesManagement/fetchRolesList',
      payload: {
        tenantId: tenantLocation,
        company: _id,
      },
    });

    dispatch({
      type: 'employeesManagement/fetchReportingManagerList',
      payload: {
        company: [companyMatch],
        location: locationPayload,
        status: ['ACTIVE'],
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
        this.setState({
          isDisabled: false,
          // company: value,
        });
        this.formRef.current.setFieldsValue({
          location: undefined,
          title: undefined,
          manager: undefined,
        });
        break;
      case 'department':
        this.setState(
          {
            isDisabledTitle: false,
          },
          this.formRef.current.setFieldsValue({
            title: undefined,
          }),
        );
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
    let isDisabled = true;
    let payload = {
      listCompany: [],
      departmentList: [],
      locationList: [],
      jobTitleList: [],
      reportingManagerList: [],
      statusAddEmployee: false,
    };
    if (company) {
      isDisabled = true;
      payload = {
        listCompany: [],
        statusAddEmployee: false,
      };
    }
    dispatch({
      type: 'employeesManagement/save',
      payload,
    });
    this.setState(
      {
        isDisabled,
        isDisabledTitle: true,
      },
      () => handleCancel(),
    );
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
    }).then(() => {
      this.setState({ isDisabled: true });
      handleCancel();
      handleRefresh();
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
      employeetype,
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

    const { isDisabled, isDisabledTitle } = this.state;

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
            name="employeeType"
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
              disabled={isDisabled || loadingLocation}
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
              disabled={isDisabled || loadingDepartment}
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
              disabled={isDisabledTitle || loadingTitle}
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
            <Select
              autoComplete="dontshow"
              allowClear
              placeholder={formatMessage({ id: 'addEmployee.placeholder.manager' })}
              showArrow
              showSearch
              disabled={isDisabled || loadingManager}
              loading={loadingManager}
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {reportingManagerList.map((item) => (
                <Option key={item?._id}>
                  {`${item?.generalInfo?.firstName} ${item?.generalInfo?.lastName}`}
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

export default AddEmployeeForm;
