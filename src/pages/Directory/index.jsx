import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
import styles from './index.less';

export default class Directory extends Component {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Link to="/directory/employee-profile/0001">Link to profile employee 0001</Link>
        </div>
      </PageContainer>
    );
  }
}
