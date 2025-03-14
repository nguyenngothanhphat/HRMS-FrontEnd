import { Table } from 'antd';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import EmptyComponent from '@/components/Empty';
import { employeeColor } from '@/constants/timeSheet';
import EmployeeDetailModal from '../../../EmployeeDetailModal';
import styles from './index.less';
// import UserPopover from './components/UserPopover';
import UserProfilePopover from '@/components/UserProfilePopover';

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

  const handleProfileEmployee = (userId) => {
    return `/directory/employee-profile/${userId}`;
  };
  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };
  const dataHover = (values) => {
    const {
      legalName = '',
      avatar: avatar1 = '',
      userId = '',
      workEmail = '',
      workNumber = '',
      skills = [],
      department = {},
      location = {},
      manager = {},
      title = {},
    } = values;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      location,
      manager,
      title,
      avatar1,
      skills,
    };
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Employee',
        dataIndex: 'user',
        key: 'user',
        fixed: 'left',

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
        sorter: (a, b) => {
          return a.legalName && b.legalName ? a.legalName.localeCompare(b.legalName) : false;
        },

        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (department = {}) => department.name,
        sorter: (a, b) => {
          return a.department.name && b.department.name
            ? a.department.name.localeCompare(b.department.name)
            : false;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Reporting Manager',
        dataIndex: 'manager',
        key: 'manager',
        render: (manager = {}) => (
          <UserProfilePopover data={dataHover(manager)} placement="bottomRight" trigger="hover">
            <Link className={styles.managerName} to={handleProfileEmployee(manager.userId)}>
              {manager?.employeeId ? manager.legalName : ''}
            </Link>
          </UserProfilePopover>
        ),
        sorter: (a, b) => {
          return a.manager?.legalName && b.manager?.legalName
            ? a.manager.legalName.localeCompare(b.manager.legalName)
            : false;
        },
        sortDirections: ['ascend', 'descend'],
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
        sorter: (a, b) => {
          return a.projects.length > 0 && b.projects.length > 0
            ? a.projects[0].localeCompare(b.projects[0])
            : false;
        },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: 'Working Days',
        dataIndex: 'userSpentInDay',
        key: 'workingDays',
        render: (workingDays, row) => {
          const { totalWorkingDay = 0, userSpentInDay = 0, totalWorkingDayInHours = 0 } = row;
          // 4/5 (30 hours)
          return `${userSpentInDay}/${totalWorkingDay} (${totalWorkingDayInHours} hours)`;
        },
        sorter: (a, b) => {
          return a.userSpentInDay && b.userSpentInDay ? a.userSpentInDay - b.userSpentInDay : false;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Timeoff (In Days)',
        dataIndex: 'leaveTaken',
        key: 'leaveTaken',
        align: 'center',
        render: (leaveTaken) => {
          return leaveTaken;
        },
        sorter: (a, b) => {
          return a.leaveTaken && b.leaveTaken ? a.leaveTaken - b.leaveTaken : false;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Total Hours',
        dataIndex: 'userSpentInHours',
        key: 'userSpentInHours',
        align: 'center',
        render: (userSpentInHours) => `${userSpentInHours} hours`,
        sorter: (a, b) => {
          return a.userSpentInHours && b.userSpentInHours
            ? a.userSpentInHours - b.userSpentInHours
            : false;
        },
        sortDirections: ['ascend', 'descend'],
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

export default connect(({ location: { companyLocationList = [] } }) => ({
  companyLocationList,
}))(WeeklyTable);
