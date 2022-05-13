import { Table, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { isEmpty } from 'lodash';
import moment from 'moment';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { employeeColor } from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import EmployeeDetailModal from '../../../EmployeeDetailModal';
import styles from './index.less';
import PopoverInfoTimeSheet from './components/PopoverInfoTimeSheet';
import { isOwner } from '@/utils/authority';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';

const WeeklyTable = (props) => {
  // const [timezoneList, setTimezoneList] = useState([]);
  const timezoneList = [];
  const { companyLocationList = [] } = props;
  const [currentTime, setCurrentTime] = useState(moment());
  const fetchTimezone = () => {
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    // setTimezoneList({
    //   timezoneList,
    // });
  };
  useEffect(() => {
    fetchTimezone();
  });

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
  const handleProfileEmployee = (tenantId, userId) => {
    localStorage.setItem('tenantCurrentEmployee', tenantId);
    const pathname = isOwner()`/directory/employee-profile/${userId}`;
    return pathname;
  };
  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
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
          <Popover
            content={
              <PopoverInfoTimeSheet
                companyLocationList={companyLocationList}
                propsState={{ currentTime, timezoneList }}
                data={manager}
              />
            }
            placement="bottomRight"
            trigger="hover"
          >
            <Link
              className={styles.managerName}
              to={() => handleProfileEmployee(manager.tenantId, manager.userId)}
            >
              {manager?.employeeId ? manager.legalName : ''}
            </Link>
          </Popover>
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
          return a.projects && b.projects ? a.projects.localeCompare(b.legalName) : false;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Working Days',
        dataIndex: 'totalWorkingDayInHours',
        key: 'workingDays',
        render: (workingDays, row) => {
          const { totalWorkingDay = 0, userSpentInDay = 0, totalWorkingDayInHours = 0 } = row;
          // 4/5 (30 hours)
          return `${userSpentInDay}/${totalWorkingDay} (${totalWorkingDayInHours} hours)`;
        },
        sorter: (a, b) => {
          return a.totalWorkingDayInHours && b.totalWorkingDayInHours
            ? a.totalWorkingDayInHours - b.totalWorkingDayInHours
            : false;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Timeoff (In Days)',
        dataIndex: 'leaveTaken',
        key: 'leaveTaken',
        align: 'center',
        render: (leaveTaken, row) => {
          const { totalLeave = 0 } = row;
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
