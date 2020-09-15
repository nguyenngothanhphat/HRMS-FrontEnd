import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import PersonalInformation from './components/PersonalInformation';
import PassportVisaInformation from './components/PassportandVisaInformation';
import EmergencyContact from './components/EmergencyContactDetails';
import styles from './index.less';

@connect(({ loading, employeeProfile }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  employeeProfile,
}))
class GeneralInfo extends PureComponent {
  render() {
    const {
      loadingGeneral = false,
      employeeProfile: { generalData = {} },
    } = this.props;

    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation dataAPI={generalData} />
        <PersonalInformation dataAPI={generalData} />
        <PassportVisaInformation dataAPI={generalData} />
        <EmergencyContact dataAPI={generalData} />
      </div>
    );
  }
}

export default GeneralInfo;
