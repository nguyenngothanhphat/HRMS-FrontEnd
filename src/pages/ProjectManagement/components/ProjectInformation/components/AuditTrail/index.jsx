import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CommonTable from '../CommonTable';
import styles from './index.less';

const AuditTrail = () => {
  const getColumns = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
      },
      {
        title: 'Uploaded By',
        dataIndex: 'uploadedBy',
        key: 'uploadedBy',
      },
    ];
    return columns;
  };

  return (
    <div className={styles.AuditTrail}>
      <Card title="Audit Trail">
        <div className={styles.tableContainer}>
          <CommonTable list={[]} columns={getColumns()} />
        </div>
      </Card>
    </div>
  );
};
export default connect(() => ({}))(AuditTrail);
