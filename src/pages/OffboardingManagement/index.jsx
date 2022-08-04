import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TableContainer from './components/TableContainer';

export default class OffboardingManagement extends PureComponent {
  operations = () => {
    return <div />;
  };

  render() {
    return (
      <PageContainer>
        <div className={styles.containerOffBoarding}>
          <div className={styles.headerText}>
            <span>Offboarding Management</span>
          </div>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}
