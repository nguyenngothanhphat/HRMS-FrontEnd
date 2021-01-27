import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
// import TableAdministrators from './components/TableAdministrators';
import AddEmployeeForm from './components/AddEmployeeForm';
import TableListActive from './components/TableListActive';
import s from './index.less';

@connect(
  ({
    user: { currentUser = {} } = {},
    employee: { listEmployeeActive = [], listAdministrator = [] } = {},
    loading,
  }) => ({
    currentUser,
    listEmployeeActive,
    listAdministrator,
    loading: loading.effects['employee/fetchListEmployeeActive'],
    loadingFetchListAdmin: loading.effects['employee/fetchListAdministrator'],
  }),
)
class UserManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: '',
      userSelected: {},
    };
  }

  componentDidMount() {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: id,
      },
    });
    dispatch({
      type: 'employee/fetchListAdministrator',
      payload: {
        company: id,
      },
    });
    dispatch({
      type: 'adminSetting/getRolesByCompany',
      payload: {
        company: id,
      },
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      userSelected: {},
    });
  };

  handleOpenModalAddEmployee = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = (values) => {
    const { userSelected = {} } = this.state;
    const { dispatch } = this.props;
    const payload = {
      ...values,
      joinDate: moment(values.joinDate).format('YYYY-MM-DD'),
      id: userSelected?._id,
    };
    if (userSelected?._id) {
      dispatch({
        type: 'employee/updateEmployee',
        payload,
      }).then(({ statusCode }) => {
        this.handleResp(statusCode);
      });
    } else {
      dispatch({
        type: 'employee/addEmployee',
        payload,
      }).then(({ statusCode }) => {
        this.handleResp(statusCode);
      });
    }
  };

  handleResp = (statusCode) => {
    if (statusCode === 200) {
      this.handleCancel();
    }
  };

  handleEdit = (record = {}) => {
    const formatData = this.formatData(record);
    this.setState({
      visible: true,
      userSelected: formatData,
    });
  };

  formatData = (values) => {
    console.log('values', values);
    const {
      _id,
      employeeId,
      department: { _id: department } = {},
      generalInfo: { firstName, personalEmail, workEmail } = {},
      location: { _id: location } = {},
      joinDate,
      manager: { _id: manager } = {},
      user = [],
    } = values;
    const { roles = [] } = user[0] || {};
    const data = {
      _id,
      employeeId,
      firstName,
      personalEmail,
      workEmail,
      department,
      location,
      joinDate: moment(joinDate),
      manager,
      roles,
    };
    return data;
  };

  render() {
    const { visible, userSelected } = this.state;
    const {
      listEmployeeActive = [],
      listAdministrator = [],
      loading,
      loadingFetchListAdmin,
    } = this.props;
    return (
      <>
        <div className={s.root}>
          <div className={s.content}>
            <div className={s.content__viewTop}>
              <p className={s.content__viewTop__title}>List of company administrators</p>
              <div className={s.content__viewTop__add} onClick={this.handleOpenModalAddEmployee}>
                <img src="/assets/images/addMemberIcon.svg" alt="add" />
                <span>Add employee</span>
              </div>
            </div>
            <TableListActive
              loading={loadingFetchListAdmin}
              data={listAdministrator}
              handleEdit={this.handleEdit}
            />
            <div className={s.content__viewTop} style={{ marginTop: '50px' }}>
              <p className={s.content__viewTop__title}>List of company employees</p>
            </div>
            <TableListActive
              loading={loading}
              data={listEmployeeActive}
              handleEdit={this.handleEdit}
            />
          </div>
        </div>
        <AddEmployeeForm
          titleModal={userSelected?._id ? 'Edit' : 'Add Employee'}
          userSelected={userSelected}
          visible={visible}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default UserManagement;
