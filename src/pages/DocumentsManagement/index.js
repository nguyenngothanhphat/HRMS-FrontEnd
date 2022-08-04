import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage } from 'umi';
import styles from './index.less';
import TableContainer from './components/TableContainer';

export default class DocumentsManagement extends PureComponent {
  operations = () => {
    return <div />;
  };

  render() {
    return (
      <PageContainer>
        <div className={styles.containerDocuments}>
          <div className={styles.headerText}>
            <span>{formatMessage({ id: 'pages_admin.documents.title' })}</span>
          </div>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}
