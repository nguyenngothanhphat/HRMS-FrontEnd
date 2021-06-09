import React, { PureComponent } from 'react';
import { Affix } from 'antd';
import { formatMessage } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TableContainer from './components/TableContainer';
import styles from './index.less';

class EmployeesManagement extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.employeesManagement}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage_text}>
                {formatMessage({ id: 'pages_admin.employees.title' })}
              </p>
            </div>
          </Affix>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}

export default EmployeesManagement;
