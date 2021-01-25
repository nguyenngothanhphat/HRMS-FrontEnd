import React, { PureComponent } from 'react';
import TableAdministrators from './components/TableAdministrators';
import s from './index.less';

class UserManagement extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <div className={s.content__viewTop}>
            <p className={s.content__viewTop__title}>List of company administrators</p>
            <div className={s.content__viewTop__add}>
              <img src="/assets/images/addMemberIcon.svg" alt="add" />
              <span>Add Employee</span>
            </div>
          </div>
          <TableAdministrators />
        </div>
      </div>
    );
  }
}

export default UserManagement;
