import moment from 'moment';
import React from 'react';
import { Link } from 'umi';
import { TIMEOFF_NAME_BY_ID } from '@/utils/timeOffManagement';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const TableTimeOff = ({
  listTimeOff = [],
  loading = false,
  listTotal = 0,
  setPage = () => {},
  setLimit = () => {},
  limit = 10,
  page = 1,
}) => {
  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>
        <span className={styles.smallText}>(mm/dd/yyyy)</span>
      </span>
    );
  };

  const columns = [
    {
      title: 'No.',
      fixed: 'left',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Employee ID',
      fixed: 'left',
      dataIndex: 'employee',
      render: (employee = {}) => {
        return <span>{employee?.generalInfoInfo?.employeeId || ''}</span>;
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'employee',
      render: (employee = {}) => {
        return (
          <Link
            to={`/directory/employee-profile/${employee.generalInfoInfo?.userId}`}
            style={{
              fontWeight: 500,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {employee?.generalInfoInfo?.legalName}
          </Link>
        );
      },
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'approvalManager',
      render: (approvalManager = {}) => {
        return (
          <Link
            to={`/directory/employee-profile/${approvalManager.generalInfoInfo?.userId}`}
            style={{
              fontWeight: 500,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {approvalManager?.generalInfoInfo?.legalName}
          </Link>
        );
      },
    },
    {
      title: renderTimeTitle('Joining Date'),
      align: 'left',
      dataIndex: 'employee',
      render: (employee = {}) => {
        return (
          <span>{employee?.joinDate ? moment(employee?.joinDate).format('MM/DD/YYYY') : ''}</span>
        );
      },
    },
    {
      title: renderTimeTitle('From Date'),
      align: 'left',
      dataIndex: 'fromDate',
      render: (fromDate) => {
        return <span>{fromDate ? moment(fromDate).format('MM/DD/YYYY') : ''}</span>;
      },
    },
    {
      title: renderTimeTitle('To Date'),
      align: 'left',
      dataIndex: 'toDate',
      render: (toDate) => {
        return <span>{toDate ? moment(toDate).format('MM/DD/YYYY') : ''}</span>;
      },
    },
    {
      title: 'Count (in days)',
      dataIndex: 'duration',
      width: '10%',
      align: 'left',
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      render: (type = {}) => {
        return <span>{type?.name}</span>;
      },
    },
    {
      title: 'Status',
      fixed: 'right',
      dataIndex: 'status',
      render: (status) => TIMEOFF_NAME_BY_ID.find((x) => x.value === status)?.label || '',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      fixed: 'right',
      align: 'left',
      render: (_id) => (
        <div className={styles.documentAction}>
          <Link
            to={`/time-off/overview/manager-timeoff/view/${_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Request
          </Link>
        </div>
      ),
    },
  ];

  // pagination
  const onChangePagination = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setLimit(pageSize);
  };

  return (
    <div className={styles.TableTimeOff}>
      <CommonTable
        loading={loading}
        columns={columns}
        list={listTimeOff}
        rowKey="_id"
        total={listTotal}
        scrollable
        page={page}
        limit={limit}
        onChangePage={onChangePagination}
        isBackendPaging
        width="115%"
      />
    </div>
  );
};
export default TableTimeOff;
