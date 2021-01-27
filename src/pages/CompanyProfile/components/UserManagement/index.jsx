import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import TableAdministrators from './components/TableAdministrators';
import AddEmployeeForm from './components/AddEmployeeForm';
import TableListActive from './components/TableListActive';
import s from './index.less';

@connect(
  ({ user: { currentUser = {} } = {}, employee: { listEmployeeActive = [] } = {}, loading }) => ({
    currentUser,
    listEmployeeActive,
    loading: loading.effects['employee/fetchListEmployeeActive'],
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
    const payload = {
      ...values,
      joinDate: moment(values.joinDate).format('YYYY-MM-DD'),
    };
    console.log('payload', payload);
    this.handleCancel();
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
      manager: { generalInfo: { _id: manager } = {} } = {},
    } = values;
    const user = {
      _id,
      employeeId,
      firstName,
      personalEmail,
      workEmail,
      department,
      location,
      joinDate: moment(joinDate),
      manager,
    };
    return user;
  };

  render() {
    const { visible, userSelected } = this.state;
    const { listEmployeeActive = [] } = this.props;
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
            <TableAdministrators />
            <div className={s.content__viewTop} style={{ marginTop: '50px' }}>
              <p className={s.content__viewTop__title}>List of company employees</p>
              {/* <div className={s.content__viewTop__add} onClick={this.handleOpenModalAddEmployee}>
                <img src="/assets/images/addMemberIcon.svg" alt="add" />
                <span>Add Administrators</span>
              </div> */}
            </div>
            <TableListActive data={listEmployeeActive} handleEdit={this.handleEdit} />
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
