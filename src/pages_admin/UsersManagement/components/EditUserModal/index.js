import React, { PureComponent } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select, notification, Skeleton } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM.DD.YY';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@connect(
  ({
    usersManagement,
    usersManagement: {
      filterList = {},
      roles = [],
      employeeDetail = {},
      selectedUserId = '',
      selectedUserTenant = '',
    } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    usersManagement,
    filterList,
    roles,
    employeeDetail,
    selectedUserId,
    selectedUserTenant,
    loadingUpdateEmployee: loading.effects['usersManagement/updateEmployee'],
    loadingUpdateGeneralInfo: loading.effects['usersManagement/updateGeneralInfo'],
    loadingUpdateRoles: loading.effects['usersManagement/updateRolesByEmployee'],
    loadingUserProfile: loading.effects['usersManagement/fetchEmployeeDetail'],
    listLocationsByCompany,
  }),
)
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

  getEmployeeDetails = async () => {
    const { dispatch, selectedUserId = '', selectedUserTenant = '' } = this.props;

    if (selectedUserId && selectedUserTenant) {
      await dispatch({
        type: 'usersManagement/fetchEmployeeDetail',
        payload: {
          id: selectedUserId,
          tenantId: selectedUserTenant,
        },
      }).then((res) => {
        const { statusCode, data: employeeDetail = {} } = res;
        if (statusCode === 200) {
          const {
            location: { _id: locationId = '' } = {},
            company: { _id: companyId = '' } = {},
            // _id = '',
            // tenant = '',
          } = employeeDetail;

          // dispatch({
          //   type: 'usersManagement/getRolesByEmployee',
          //   payload: {
          //     employee: _id,
          //     tenantId: tenant,
          //   },
          // }).then((res1) => {
          //   const { statusCode: statusCode1, data: data1 = [] } = res1;
          //   if (statusCode1 === 200) {
          //     // this.formRef.current.setFieldsValue({
          //     //   roles: this.getRoleOfEmployee(data1),
          //     // });
          //     this.setState({
          //       roles: this.getRoleOfEmployee(data1),
          //     });
          //   }
          // });
          this.setState({
            locationId,
            companyId,
          });
        }
      });
    }
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchCountryList',
    });
  };

  componentDidUpdate = (prevProps) => {
    const { selectedUserId = '', editModalVisible } = this.props;
    if (prevProps.selectedUserId !== selectedUserId && editModalVisible) {
      this.getEmployeeDetails();
    }
  };

  onFinish = (values) => {
    const { dispatch, employeeDetail = {} } = this.props;
    const { _id = '', tenant = '', generalInfo: { _id: generalInfoId = '' } = {} } = employeeDetail;
    const { companyId, locationId } = this.state;
    const { workEmail = '', firstName = '', lastName = '', roles = [], status = '' } = values;

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
        closeEditModal(true);
      }
    });
  };

  onFinishFailed = (errorInfo) => {};

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
      roles = [],
      // location = [],
      filterList: { listCompany: company = [] } = {},
      editModalVisible = () => {},
      closeEditModal = () => {},
      employeeDetail = {},
      loadingUpdateEmployee = false,
      loadingUpdateGeneralInfo = false,
      loadingUpdateRoles = false,
      listLocationsByCompany = [],
      loadingUserProfile = false,
    } = this.props;

    const { companyId } = this.state;
    const listLocationByCurrentCompany = listLocationsByCompany.filter((location) => {
      return location.company?._id === companyId || location.company === companyId;
    });

    const roleList = roles.map((role) => role.idSync);
    const {
      joinDate = '',
      location: { _id: locationName = '' } = {},
      company: { _id: companyName = '' } = {},
      generalInfo: { workEmail = '', firstName = '', lastName = '' } = {},
      employeeId = '',
      status = '',
      managePermission: { roles: employeeRoles = [] } = {},
    } = employeeDetail;

    return (
      <>
        <Modal
          className={styles.modalEdit}
          onCancel={closeEditModal}
          destroyOnClose
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
          {loadingUserProfile ? (
            <Skeleton />
          ) : (
            <>
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
                  roles: employeeRoles,
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
                  label="Company"
                  labelAlign="left"
                  name="companyName"
                  rules={[{ required: false, message: 'Please select company!' }]}
                >
                  <Select
                    disabled
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
                    {listLocationByCurrentCompany.map((item) => {
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
        </Modal>
      </>
    );
  }
}

export default EditUserModal;
