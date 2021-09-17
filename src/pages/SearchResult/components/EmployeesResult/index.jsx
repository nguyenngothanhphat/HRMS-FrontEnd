import React from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage } from 'umi';
import styles from '../../index.less';

const EmployeeResult = (props) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'legalName',
      key: 'name',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Position',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Phone No.',
      dataIndex: 'workNumber',
      key: 'workNumber',
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
  ];
  const dataSource = [
    {
      legalName: 'Nguyen Van A',
      userId: 'nva',
      employeeId: '123',
      department: 'Design',
      title: 'UI Design',
      workNumber: '1234567890',
      manager: 'Nguyen Van B',
    },
    {
      legalName: 'Nguyen Van A',
      userId: 'nva',
      employeeId: '123',
      department: 'Design',
      title: 'UI Design',
      workNumber: '1234567890',
      manager: 'Nguyen Van B',
    },
    {
      legalName: 'Nguyen Van A',
      userId: 'nva',
      employeeId: '123',
      department: 'Design',
      title: 'UI Design',
      workNumber: '1234567890',
      manager: 'Nguyen Van B',
    },
  ];
  const pagination = {
    position: ['bottomLeft'],
    total: 100,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: 10,
    current: 1,
    // onChange: (page, pageSize) => {
    //   getPageAndSize(page, pageSize);
    // },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" />
      </div>
      <div className={styles.result}>
        <Table columns={columns} dataSource={dataSource} size="middle" pagination={pagination} />
      </div>
    </div>
  );
};
export default EmployeeResult;
