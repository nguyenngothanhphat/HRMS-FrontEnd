import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { employeeColor } from '@/utils/timeSheet';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    data = [],
    limit = 10,
    selectedEmployees = [],
    setSelectedEmployees = () => {},
    loadingFetch = false,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Employee',
        dataIndex: 'user',
        key: 'user',
        render: (user, row, index) => {
          const { avatar = '', legalName = '', userId = '' } = row;

          return (
            <div className={styles.renderEmployee}>
              <div className={styles.avatar}>
                {avatar ? (
                  <img src={avatar || MockAvatar} alt="" />
                ) : (
                  <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                    <span>{legalName ? legalName.toString()?.charAt(0) : 'P'}</span>
                  </div>
                )}
              </div>
              <div className={styles.right}>
                <span className={styles.name}>{legalName}</span>
                <span className={styles.id}>{userId}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (department = {}) => department.name,
      },
      {
        title: 'Projects',
        dataIndex: 'project',
        key: 'project',
      },
      {
        title: 'Working Days',
        dataIndex: 'workingDays',
        key: 'workingDays',
        render: (workingDays, row) => {
          const { totalWorkingDay = 0, userSpentInDay = 0, totalWorkingDayInHours = 0 } = row;
          // 4/5 (30 hours)
          return `${userSpentInDay}/${totalWorkingDay} (${totalWorkingDayInHours} hours)`;
        },
      },
      {
        title: 'Leaves Taken',
        dataIndex: 'leaveTaken',
        key: 'leaveTaken',
        render: (leaveTaken, row) => {
          const { totalLeave = 0 } = row;
          return `${leaveTaken}/${totalLeave}`;
        },
      },
      {
        title: 'Total Hours',
        dataIndex: 'userSpentInHours',
        key: 'userSpentInHours',
        render: (userSpentInHours) => `${userSpentInHours} hours`,
      },
    ];
    return columns;
  };

  const onSelectChange = (values) => {
    setSelectedEmployees(values);
  };

  const rowSelection = {
    selectedRowKeys: selectedEmployees,
    onChange: onSelectChange,
  };

  const onChangePagination = (pageNumber) => {
    setPageSelected(pageNumber);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: data.length,
    showTotal: (total, range) => (
      <span>
        {' '}
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    pageSize: limit,
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <Table
        columns={generateColumns()}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={selectedEmployees.length > 0 ? { y: 400 } : {}}
        loading={loadingFetch}
        // pagination={pagination}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
