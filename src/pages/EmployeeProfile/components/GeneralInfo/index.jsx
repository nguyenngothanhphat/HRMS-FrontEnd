import React, { Component } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
import PersonalInformation from './components/PersonalInformation';
import PassportDetails from './components/PassportDetails';
import VisaDetails from './components/VisaDetails';
import EmergencyContact from './components/EmergencyContactDetails';
import styles from './index.less';

@connect(({ loading, user: { currentUser = [] } }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  currentUser,
}))
class GeneralInfo extends Component {
  render() {
    const {
      loadingGeneral = false,
      permissions = {},
      profileOwner = false,
      idUser = '',
      currentUser: {
        employee: { _id: idEmployee = '' },
      },
    } = this.props;

    const authority = localStorage.getItem('antd-pro-authority');
    const checkVisible =
      (idUser === idEmployee && authority.includes('employee')) ||
      authority.includes('hr-manager') ||
      authority.includes('admin') ||
      authority.includes('owner') ||
      authority.includes('manager');

    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation
          permissions={permissions}
          profileOwner={profileOwner}
          idUser={idUser}
        />
        <PersonalInformation
          permissions={permissions}
          profileOwner={profileOwner}
          idUser={idUser}
        />
        {(permissions.viewPassportAndVisa !== -1 || profileOwner) && (
          <>
            <PassportDetails />
            <VisaDetails />
          </>
        )}
        {checkVisible ? (
          <EmergencyContact permissions={permissions} profileOwner={profileOwner} />
        ) : (
          ''
        )}
        {checkVisible ? (
          <ProfessionalAcademicBackground permissions={permissions} profileOwner={profileOwner} />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default GeneralInfo;
