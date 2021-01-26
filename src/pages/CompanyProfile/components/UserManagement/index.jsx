import React, { PureComponent } from 'react';
import TableAdministrators from './components/TableAdministrators';
import AddEmployeeForm from './components/AddEmployeeForm';
import s from './index.less';

class UserManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: '',
    };
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOpenModalAddEmployee = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = (values) => {
    console.log('values', values);
    this.handleCancel();
  };

  render() {
    const { visible } = this.state;
    return (
      <>
        <div className={s.root}>
          <div className={s.content}>
            <div className={s.content__viewTop}>
              <p className={s.content__viewTop__title}>List of company administrators</p>
              <div className={s.content__viewTop__add} onClick={this.handleOpenModalAddEmployee}>
                <img src="/assets/images/addMemberIcon.svg" alt="add" />
                <span>Add Administrators</span>
              </div>
            </div>
            <TableAdministrators />
          </div>
        </div>
        <AddEmployeeForm
          titleModal="Add Administrators"
          visible={visible}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default UserManagement;
