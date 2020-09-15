import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import styles from './index.less';

@connect(({ loading, employeeProfile }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  employeeProfile,
}))
class GeneralInfo extends PureComponent {
  render() {
    const {
      loading = false,
      employeeProfile: { generalData = {} },
    } = this.props;

    if (loading)
      return (
        <div className={styles.Loading}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation dataAPI={generalData} />
      </div>
    );
  }
}

export default GeneralInfo;
