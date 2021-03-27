import React, { Component } from 'react';
import icon from '@/assets/add-adminstrator.svg';
import ViewAdministrator from './View';
import styles from './index.less';

class AdditionalAdminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const listAdminstrator = [
      {
        listRole: [
          {
            id: 'payroll',
            role: 'Payroll',
          },
          {
            id: 'benefit',
            role: 'Benefit',
          },
        ],
        employeeName: 'Jenny',
        email: 'jenny@terralogic.com',
        position: 'Jenny’s permission apply to everyone in the company',
      },
      {
        listRole: [
          {
            id: 'company',
            role: 'Company',
          },
        ],
        employeeName: 'Renil Komitla',
        email: 'renil@terralogic.com',
        position: 'Renil’s permission apply to everyone in the company',
      },
    ];
    const { handleAddAdmin = () => {}, handleEditAdmin = () => {} } = this.props;
    return (
      <div className={styles.additional}>
        <div className={styles.header}>
          <div className={styles.header__title}>Additional Adminstrators</div>
          <div className={styles.header__action} onClick={() => handleAddAdmin(true)}>
            <img src={icon} alt="add-adminstrator" />
            <div className={styles.addBtn}>Add Adminstrator</div>
          </div>
        </div>
        <div className={styles.listAdminstrator}>
          <ViewAdministrator
            listAdminstrator={listAdminstrator}
            handleEditAdmin={handleEditAdmin}
          />
        </div>
      </div>
    );
  }
}

export default AdditionalAdminstrator;
