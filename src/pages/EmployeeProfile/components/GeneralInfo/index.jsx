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

@connect(({ loading, user: { currentUser = [], permissions = {} } }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  currentUser,
  permissions,
}))
class GeneralInfo extends Component {
  render() {
    const { loadingGeneral = false, permissions = {}, profileOwner = false } = this.props;

    const checkVisible = profileOwner || permissions.viewOtherInformation !== -1;

    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation permissions={permissions} />
        <PersonalInformation permissions={permissions} profileOwner={profileOwner} />
        {(permissions.viewPassportAndVisa !== -1 || profileOwner) && (
          <>
            <PassportDetails profileOwner={profileOwner} />
            <VisaDetails profileOwner={profileOwner} />
          </>
        )}
        {checkVisible ? <EmergencyContact permissions={permissions} /> : ''}
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
