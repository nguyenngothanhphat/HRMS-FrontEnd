/* eslint-disable no-console */
import avtDefault from '@/assets/avtDefault.jpg';
import { isOwner } from '@/utils/authority';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import { Avatar, Button, Popover, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
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
@connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    listLocationsByCompany,
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
      currentTime: moment(),
    };
  }

  componentDidMount = () => {
    this.fetchTimezone();
  };

  componentDidUpdate(prevProps) {
    const { list = [], listLocationsByCompany = [] } = this.props;
    if (JSON.stringify(prevProps.list) !== JSON.stringify(list)) {
      this.setFirstPage();
    }
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
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
    if (isShowAvatar) return avatar;
    if (permissions.viewAvatarEmployee !== -1 || profileOwner) {
      if (avatar) return avatar;
      return null;
    }
    return avtDefault;
  };

  renderUser = (employeePack) => {
    const { _id = '', generalInfo = {}, tenant = '' } = employeePack;
    const { isShowAvatar = true, avatar = '' } = generalInfo;
    const avatarUrl = this.getAvatarUrl(avatar, isShowAvatar);
    return (
      <div className={styles.directoryTableName}>
        {avatarUrl ? (
          <Avatar size="medium" className={styles.avatar} src={avatarUrl} alt="avatar" />
        ) : (
          <Avatar className={styles.avatar_emptySrc} alt="avatar" />
        )}
        <p onClick={() => this.handleProfileEmployee(_id, tenant, generalInfo?.userId)}>
          {`${generalInfo?.firstName} ${generalInfo?.lastName}`}
        </p>
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
    const { dispatch } = this.props;
    const { _id = '' } = rowData;
    const { reason, lastWorkingDate } = values;

    const payload = this.getPayload(_id, reason, lastWorkingDate);

    dispatch({
      type: 'offboarding/terminateReason',
      payload,
    }).then(() => {
      this.setState({
        openModal: false,
      });
    });
  };

  // onChangeReason = ({ target: { value } }) => {
  //   this.setState({ valueReason: value });
  // };

  generateColumns = (sortedName, keyTab) => {
    const { permissions = {} } = this.props;

    // const { isSort } = this.state;
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
        sorter: (a, b) =>
          a.employeePack.generalInfo && a.employeePack.generalInfo?.firstName
            ? `${a.employeePack.generalInfo?.firstName} ${a.employeePack.generalInfo?.lastName}`.localeCompare(
                `${b.employeePack.generalInfo?.firstName} ${b.employeePack.generalInfo?.lastName}`,
              )
            : null,
        // sortOrder: sortedName.columnKey === 'employeePack' && sortedName.order,
        fixed: 'left',
        width: '18%',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        className: `${styles.col} `,
      },
      {
        title: formatMessage({ id: 'component.directory.table.email' }),
        dataIndex: 'generalInfo',
        key: 'workEmail',
        render: (generalInfo) => <span>{generalInfo?.workEmail}</span>,
        width: '20%',
        align: 'left',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.userId' }),
        dataIndex: 'generalInfo',
        key: 'userId',
        render: (generalInfo) => <span>{generalInfo?.userId}</span>,
        width: '12%',
        align: 'left',
        sorter: () => null,
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
        width: '12%',
        align: 'left',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        className: `${styles.employeeId} `,
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        width: '12%',
        align: 'left',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => (
          <Tooltip placement="left" title={`Filter by ${title ? title.name : ''}`}>
            <span className={styles.title} onClick={() => this.onFilter(title, 'title')}>
              {title ? title.name : ''}
            </span>
          </Tooltip>
        ),
        width: '12%',
        align: 'left',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => {
          const tag = departmentTag.find((d) => d.name === department.name) || { color: '#108ee9' };
          return (
            <Tooltip placement="left" title={`Filter by ${department ? department.name : ''}`}>
              <Tag
                className={styles.department}
                onClick={() => this.onFilter(department, 'department')}
                color={tag.color}
              >
                {department.name}
              </Tag>
            </Tooltip>
          );
          //   <span className={styles.directoryTable_deparmentText}>
          //   {department ? department.name : ''}
          // </span>
        },
        width: '14%',
        align: 'left',
        sorter: () => null,
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
            <span onMouseEnter={this.setCurrentTime}>{location ? location.name : ''}</span>
          </Popover>
        ),
        width: '14%',
        align: 'left',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'managerPack',
        key: 'managerPack',
        render: (managerPack) => (
          <span
            className={styles.managerName}
            onClick={() =>
              this.handleProfileEmployee(
                managerPack._id,
                managerPack.tenant,
                managerPack.generalInfo?.userId,
              )
            }
          >
            {managerPack.generalInfo
              ? `${managerPack?.generalInfo?.firstName} ${managerPack?.generalInfo?.lastName}`
              : ''}
          </span>
        ),
        align: 'left',
        width: '14%',
        sorter: () => null,
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'employeeType',
        key: 'employmentType',
        render: (employeeType) => <span>{employeeType ? employeeType.name : ''}</span>,
        align: 'left',
        width: '14%',
        sorter: () => null,
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

  handleProfileEmployee = async (_id, tenant, userId) => {
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
    setTimeout(() => {
      history.push({
        pathname,
        // state: { location: name },
      });
    }, 200);
  };

  checkPermissionViewProfile = (permissions) => {
    const viewProfile = 'P_PROFILE_VIEW';
    const findIndexViewProfile = permissions.indexOf(viewProfile);
    return findIndexViewProfile;
  };

  onFilter = async (obj, fieldName) => {
    const { dispatch } = this.props;
    const {
      // list = [],
      handleFilterPane = () => {},
    } = this.props;
    // let newList = [];

    if (fieldName === 'department') {
      dispatch({
        type: 'employee/saveFilter',
        payload: { name: 'Department', checkedList: [obj.name] },
      });
    }
    if (fieldName === 'title') {
      // newList = list.filter((item) => item.title?._id === obj._id) || [];
      // dispatch({
      //   type: 'employee/save',
      //   payload: { listEmployeeActive: [...newList] },
      // });
      dispatch({
        type: 'employee/saveFilter',
        payload: { name: 'Title', checkedList: [obj._id] },
      });
    }
    handleFilterPane(true);
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
      // pageSize: rowSize,
      current: pageSelected,
      onChange: (page, pageSize) => {
        const { getPageSelected, getSize } = this.props;
        getPageSelected(page);
        getSize(pageSize);
      },
    };
    const scroll = {
      x: '100vw',
      y: 'max-content',
    };

    return (
      <>
        <div className={styles.directoryTable}>
          <Table
            size="small"
            columns={this.generateColumns(sortedName, keyTab)}
            // onRow={(record) => {
            //   return {
            //     onClick: () => this.handleProfileEmployee(record), // click row
            //   };
            // }}
            dataSource={newList}
            rowKey={(record) => record._id}
            // pagination={{ ...pagination, total: list.length }}
            pagination={pagination}
            loading={loading}
            onChange={this.handleChangeTable}
            scroll={scroll}
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
