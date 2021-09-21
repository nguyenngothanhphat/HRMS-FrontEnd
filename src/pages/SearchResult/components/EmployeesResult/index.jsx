/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table, Popover, Avatar } from 'antd';
import avtDefault from '@/assets/avtDefault.jpg';
import { formatMessage, connect, history, Link } from 'umi';
import { isOwner } from '@/utils/authority';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getTimezoneViaCity } from '@/utils/times';
import PopoverInfo from '@/components/DirectoryTable/components/ModalTerminate/PopoverInfo/index';
import styles from '../../index.less';

const EmployeeResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    isSearchAdvance,
    employeeAdvance,
    employeeList,
    totalEmployees,
    loadTableData2,
    tabName,
    permissions = {},
    listLocationsByCompany,
    profileOwner = false,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [timezoneList, setTimezoneList] = useState([]);
  const [currentTime] = useState(moment());

  const fetchTimezone = () => {
    const timezoneListTemp = [];
    listLocationsByCompany.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneListTemp.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    setTimezoneList(timezoneListTemp);
  };

  useEffect(() => {
    fetchTimezone();
  }, []);

  useEffect(() => {
    if (isSearch && tabName === 'employees') {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchEmployee',
          payload: { ...employeeAdvance },
        });
      } else if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'EMPLOYEE',
          },
        });
      }
    }
  }, [isSearch]);

  const clickFilter = () => {
    history.push('employees/advanced-search');
  };
  const getAvatarUrl = (avatar, isShowAvatar) => {
    if (isShowAvatar) return avatar || avtDefault;
    if (permissions.viewAvatarEmployee !== -1 || profileOwner) {
      if (avatar) return avatar;
      return avtDefault;
    }
    return avtDefault;
  };
  const handleProfileEmployee = (_id, tenant, userId) => {
    localStorage.setItem('tenantCurrentEmployee', tenant);
    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };

  const renderUser = (employeePack) => {
    const { _id = '', generalInfo = {}, tenant = '' } = employeePack;
    const { isShowAvatar = true, avatar = '' } = generalInfo;
    const avatarUrl = getAvatarUrl(avatar, isShowAvatar);

    const popupImg = () => {
      return (
        <div className={styles.popupImg}>
          <img src={avatarUrl} alt="avatar" />
        </div>
      );
    };

    return (
      <div className={styles.directoryTableName}>
        <Popover placement="rightTop" content={popupImg} trigger="hover">
          {avatarUrl ? (
            <Avatar size="medium" className={styles.avatar} src={avatarUrl} alt="avatar" />
          ) : (
            <Avatar className={styles.avatar_emptySrc} alt="avatar" />
          )}
        </Popover>
        <Link
          className={styles.directoryTableName__name}
          to={() => handleProfileEmployee(_id, tenant, generalInfo?.userId)}
        >
          {generalInfo?.legalName}
        </Link>
      </div>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'generalInfo',
      key: 'name',
      align: 'left',
      fixed: 'left',
      width: 250,
      render: (_, record) => (record ? renderUser(record) : ''),
    },
    {
      title: 'User ID',
      dataIndex: 'generalInfo',
      key: 'userId',
      width: 150,
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
      width: 150,
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
      width: 150,
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
      width: 200,
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
      width: 100,
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
      width: 200,
      render: (manager) => {
        const {
          _id,
          department,
          departmentInfo,
          title,
          titleInfo,
          employeeType,
          employeeTypeInfo,
          location,
          locationInfo,
          employeeId,
          generalInfo,
          generalInfoInfo,
        } = manager;
        const managerTemp = {
          _id,
          employeeId,
          generalInfo: generalInfoInfo || generalInfo,
          title: titleInfo || title,
          department: departmentInfo || department,
          location: locationInfo || location,
          employeeType: employeeTypeInfo || employeeType,
        };
        return (
          <Popover
            content={
              <PopoverInfo
                listLocationsByCompany={listLocationsByCompany}
                propsState={{ currentTime, timezoneList }}
                data={managerTemp}
              />
            }
            placement="bottomRight"
            trigger="hover"
          >
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
              }
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          </Popover>
        );
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
          scroll={{ x: '100vw' }}
        />
      </div>
    </div>
  );
});
export default connect(
  ({
    loading,
    user: { permissions = {} },
    locationSelection: { listLocationsByCompany = [] },
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
    permissions,
    listLocationsByCompany,
  }),
)(EmployeeResult);
