import React, { Component } from 'react';
import icon from '@/assets/add-adminstrator.svg';
import ViewAdministrator from './View';
import styles from './index.less';

class AdditionalAdministrator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      handleAddAdmin = () => {},
      handleEditAdmin = () => {},
      listAdministrator = [],
      permissionList = [],
    } = this.props;
    return (
      <div className={styles.additional}>
        <div className={styles.header}>
          <div className={styles.header__title}>Additional Administrators</div>
        </div>
        <div className={styles.listAdministrator}>
          {listAdministrator.length !== 0 && 
            <ViewAdministrator
              permissionList={permissionList}
              listAdministrator={listAdministrator}
              handleEditAdmin={handleEditAdmin}
            />}
          <div className={styles.addAdminBtn} onClick={() => handleAddAdmin(true)}>
            <img src={icon} alt="add-administrator" />
            <div className={styles.addBtn}>Add Administrator</div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalAdministrator;
