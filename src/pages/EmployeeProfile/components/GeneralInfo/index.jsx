import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import EmployeeInformation from './components/EmployeeInformation';
import styles from './index.less';

class GeneralInfo extends PureComponent {
  render() {
    const { loading = false } = this.props;
    if (loading)
      return (
        <div className={styles.Loading}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation />
      </div>
    );
  }
}

export default GeneralInfo;
