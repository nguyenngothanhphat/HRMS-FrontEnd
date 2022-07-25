/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { Avatar, Button, Popover, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, Link } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import CommonTable from '@/components/CommonTable';
import UserProfilePopover from '@/components/UserProfilePopover';
import { isOwner } from '@/utils/authority';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import ModalTerminate from './components/ModalTerminate';
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
    companyLocationList = [],
    permissions = {},
    profileOwner = false,
    approvalflow = [],
    dispatch,
    refreshData = () => {},
    totalActiveEmployee,
    totalInactiveEmployee,
    tabName = '',
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [valueReason, setValueReason] = useState('');
  const [timezoneList, setTimezoneList] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment());
  const [hoveringLocation, setHoveringLocation] = useState('');

  const fetchTimezone = () => {
    const timezoneListTemp = [];
    companyLocationList.forEach((location) => {
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
  }, [JSON.stringify(companyLocationList)]);

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
    setOpenModal(true);
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  const getPayload = (id, reasonForLeaving, lastWorkingDate) => {
    let approvalFlowID = '';
    approvalflow.forEach((item) => {
      approvalFlowID = item._id;
    });

    const payload = {
      action: 'submit',
      employee: id,
      reasonForLeaving,
      approvalFlow: approvalFlowID,
      lastWorkingDate,
    };

    return payload;
  };

  const handleSubmit = (values) => {
    const { _id = '' } = rowData;
    const { reason, lastWorkingDate } = values;

    const payload = getPayload(_id, reason, lastWorkingDate);

    dispatch({
      type: 'offboarding/terminateReason',
      payload,
    }).then((res) => {
      if (res.statusCode === 200) {
        refreshData();
        setOpenModal(false);
      }
    });
  };

  const dataHover = (manager = {}) => {
    const {
      generalInfo: {
        legalName = '',
        avatar: avatar1 = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        skills = [],
      } = {},
      generalInfo = {},
      department = {},
      location: locationInfo = {},
      managerInfo = {},
      title = {},
    } = manager;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      locationInfo,
      generalInfo,
      managerInfo,
      title,
      avatar1,
      skills,
    };
  };

  const onFilter = async (value, fieldName) => {
    dispatch({
      type: 'employee/saveFilter',
      payload: { [fieldName]: [value] },
    });
  };

  const getCurrentTime = () => {
    setCurrentTime(moment());
  };

  const locationContent = (location) => {
    const {
      headQuarterAddress: {
        addressLine1 = '',
        addressLine2 = '',
        state = '',
        country = {},
        zipCode = '',
      } = {},
      _id = '',
    } = location;

    const address = [addressLine1, addressLine2, state, country.name || country || null, zipCode]
      .filter(Boolean)
      .join(', ');
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id);

    return (
      <div className={styles.locationContent}>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Address:
        </span>
        <span style={{ display: 'block', fontSize: '13px', marginBottom: '10px' }}>{address}</span>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Local time{state && ` in  ${state}`}:
        </span>
        <span style={{ display: 'block', fontSize: '13px' }}>
          {findTimezone?.timezone && Object.keys(findTimezone).length > 0
            ? getCurrentTimeOfTimezone(currentTime, findTimezone.timezone)
            : 'Not enough data in the address'}
        </span>
      </div>
    );
  };

  const onChangeReason = ({ target: { value } }) => {
    setValueReason(value);
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
          return a.generalInfo && a.generalInfo?.userId
            ? a.generalInfo?.userId.localeCompare(`${b.generalInfo?.userId}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        className: `${styles.employeeId} `,
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        width: '10%',
        align: 'left',
        // sortOrder: sortedName.columnKey === 'employeeId' && sortedName.order,
        sorter: (a, b) => {
          return a.generalInfo && a.generalInfo?.employeeId
            ? a.generalInfo?.employeeId.localeCompare(`${b.generalInfo?.employeeId}`)
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
          return a.generalInfo && a.generalInfo?.workNumber
            ? a.generalInfo?.workNumber.localeCompare(`${b.generalInfo?.workNumber}`)
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
          return a.generalInfo && a.generalInfo?.workEmail
            ? a.generalInfo?.workEmail.localeCompare(`${b.generalInfo?.workEmail}`)
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
        render: (location = {}, row = {}) => (
          <Popover
            content={hoveringLocation === row._id ? locationContent(location) : null}
            title={location.name}
            onVisibleChange={(visible) => {
              setHoveringLocation(visible ? row._id : null);
            }}
            visible={hoveringLocation === row._id}
            trigger="hover"
          >
            <span
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              onMouseEnter={getCurrentTime}
            >
              {location ? location.name : ''}
            </span>
          </Popover>
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
        render: (manager) => (
          <UserProfilePopover data={dataHover(manager)}>
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)}
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          </UserProfilePopover>
        ),
        align: 'left',
        width: '14%',
        // sortOrder: sortedName.columnKey === 'manager' && sortedName.order,
        sorter: (a, b) => {
          return a.manager.generalInfo && a.manager.generalInfo?.legalName
            ? a.manager.generalInfo?.legalName.localeCompare(`${b.manager.generalInfo?.legalName}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => {
          const tag = departmentTag.find((d) => d.name === department.name) || { color: '#108ee9' };
          return (
            <Tag
              className={styles.department}
              onClick={() => onFilter(department.name, 'department')}
              color={tag.color}
            >
              {department.name}
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
      <ModalTerminate
        loading={loadingTerminateReason}
        visible={openModal}
        handleSubmit={handleSubmit}
        handleCancelModal={handleCancelModal}
        valueReason={valueReason}
        onChange={onChangeReason}
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
