import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import UserInfo from './components/UserInfo';

export default class Dashboard extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <UserInfo />
        </div>
      </PageContainer>
    );
  }
}
