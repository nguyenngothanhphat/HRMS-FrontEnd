/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/destructuring-assignment */
import { Avatar, Card, Popover, Table } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import { isOwner } from '@/utils/authority';
import filterIcon from '@/assets/offboarding-filter.svg';
import avtDefault from '@/assets/avtDefault.jpg';
import styles from '../../index.less';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';

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
    profileOwner = false,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
      render: (manager = {}) => {
        return (
          <Link
            className={styles.managerName}
            to={() =>
              handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
            }
          >
            {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
          </Link>
        );
      },
    },
  ];

  const renderOption = () => {
    return (
      <div className={styles.options}>
        <CustomOrangeButton onClick={clickFilter}>Filter</CustomOrangeButton>
      </div>
    );
  };
  return (
    <Card className={styles.ResultContent} extra={renderOption()}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={columns}
          list={employeeList}
          loading={loadTableData || loadTableData2}
          scrollable
          width="100vw"
        />
      </div>
    </Card>
  );
});
export default connect(
  ({
    loading,
    user: { permissions = {} },
    location: { companyLocationList = [] },
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
    companyLocationList,
  }),
)(EmployeeResult);
