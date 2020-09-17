import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
import PersonalInformation from './components/PersonalInformation';
import PassportVisaInformation from './components/PassportandVisaInformation';
import EmergencyContact from './components/EmergencyContactDetails';
import styles from './index.less';

@connect(({ loading, employeeProfile }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  employeeProfile,
}))
class GeneralInfo extends PureComponent {
  componentDidMount() {
    // const compensationData = { a: '1' };
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'employeeProfile/saveTemp',
    //   payload: { compensationData },
    // });
  }

  render() {
    const {
      loadingGeneral = false,
      employeeProfile: { tempData: { generalData = {} } = {} },
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
        <ProfessionalAcademicBackground />
      </div>
    );
  }
}

export default GeneralInfo;
