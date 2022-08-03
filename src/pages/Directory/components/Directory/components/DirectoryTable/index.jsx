/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { Avatar, Button, Popover, Tag } from 'antd';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect, formatMessage, Link } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import AddressPopover from '@/components/AddressPopover';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import UserProfilePopover from '@/components/UserProfilePopover';
import { isOwner } from '@/utils/authority';
import TerminateModalContent from '../TerminateModalContent';
import styles from './index.less';

const departmentTag = [
  { name: 'IT support', color: 'magenta' },
  { name: 'Engineering', color: 'blue' },
  { name: 'HR', color: 'green' },
  { name: 'Sale', color: 'orange' },
  { name: 'Marketing', color: 'gold' },
  { name: 'BOD', color: 'lime' },
  { name: 'Finance', color: 'red' },
  { name: 'Accounting', color: 'volcano' },
  { name: 'Operations & Facility management', color: 'cyan' },
  { name: 'UX/UI Design', color: 'geekblue' },
  { name: 'Sales', color: 'purple' },
  { name: 'Customer services', color: '#f50' },
  { name: 'Business development', color: '#87d068' },
];

const DirectoryTable = (props) => {
  const {
    list = [],
    loading,
    keyTab,
    loadingTerminateReason,
    totalMyTeam,
    pageSelected,
    rowSize,
    permissions = {},
    profileOwner = false,
    dispatch,
    refreshData = () => {},
    totalActiveEmployee,
    totalInactiveEmployee,
    tabName = '',
  } = props;

  const [terminalModalVisible, setTerminalModalVisible] = useState(false);
  const [rowData, setRowData] = useState({});

  const getAvatarUrl = (avatar, isShowAvatar) => {
    if (isShowAvatar) return avatar || avtDefault;
    if (permissions.viewAvatarEmployee !== -1 || profileOwner) {
      if (avatar) return avatar;
      return avtDefault;
    }
    return avtDefault;
  };

  const handleProfileEmployee = (userId) => {
    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };

  const renderUser = (generalInfoProp = {}) => {
    const { isShowAvatar = true, avatar = '', userId = '', legalName = '' } = generalInfoProp;
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
        <Link className={styles.directoryTableName__name} to={() => handleProfileEmployee(userId)}>
          {legalName}
        </Link>
      </div>
    );
  };

  const handleClick = (e, item = {}) => {
    e.stopPropagation();
    setRowData(item);
    setTerminalModalVisible(true);
  };

  const onTerminateModalClose = () => {
    setTerminalModalVisible(false);
    refreshData();
  };

  const dataHover = (manager = {}) => {
    const {
      generalInfo = {} || {},
      department = {} || {},
      location: locationInfo = {} || {},
      managerInfo = {} || {},
      title = {} || {},
    } = manager || {};
    return {
      legalName: generalInfo?.legalName,
      userId: generalInfo?.legalNauserIdme,
      department,
      workEmail: generalInfo?.workEmail,
      workNumber: generalInfo?.workNumber,
      locationInfo,
      generalInfo,
      managerInfo,
      title,
      avatar1: generalInfo?.avatar,
      skills: generalInfo?.skills,
    };
  };

  const onFilter = async (value, fieldName) => {
    dispatch({
      type: 'employee/saveFilter',
      payload: { [fieldName]: [value] },
    });
  };

  const generateColumns = () => {
    const columns = [
      {
        title: (
          <div className={styles.directoryTable_fullName}>
            {formatMessage({ id: 'component.directory.table.fullName' })}
            {/* {isSort ? null : <CaretDownOutlined className={styles.directoryTable_iconSort} />} */}
          </div>
        ),
        dataIndex: 'generalInfo',
        key: 'legalName',
        render: (generalInfo = {}) => (generalInfo ? renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) => {
          return a.generalInfo && a.generalInfo?.legalName
            ? a.generalInfo?.legalName.localeCompare(`${b.generalInfo?.legalName}`)
            : null;
        },
        // sortOrder: sortedName.columnKey === 'employeePack' && sortedName.order,
        fixed: 'left',
        width: '16%',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        // className: `${styles.col} `,
      },
      {
        title: formatMessage({ id: 'component.directory.table.userID' }),
        dataIndex: 'generalInfo',
        key: '_id',
        render: (generalInfo) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {generalInfo?.userId}
          </span>
        ),
        width: '10%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'userName' && sortedName.order,
        sorter: (a, b) => {
          return a?.generalInfo && a?.generalInfo?.userId
            ? a?.generalInfo?.userId.localeCompare(`${b?.generalInfo?.userId}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        className: `${styles.employeeId} `,
        render: (generalInfo = {}) => <span>{generalInfo ? generalInfo?.employeeId : ''}</span>,
        width: '10%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'employeeId' && sortedName.order,
        sorter: (a, b) => {
          return a?.generalInfo && a?.generalInfo?.employeeId
            ? a?.generalInfo?.employeeId.localeCompare(`${b?.generalInfo?.employeeId}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Work Number',
        dataIndex: 'generalInfo',
        key: 'workNumber',
        render: (generalInfo = {}) => (
          <span style={{ fontSize: '13px' }}>{generalInfo?.workNumber || '-'}</span>
        ),
        width: '10%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'workNumber' && sortedName.order,
        sorter: (a, b) => {
          return a?.generalInfo && a?.generalInfo?.workNumber
            ? a?.generalInfo?.workNumber.localeCompare(`${b?.generalInfo?.workNumber}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.email' }),
        dataIndex: 'generalInfo',
        key: 'workEmail',
        render: (generalInfo = {}) => <span>{generalInfo?.workEmail}</span>,
        width: '16%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'workEmail' && sortedName.order,
        sorter: (a, b) => {
          return a?.generalInfo && a?.generalInfo?.workEmail
            ? a?.generalInfo?.workEmail.localeCompare(`${b?.generalInfo?.workEmail}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => (
          <span className={styles.title} onClick={() => onFilter(title?._id, 'title')}>
            {title?.name || ''}
          </span>
        ),
        width: '12%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'title' && sortedName.order,
        sorter: (a, b) => {
          return a.title && a.title?.name ? a.title?.name.localeCompare(`${b.title?.name}`) : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location = {}) => (
          <AddressPopover location={location}>
            <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {location ? location.name : ''}
            </span>
          </AddressPopover>
        ),
        width: '10%',
        ellipsis: true,
        align: 'left',
        // sortOrder: sortedName.columnKey === 'location' && sortedName.order,
        sorter: (a, b) => {
          return a.location && a.location?.name
            ? a.location?.name.localeCompare(`${b.location?.name}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'manager',
        key: 'manager',
        render: (manager = {}) => (
          <UserProfilePopover data={dataHover(manager)}>
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager?._id, manager?.tenant, manager?.generalInfo?.userId)}
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          </UserProfilePopover>
        ),
        align: 'left',
        width: '14%',
        // sortOrder: sortedName.columnKey === 'manager' && sortedName.order,
        sorter: (a, b) => {
          return a?.manager?.generalInfo && a?.manager?.generalInfo?.legalName
            ? a?.manager?.generalInfo?.legalName.localeCompare(
                `${b?.manager?.generalInfo?.legalName}`,
              )
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department = {}) => {
          const tag = departmentTag?.find((d) => d?.name === department?.name) || {
            color: '#108ee9',
          };
          return (
            <Tag
              className={styles.department}
              onClick={() => onFilter(department?.name, 'department')}
              color={tag.color}
            >
              {department?.name}
            </Tag>
          );
        },
        width: '10%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'department' && sortedName.order,
        sorter: (a, b) => {
          return a.department && a.department?.name
            ? a.department?.name.localeCompare(`${b.department?.name}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeType' }),
        dataIndex: 'empTypeOther',
        key: 'empTypeOther',
        render: (empTypeOther) => <span>{empTypeOther || '-'}</span>,
        align: 'left',
        width: '10%',
        // sortOrder: sortedName.columnKey === 'empTypeOther' && sortedName.order,
        sorter: (a, b) => {
          return a.empTypeOther ? a.empTypeOther.localeCompare(`${b.empTypeOther}`) : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'employeeType',
        key: 'employeeType',
        render: (employeeType) => <span>{employeeType ? employeeType.name : ''}</span>,
        align: 'left',
        width: '10%',
        // sortOrder: sortedName.columnKey === 'employeeType' && sortedName.order,
        sorter: (a, b) => {
          return a.employeeType && a.employeeType?.name
            ? a.employeeType?.name.localeCompare(`${b.employeeType?.name}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.action' }),
        dataIndex: 'action',
        key: 'action',
        align: 'left',
        width: '8%',
        render: (_, row) => {
          return (
            <div className={styles.viewAction}>
              {keyTab === 'active' ? (
                <Button onClick={(e) => handleClick(e, row)} className={styles.actionBtn}>
                  Terminate
                </Button>
              ) : null}
            </div>
          );
        },
        sorter: () => null,
      },
    ];

    const renderColumns =
      permissions.viewActionButton !== -1
        ? columns
        : columns.filter((col) => col.dataIndex !== 'action');

    return renderColumns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  const onChangePage = (page, limit) => {
    const { getPageSelected, getSize } = props;
    getPageSelected(page);
    getSize(limit);
  };

  return (
    <>
      <div className={styles.directoryTable}>
        <CommonTable
          // size="small"
          columns={generateColumns()}
          list={list}
          rowKey="_id"
          loading={loading}
          page={pageSelected}
          limit={rowSize}
          total={
            tabName === 'Active Employees'
              ? totalActiveEmployee
              : tabName === 'Inactive Employees'
              ? totalInactiveEmployee
              : totalMyTeam
          }
          onChangePage={onChangePage}
          isBackendPaging
          // scroll={scroll}
          scrollable
          width="140vw"
          height={500}
        />
      </div>

      <CommonModal
        visible={terminalModalVisible}
        content={
          <TerminateModalContent
            visible={terminalModalVisible}
            onClose={onTerminateModalClose}
            employee={rowData?._id}
          />
        }
        onClose={onTerminateModalClose}
        title="Terminate employee"
        loading={loadingTerminateReason}
        width={550}
      />
    </>
  );
};

export default connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    location: { companyLocationList = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    companyLocationList,
  }),
)(DirectoryTable);
