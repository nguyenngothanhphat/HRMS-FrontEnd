import { DatePicker, Form, Input, notification, Select, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM.DD.YY';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EditUserModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    roleList: roleListProp = [],
    // location = [],
    filterList: { listCompany: company = [] } = {},
    visible = false,
    dispatch,
    onClose = () => {},
    employeeDetail = {},
    companyLocationList = [],
    loadingUserProfile = false,
    selectedUserId = '',
    selectedUserTenant = '',
    setOpenTerminateModal = () => {},
  } = props;

  const {
    joinDate = '',
    location: { _id: locationName = '' } = {},
    company: { _id: companyName = '' } = {},
    generalInfo: {
      workEmail = '',
      firstName = '',
      lastName = '',
      middleName = '',
      legalName = '',
    } = {},
    employeeId = '',
    status = '',
    managePermission: { roles: employeeRoles = [] } = {},
  } = employeeDetail;

  const [companyId, setCompanyId] = useState('');
  const [locationId, setLocationId] = useState('');

  const getEmployeeDetails = async () => {
    if (selectedUserId) {
      await dispatch({
        type: 'usersManagement/fetchEmployeeDetail',
        payload: {
          id: selectedUserId,
          tenantId: selectedUserTenant,
        },
      }).then((res) => {
        const { statusCode, data = {} } = res;
        if (statusCode === 200) {
          setLocationId(data?.location?._id);
          setCompanyId(data?.company?._id);
        }
      });
    }
  };

  useEffect(() => {
    dispatch({
      type: 'usersManagement/fetchCountryList',
    });
  }, []);

  useEffect(() => {
    if (visible) {
      getEmployeeDetails();
    }
  }, [selectedUserId]);

  useEffect(() => {
    form.setFieldsValue({
      remember: true,
      employeeId,
      joinDate: moment(joinDate),
      workEmail,
      legalName,
      firstName,
      lastName,
      middleName,
      locationName,
      companyName,
      status,
      roles: employeeRoles,
    });
  }, [JSON.stringify(employeeDetail)]);

  const onFinish = (values) => {
    const { _id = '', tenant = '', generalInfo: { _id: generalInfoId = '' } = {} } = employeeDetail;

    // Updating details in the admin portal should update the associated fields also
    // The above 3 points should work for both the active users and inactive users portal
    dispatch({
      type: 'usersManagement/updateRolesByEmployee',
      payload: {
        employee: _id,
        roles: values.roles,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateGeneralInfo',
      payload: {
        id: generalInfoId,
        legalName: values.legalName,
        workEmail: values.workEmail,
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateEmployee',
      payload: {
        id: _id,
        location: locationId,
        company: companyId,
        status: values.status,
        tenantId: tenant,
      },
    }).then((statusCode) => {
      if (statusCode === 200) {
        notification.success({
          message: 'Update user successfully',
        });
        if (values.status === 'ACTIVE') {
          onClose();
        }
        if (values.status === 'INACTIVE') {
          onClose(false);
          setOpenTerminateModal(true);
        }
      }
    });
  };

  return (
    <div className={styles.EditUserModalContent}>
      {loadingUserProfile ? (
        <Skeleton />
      ) : (
        <>
          <Form
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...layout}
            name="basic"
            form={form}
            id="myForm"
            onFinish={onFinish}
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
              rules={[
                {
                  required: true,
                  message: 'Please input the work email!',
                },
                {
                  required: false,
                  type: 'email',
                  message: 'Enter a valid email address!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Legal Name"
              labelAlign="left"
              name="legalName"
              rules={[{ required: false, message: 'Please input the legal name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="First Name"
              labelAlign="left"
              name="firstName"
              rules={[{ required: false, message: 'Please input the first name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Middle Name"
              labelAlign="left"
              name="middleName"
              rules={[{ required: false, message: 'Please input the middle name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              labelAlign="left"
              name="lastName"
              rules={[{ required: false, message: 'Please input the last name!' }]}
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
                {roleListProp.map((role) => {
                  return (
                    <Option key={role.idSync} value={role.idSync}>
                      {role.idSync}
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
                disabled
                onChange={(_, key) => {
                  const { value = '' } = key;
                  setCompanyId(value);
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
              label="Location"
              labelAlign="left"
              name="locationName"
              rules={[{ required: false, message: 'Please select location!' }]}
            >
              <Select
                onChange={(key) => {
                  setLocationId(key);
                }}
              >
                {companyLocationList
                  .filter((location) => {
                    return location.company?._id === companyId || location.company === companyId;
                  })
                  .map((item) => {
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
        </>
      )}
    </div>
  );
};

export default connect(
  ({
    usersManagement,
    usersManagement: {
      filterList = {},
      roleList = [],
      employeeDetail = {},
      selectedUserId = '',
      selectedUserTenant = '',
    } = {},
    loading,
    location: { companyLocationList = [] } = {},
  }) => ({
    usersManagement,
    filterList,
    roleList,
    employeeDetail,
    selectedUserId,
    selectedUserTenant,
    loadingUserProfile: loading.effects['usersManagement/fetchEmployeeDetail'],
    companyLocationList,
  }),
)(EditUserModalContent);
