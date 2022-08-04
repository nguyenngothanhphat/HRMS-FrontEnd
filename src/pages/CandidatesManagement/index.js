import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TableContainer from './components/TableContainer';

export default class CandidatesManagement extends PureComponent {
  operations = () => {
    return <div />;
  };

  render() {
    return (
      <PageContainer>
        <div className={styles.CandidatesManagement}>
          <div className={styles.headerText}>
            <span>Candidates Management</span>
          </div>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}
