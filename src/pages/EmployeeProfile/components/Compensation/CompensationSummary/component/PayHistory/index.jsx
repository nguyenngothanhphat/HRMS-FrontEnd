import React from 'react';
import { Table } from 'antd';

import styles from './index.less';

const PayHistory = () => {
  const pageSize = {
    max: 50,
    min: 5,
  };

  const column = [
    {
      title: 'Change Type',
      dataIndex: 'chanegType',
      key: 'chanegType',
      align: 'left',
      width: '20%',
      render: (chanegType) => {
        return (
          <>
            <div className={styles.nameType}>{chanegType.name}</div>
            <span className={styles.salaryType}>Salary: đ</span>
            <span className={styles.salaryType}>{chanegType.salary}</span>
          </>
        );
      },
    },
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      align: 'left',
    },
    {
      title: 'Initiated Date',
      dataIndex: 'initiatedDate',
      key: 'initiatedDate',
      align: 'left',
    },
    {
      title: 'Changed by',
      dataIndex: 'changedBy',
      key: 'changedBy',
      align: 'left',
      render: (changedBy) => {
        return (
          <span style={{ color: 'blue', cursor: 'pointer', fontWeight: 500 }}>
            {changedBy.legalname}
          </span>
        );
      },
    },
    {
      title: 'Changed Reason',
      dataIndex: 'changedReason',
      key: 'changedReason',
      align: 'left',
      width: '25%',
    },
  ];
  const listPayHistory = [
    {
      chanegType: { name: 'Salary Revision', salary: 7500 },
      effectiveDate: '10th Dec 2019',
      initiatedDate: '10th Dec 2019',
      changedBy: { legalname: 'John Doe (johndoe)' },
      changedReason: 'Revised salary due to promotion10th Dec 2019',
    },
    {
      chanegType: { name: 'Annual Bonus', salary: 7500 },
      effectiveDate: '10th Dec 2019',
      initiatedDate: '10th Dec 2019',
      changedBy: { legalname: 'Aditya Venkatesh (adityavenkatesh)' },
      changedReason: 'Annual Bonus',
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: listPayHistory.length,
    showTotal: (total, range) => (
      <span>
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {listPayHistory.length}
      </span>
    ),
    pageSize: 10,
    // current: pageSelected,
    // onChange: this.onChangePagination,
  };
  return (
    <div className={styles.PayHistory}>
      <Table
        columns={column}
        dataSource={listPayHistory}
        pagination={
          listPayHistory.length > pageSize.max
            ? { ...pagination, total: listPayHistory.length }
            : false
        }
      />
    </div>
  );
};

export default PayHistory;
