import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix } from 'antd';
import styles from './index.less';
// import UserInfo from './components/UserInfo';

export default class Dashboard extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Dashboard</p>
            </div>
          </Affix>
        </div>
      </PageContainer>
    );
  }
}
