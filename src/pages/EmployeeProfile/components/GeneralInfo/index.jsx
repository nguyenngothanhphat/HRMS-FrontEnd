import React, { Component } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
import PersonalInformation from './components/PersonalInformation';
import PassportVisaInformation from './components/PassportandVisaInformation';
import EmergencyContact from './components/EmergencyContactDetails';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
}))
class GeneralInfo extends Component {
  render() {
    const { loadingGeneral = false, permissions = {}, profileOwner = false } = this.props;
    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation />
        <PersonalInformation />
        {(permissions.viewPassportAndVisa !== -1 || profileOwner) && <PassportVisaInformation />}
        <EmergencyContact permissions={permissions} profileOwner={profileOwner} />
        <ProfessionalAcademicBackground permissions={permissions} profileOwner={profileOwner} />
      </div>
    );
  }
}

export default GeneralInfo;
