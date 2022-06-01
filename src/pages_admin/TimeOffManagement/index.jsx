import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import TableContainer from './components/TableContainer';
import styles from './index.less';

export default class TimeOffManagement extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerTimeOff}>
          <div className={styles.headerText}>
            <span>Timeoff Management</span>
          </div>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}
