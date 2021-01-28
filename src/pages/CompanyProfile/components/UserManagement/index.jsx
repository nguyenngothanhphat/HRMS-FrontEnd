import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import AddAdminForm from './components/AddAdminForm';
import TableAdministrator from './components/TableAdministrator';
import s from './index.less';

@connect(
  ({ user: { currentUser = {} } = {}, employee: { listAdministrator = [] } = {}, loading }) => ({
    currentUser,
    listAdministrator,
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
    // dispatch({
    //   type: 'employee/fetchListEmployeeActive',
    //   payload: {
    //     company: id,
    //   },
    // });
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
    const { listAdministrator = [], loadingFetchListAdmin } = this.props;
    return (
      <>
        <div className={s.root}>
          <div className={s.content}>
            <div className={s.content__viewTop}>
              <p className={s.content__viewTop__title}>List of company administrators</p>
              <div className={s.content__viewTop__add} onClick={this.handleOpenModalAddEmployee}>
                <img src="/assets/images/addMemberIcon.svg" alt="add" />
                <span>Add administrator</span>
              </div>
            </div>
            <TableAdministrator
              loading={loadingFetchListAdmin}
              data={listAdministrator}
              handleEdit={this.handleEdit}
            />
          </div>
        </div>
        <AddAdminForm
          titleModal={userSelected?._id ? 'Edit administrators' : 'Add administrators'}
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
