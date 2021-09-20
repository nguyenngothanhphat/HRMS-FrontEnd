import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage, connect, history } from 'umi';
import styles from '../../index.less';

const EmployeeResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    employeeAdvance,
    employeeList,
    totalEmployees,
    loadTableData2,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    if (isSearch) {
      if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'EMPLOYEE',
            page,
            limit,
          },
        });
      } else {
        dispatch({
          type: 'searchAdvance/searchEmployee',
          payload: { page, limit, ...employeeAdvance },
        });
      }
    }
  }, [isSearch, page, limit]);
  console.log('employeeList', employeeList);
  const clickFilter = () => {
    history.push('employees/advanced-search');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'generalInfo',
      key: 'name',
      render: (generalInfo) => {
        if (generalInfo) {
          const { legalName = '', firstName = '', middleName = '', lastName = '' } = generalInfo;
          const fullName = legalName || `${firstName}${` ${middleName}`}${` ${lastName}`}`;
          return <div className={styles.blueText}>{fullName}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'User ID',
      dataIndex: 'generalInfo',
      key: 'userId',
      render: (generalInfo) => {
        if (generalInfo) {
          const { userId } = generalInfo;
          return <div>{userId || '-'}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Employee ID',
      dataIndex: 'generalInfo',
      key: 'employeeId',
      render: (generalInfo) => {
        if (generalInfo) {
          const { employeeId } = generalInfo;
          return <div>{employeeId || '-'}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Department',
      dataIndex: 'departmentInfo',
      key: 'department',
      render: (departmentInfo, record) => {
        if (departmentInfo) {
          const { name } = departmentInfo;
          return <div>{name || '-'}</div>;
        }
        if (record.department) {
          const { name } = record.department;
          return <div>{name || '-'}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Position',
      dataIndex: 'titleInfo',
      key: 'title',
      render: (titleInfo, record) => {
        if (titleInfo) {
          const { name } = titleInfo;
          return <div>{name || '-'}</div>;
        }
        if (record.title) {
          const { name } = record.title;
          return <div>{name || '-'}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Phone No.',
      dataIndex: 'generalInfo',
      key: 'workNumber',
      render: (generalInfo) => {
        if (generalInfo) {
          const { workNumber } = generalInfo;
          return <div>{workNumber || '-'}</div>;
        }
        return '-';
      },
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager) => {
        if (manager) {
          const {
            generalInfo: { legalName, firstName = '', middleName = '', lastName = '' } = {},
          } = manager;
          const fullName = legalName || `${firstName} ${middleName} ${lastName}`;
          return <div className={styles.blueText}>{fullName}</div>;
        }
        return <div>-</div>;
      },
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: totalEmployees,
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
    pageSize: limit,
    current: page,
    onChange: (nextPage, pageSize) => {
      dispatch({
        type: 'searchAdvance/save',
        payload: { isSearch: true },
      });
      setPage(nextPage);
      setLimit(pageSize);
    },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" onClick={clickFilter} />
      </div>
      <div className={styles.result}>
        <Table
          columns={columns}
          dataSource={employeeList}
          size="middle"
          pagination={pagination}
          loading={loadTableData || loadTableData2}
        />
      </div>
    </div>
  );
});
export default connect(
  ({
    loading,
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      employeeAdvance,
      globalSearchAdvance: { employees: employeeList, totalEmployees },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchEmployee'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    employeeList,
    totalEmployees,
    employeeAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
  }),
)(EmployeeResult);
