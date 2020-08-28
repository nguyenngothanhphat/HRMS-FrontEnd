import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';

export default class EmployeeProfile extends Component {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>Employee Profile</div>
      </PageContainer>
    );
  }
}
