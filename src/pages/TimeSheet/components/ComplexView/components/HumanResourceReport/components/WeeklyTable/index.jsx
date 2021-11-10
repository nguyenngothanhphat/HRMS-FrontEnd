import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { employeeColor } from '@/utils/timeSheet';
import styles from './index.less';

const WeeklyTable = (props) => {
  const { data = [], limit = 10, selectedEmployees = [], setSelectedEmployees = () => {} } = props;
  const [pageSelected, , setPageSelected] = useState(1);

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Employee',
        dataIndex: 'user',
        key: 'user',
        render: (user, _, index) => (
          <div className={styles.renderEmployee}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar || MockAvatar} alt="" />
              ) : (
                <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                  <span>{user.name ? user.name.toString()?.charAt(0) : 'P'}</span>
                </div>
              )}
            </div>
            <div className={styles.right}>
              <span className={styles.name}>{user.name}</span>
              <span className={styles.id}>{user.employeeId}</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
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
      },
      {
        title: 'Leaves Taken',
        dataIndex: 'leavesTaken',
        key: 'leavesTaken',
      },
      {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
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
        // pagination={pagination}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
