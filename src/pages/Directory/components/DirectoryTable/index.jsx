/* eslint-disable no-console */
import { Avatar, Button, Popover, Table, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, formatMessage, Link } from 'umi';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import { isOwner } from '@/utils/authority';
import avtDefault from '@/assets/avtDefault.jpg';
import ModalTerminate from './components/ModalTerminate';
import PopoverInfo from './components/ModalTerminate/PopoverInfo';
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
@connect(
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
)
class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedName: {},
      // pageSelected: 1,
      // rowSize: 10,
      isSort: false,
      openModal: false,
      rowData: {},
      valueReason: '',
      timezoneList: [],
      selectColumn: false,
      currentTime: moment(),
    };
  }

  componentDidMount = () => {
    this.fetchTimezone();
  };

  componentDidUpdate(prevProps) {
    const { list = [], companyLocationList = [] } = this.props;
    if (JSON.stringify(prevProps.list) !== JSON.stringify(list)) {
      this.setFirstPage();
    }
    if (JSON.stringify(prevProps.companyLocationList) !== JSON.stringify(companyLocationList)) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { companyLocationList = [] } = this.props;
    const timezoneList = [];
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
    this.setState({
      timezoneList,
    });
  };

  getAvatarUrl = (avatar, isShowAvatar) => {
    const { permissions = {}, profileOwner = false } = this.props;
    if (isShowAvatar) return avatar || avtDefault;
    if (permissions.viewAvatarEmployee !== -1 || profileOwner) {
      if (avatar) return avatar;
      return avtDefault;
    }
    return avtDefault;
  };

  ac = (val) => `/time-off/${val}`;

  renderUser = (employeePack) => {
    const { _id = '', generalInfo = {}, tenant = '' } = employeePack;
    const { isShowAvatar = true, avatar = '' } = generalInfo;
    const avatarUrl = this.getAvatarUrl(avatar, isShowAvatar);

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
          to={() => this.handleProfileEmployee(_id, tenant, generalInfo?.userId)}
        >
          {generalInfo?.legalName}
        </Link>
      </div>
    );
  };

  handleClick = (e, item = {}) => {
    e.stopPropagation();
    this.setState({
      rowData: item,
      openModal: true,
    });
  };

  handleCandelModal = () => {
    // e.stopPropagation();
    this.setState({
      openModal: false,
    });
  };

  getPayload = (id, reasonForLeaving, lastWorkingDate) => {
    const { approvalflow = [] } = this.props;

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

  handleSubmit = (values) => {
    const { rowData = {} } = this.state;
    const { dispatch, refreshData = () => {} } = this.props;
    const { _id = '' } = rowData;
    const { reason, lastWorkingDate } = values;

    const payload = this.getPayload(_id, reason, lastWorkingDate);

    dispatch({
      type: 'offboarding/terminateReason',
      payload,
    }).then((res) => {
      if (res.statusCode === 200) {
        refreshData();
        this.setState({
          openModal: false,
        });
      }
    });
  };

  // onChangeReason = ({ target: { value } }) => {
  //   this.setState({ valueReason: value });
  // };

  generateColumns = (sortedName, keyTab) => {
    const { permissions = {}, companyLocationList } = this.props;
    const { currentTime, timezoneList } = this.state;

    const columns = [
      {
        title: (
          <div className={styles.directoryTable_fullName}>
            {formatMessage({ id: 'component.directory.table.fullName' })}
            {/* {isSort ? null : <CaretDownOutlined className={styles.directoryTable_iconSort} />} */}
          </div>
        ),
        dataIndex: 'employeePack',
        key: 'employeePack',
        render: (employeePack) => (employeePack ? this.renderUser(employeePack) : ''),
        align: 'left',
        sorter: (a, b) => {
          return a.employeePack.generalInfo && a.employeePack.generalInfo?.legalName
            ? a.employeePack.generalInfo?.legalName.localeCompare(
                `${b.employeePack.generalInfo?.legalName}`,
              )
            : null;
        },
        sortOrder: sortedName.columnKey === 'employeePack' && sortedName.order,
        fixed: 'left',
        width: '16%',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        // className: `${styles.col} `,
      },
      {
        title: formatMessage({ id: 'component.directory.table.userID' }),
        dataIndex: 'generalInfo',
        key: 'userName',
        render: (generalInfo) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {generalInfo?.userId}
          </span>
        ),
        width: '10%',
        align: 'left',
        sortOrder: sortedName.columnKey === 'userName' && sortedName.order,
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
        sortOrder: sortedName.columnKey === 'employeeId' && sortedName.order,
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
        render: (generalInfo) => (
          <span style={{ fontSize: '13px' }}>
            {generalInfo?.workNumber ? generalInfo.workNumber : '-'}
          </span>
        ),
        width: '10%',
        align: 'left',
        sortOrder: sortedName.columnKey === 'workNumber' && sortedName.order,
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
        render: (generalInfo) => <span>{generalInfo?.workEmail}</span>,
        width: '16%',
        align: 'left',
        sortOrder: sortedName.columnKey === 'workEmail' && sortedName.order,
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
          <span className={styles.title} onClick={() => this.onFilter(title?._id, 'title')}>
            {title ? title.name : ''}
          </span>
        ),
        width: '12%',
        align: 'left',
        sortOrder: sortedName.columnKey === 'title' && sortedName.order,
        sorter: (a, b) => {
          return a.title && a.title?.name ? a.title?.name.localeCompare(`${b.title?.name}`) : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => (
          <Popover
            content={() => this.locationContent(location)}
            title={location.name}
            trigger="hover"
          >
            <span
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              onMouseEnter={this.setCurrentTime}
            >
              {location ? location.name : ''}
            </span>
          </Popover>
        ),
        width: '10%',
        ellipsis: true,
        align: 'left',
        sortOrder: sortedName.columnKey === 'location' && sortedName.order,
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
          <Popover
            content={
              <PopoverInfo
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
              to={() =>
                this.handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)}
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          </Popover>
        ),
        align: 'left',
        width: '14%',
        sortOrder: sortedName.columnKey === 'manager' && sortedName.order,
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
              onClick={() => this.onFilter(department.name, 'department')}
              color={tag.color}
            >
              {department.name}
            </Tag>
          );
          //   <span className={styles.directoryTable_deparmentText}>
          //   {department ? department.name : ''}
          // </span>
        },
        width: '10%',
        align: 'left',
        sortOrder: sortedName.columnKey === 'department' && sortedName.order,
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
        sortOrder: sortedName.columnKey === 'employeeType' && sortedName.order,
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
                <Button onClick={(e) => this.handleClick(e, row)} className={styles.actionBtn}>
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

  handleChangeTable = (_pagination, _filters, sorter) => {
    // const descend = 'descend';
    // const ascend = 'ascend';
    // let isSort = false;
    // if (sorter.order === descend || sorter.order === ascend) {
    //   isSort = true;
    // }
    this.setState({
      sortedName: sorter,
      // isSort,
    });
  };

  // onChangePagination = (pageNumber) => {
  //   const { getPageSelected } = this.props;
  //   this.setState({
  //     pageSelected: pageNumber,
  //   });
  //   getPageSelected(pageNumber);
  // };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  handleProfileEmployee = (_id, tenant, userId) => {
    // const { _id = '', location: { name = '' } = {}, tenant = '', company = {} } = row;
    // const { dispatch } = this.props;
    // await dispatch({
    //   type: 'employeeProfile/save',
    //   payload: {
    //     tenantCurrentEmployee: tenant,
    //     companyCurrentEmployee: company?._id,
    //   },
    // });

    localStorage.setItem('tenantCurrentEmployee', tenant);
    // localStorage.setItem('companyCurrentEmployee', company?._id);
    // localStorage.setItem('idCurrentEmployee', _id);

    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };

  checkPermissionViewProfile = (permissions) => {
    const viewProfile = 'P_PROFILE_VIEW';
    const findIndexViewProfile = permissions.indexOf(viewProfile);
    return findIndexViewProfile;
  };

  onFilter = async (value, fieldName) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employee/saveFilter',
      payload: { [fieldName]: [value] },
    });
  };

  setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const { currentTime } = this.state;
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTime).format(timeFormat)),
    );

    if (check) {
      this.setState({
        currentTime: moment(),
      });
    }
  };

  locationContent = (location) => {
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

    const { timezoneList, currentTime } = this.state;
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};

    return (
      <div className={styles.locationContent}>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Address:
        </span>
        <span style={{ display: 'block', fontSize: '13px', marginBottom: '10px' }}>
          {addressLine1}
          {addressLine2 && ', '}
          {addressLine2}
          {state && ', '}
          {state}
          {country ? ', ' : ''}
          {country?.name || country || ''}
          {zipCode && ', '}
          {zipCode}
        </span>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Local time{state && ` in  ${state}`}:
        </span>
        <span style={{ display: 'block', fontSize: '13px' }}>
          {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
            ? getCurrentTimeOfTimezone(currentTime, findTimezone.timezone)
            : 'Not enough data in address'}
        </span>
      </div>
    );
  };

  getNewList = (list) => {
    return list.map((item) => {
      return {
        ...item,
        employeePack: {
          _id: item._id,
          generalInfo: item.generalInfo,
          tenant: item.tenant,
        },
        managerPack: {
          _id: item?.manager?._id,
          generalInfo: item?.manager?.generalInfo,
          tenant: item.tenant,
        },
      };
    });
  };

  renderTotal = () => {
    const { totalActiveEmployee, totalInactiveEmployee, tabName } = this.props;
    if (tabName === 'Active Employees') {
      return totalActiveEmployee;
    }
    if (tabName === 'Inactive Employees') {
      return totalInactiveEmployee;
    }
    return 0;
  };

  render() {
    const {
      sortedName = {},
      // pageSelected,
      openModal = false,
      valueReason = '',
      // rowSize,
      selectColumn,
    } = this.state;
    const {
      list = [],
      loading,
      keyTab,
      loadingTerminateReason,
      totalActiveEmployee,
      totalInactiveEmployee,
      totalMyTeam,
      tabName,
      pageSelected,
      rowSize,
    } = this.props;
    const newList = this.getNewList(list);
    const pagination = {
      position: ['bottomLeft'],
      total:
        // eslint-disable-next-line no-nested-ternary
        tabName === 'Active Employees'
          ? totalActiveEmployee
          : tabName === 'Inactive Employees'
          ? totalInactiveEmployee
          : totalMyTeam,
      showTotal: (total, range) => {
        return (
          <span>
            {' '}
            {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
            <b>
              {' '}
              {range[0]} - {range[1]}{' '}
            </b>{' '}
            {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
          </span>
        );
      },
      defaultPageSize: rowSize,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: rowSize,
      current: pageSelected,
      onChange: (page, pageSize) => {
        const { getPageSelected, getSize } = this.props;
        getPageSelected(page);
        getSize(pageSize);
      },
    };
    const scroll = {
      x: '140vw',
      y: 'max-content',
    };

    return (
      <>
        <div className={`${styles.directoryTable} ${selectColumn ? styles.selectCol : null}`}>
          <Table
            size="small"
            columns={this.generateColumns(sortedName, keyTab)}
            dataSource={newList}
            rowKey={(record) => record._id}
            pagination={pagination}
            loading={loading}
            onChange={this.handleChangeTable}
            scroll={scroll}
            onHeaderRow={() => {
              return {
                onClick: () => this.setState({ selectColumn: true }), // if select column, the whole column will be highlighted.
              };
            }}
          />
        </div>
        <ModalTerminate
          loading={loadingTerminateReason}
          visible={openModal}
          handleSubmit={this.handleSubmit}
          handleCandelModal={this.handleCandelModal}
          valueReason={valueReason}
          onChange={this.onChangeReason}
        />
      </>
    );
  }
}

export default DirectoryTable;
