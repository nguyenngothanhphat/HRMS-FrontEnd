import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';

export default class EmployeeProfile extends Component {
  render() {
    const {
      dispatch,
      match: { params: { reId = '' } = {} },
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>Employee Profile {reId}</div>
      </PageContainer>
    );
  }
}
