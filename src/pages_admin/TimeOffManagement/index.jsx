import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TableContainer from './components/TableContainer';

export default class TimeOffManagement extends PureComponent {
  operations = () => {
    return <div />;
  };

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
