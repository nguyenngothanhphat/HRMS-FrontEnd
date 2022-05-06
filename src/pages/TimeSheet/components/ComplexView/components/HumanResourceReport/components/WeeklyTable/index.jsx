import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { employeeColor } from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import EmployeeDetailModal from '../../../EmployeeDetailModal';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    data = [],
    selectedEmployees = [],
    setSelectedEmployees = () => {},
    loadingFetch = false,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [handlingEmployee, setHandlingEmployee] = useState();
  const [employeeDetailModalVisible, setEmployeeDetailModalVisible] = useState(false);

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
          const { avatar = '', legalName = '', userId = '', id = '' } = row;

          return (
            <div
              className={styles.renderEmployee}
              onClick={() => {
                setHandlingEmployee(id);
                setEmployeeDetailModalVisible(true);
              }}
            >
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
        dataIndex: 'projects',
        key: 'projects',
        render: (projects = []) => {
          return projects.map((x, i) => {
            if (i + 1 !== projects.length) return `${x}, `;
            return x;
          });
        },
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
        align: 'center',
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

  const onChangePagination = (pageNumber, pageSizeTemp) => {
    setPageSelected(pageNumber);
    setPageSize(pageSizeTemp);
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
    defaultPageSize: pageSize,
    showSizeChanger: true,
    pageSize,
    pageSizeOptions: ['10', '25', '50', '100'],
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <Table
        columns={generateColumns()}
        dataSource={data}
        locale={{
          emptyText: <EmptyComponent />,
        }}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        // pagination={false}
        scroll={selectedEmployees.length > 0 ? { y: 600, x: 1100 } : { x: 1100 }}
        loading={loadingFetch}
        pagination={pagination}
      />
      <EmployeeDetailModal
        visible={employeeDetailModalVisible}
        onClose={() => setEmployeeDetailModalVisible(false)}
        employeeId={handlingEmployee}
        dataSource={data}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
