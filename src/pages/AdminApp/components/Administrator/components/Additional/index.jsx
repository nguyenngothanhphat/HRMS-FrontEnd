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
          <div className={styles.header__action} onClick={() => handleAddAdmin(true)}>
            <img src={icon} alt="add-administrator" />
            <div className={styles.addBtn}>Add Administrator</div>
          </div>
        </div>
        <div className={styles.listAdministrator}>
          {listAdministrator.length === 0 ? (
            <span>No data</span>
          ) : (
            <ViewAdministrator
              permissionList={permissionList}
              listAdministrator={listAdministrator}
              handleEditAdmin={handleEditAdmin}
            />
          )}
        </div>
      </div>
    );
  }
}

export default AdditionalAdministrator;
