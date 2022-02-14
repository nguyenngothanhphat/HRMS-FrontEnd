import React from 'react';
import { Table } from 'antd';

import styles from './index.less';

const PayHistory = () => {
  const column = [
    {
      title: 'Change Type',
      dataIndex: 'chanegType',
      key: 'chanegType',
    },
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
    },
    {
      title: 'Initiated Date',
      dataIndex: 'initiatedDate',
      key: 'initiatedDate',
    },
    {
      title: 'Changed by',
      dataIndex: 'changedBy',
      key: 'changedBy',
    },
    {
      title: 'Changed Reason',
      dataIndex: 'changedReason',
      key: 'changedReason',
    },
  ];
  const listPayHistory = [
    {
      chanegType: { name: 'Salary Revision', salary: 7500 },
      effectiveDate: '10th Dec 2019',
      initiatedDate: '10th Dec 2019',
      changedBy: 'John Doe (johndoe)',
      changedReason: 'Revised salary due to promotion10th Dec 2019',
    },
  ];
  return (
    <div className={styles.PayHistory}>
      <Table columns={column} dataSource={listPayHistory} />
    </div>
  );
};

export default PayHistory;
