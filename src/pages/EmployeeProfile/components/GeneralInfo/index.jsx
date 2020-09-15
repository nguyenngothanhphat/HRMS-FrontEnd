import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
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

    console.log('Loading general info', loadingGeneral);

    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation dataAPI={generalData} />
        <ProfessionalAcademicBackground />
      </div>
    );
  }
}

export default GeneralInfo;
