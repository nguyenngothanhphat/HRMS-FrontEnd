import React, { PureComponent } from 'react';
import { Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import TimeOffPage from './components/TimeOffPage';
import styles from './index.less';

export default class TimeOff extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerTimeOff}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Time Off</p>
            </div>
          </Affix>
          <TimeOffPage />
        </div>
      </PageContainer>
    );
  }
}
