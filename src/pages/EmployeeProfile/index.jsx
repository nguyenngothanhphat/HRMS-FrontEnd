import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';

class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // fetch employee by id
    // const {
    //   match: { params: { reId = '' } = {} },
    // } = this.props;
  }

  render() {
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile} />
      </PageContainer>
    );
  }
}

export default EmployeeProfile;
