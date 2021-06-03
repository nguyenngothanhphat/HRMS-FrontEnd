/* eslint-disable no-console */
import React, { Component } from 'react';
import { history, formatMessage, connect } from 'umi';
import { CaretDownOutlined } from '@ant-design/icons';
import { Table, Avatar, Button, Tag, Tooltip, Popover } from 'antd';
import avtDefault from '@/assets/avtDefault.jpg';
import { isOwner } from '@/utils/authority';
import styles from './index.less';
import ModalTerminate from './components/ModalTerminate';

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
      pageSelected: 1,
      isSort: false,
      openModal: false,
      rowData: {},
      valueReason: '',
    };
  }

  // componentDidMount = () => {
  //   const { listLocationsByCompany = [] } = this.props;
  //   listLocationsByCompany.forEach((location) => this.getTime(location.headQuarterAddress.state));
  // };

  componentDidUpdate(prevProps) {
    const { list } = this.props;
    if (JSON.stringify(prevProps.list) !== JSON.stringify(list)) {
      this.setFirstPage();
    }
  }

  // getTime = (state) => {
  //   console.log('state', state);
  //   const tzNames = moment.tz.names();
  //   const stateWords = state.split('_');

  //   // const list = tzNames.find((tz) => tz.indexOf(stateWords) > -1);
  //   const found = tzNames.some((r) => stateWords.indexOf(r) >= 0);
  // };

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
        <p onClick={() => this.handleProfileEmployee(_id, tenant)}>
          {`${generalInfo.firstName} ${generalInfo.lastName}`}
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

    const { isSort } = this.state;
    const columns = [
      {
        title: (
          <div className={styles.directoryTable_fullName}>
            {formatMessage({ id: 'component.directory.table.fullName' })}
            {isSort ? null : <CaretDownOutlined className={styles.directoryTable_iconSort} />}
          </div>
        ),
        dataIndex: 'employeePack',
        key: 'employeePack',
        render: (employeePack) => (employeePack ? this.renderUser(employeePack) : ''),
        align: 'left',
        sorter: (a, b) =>
          a.employeePack.generalInfo && a.employeePack.generalInfo.firstName
            ? `${a.employeePack.generalInfo.firstName} ${a.employeePack.generalInfo.lastName}`.localeCompare(
                `${b.employeePack.generalInfo.firstName} ${b.employeePack.generalInfo.lastName}`,
              )
            : null,
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        fixed: 'left',
        width: '18%',
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      // {
      //   title: formatMessage({ id: 'component.directory.table.employeeID' }),
      //   dataIndex: 'generalInfo',
      //   key: 'employeeId',
      //   className: `${styles.employeeId} `,
      //   render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
      //   width: '10%',
      //   align: 'left',
      // },
      {
        title: formatMessage({ id: 'component.directory.table.email' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        render: (generalInfo) => <span>{generalInfo?.workEmail}</span>,
        width: '18%',
        align: 'left',
      },
      {
        title: 'Work Number',
        dataIndex: 'generalInfo',
        key: 'employeeId',
        render: (generalInfo) => (
          <span style={{ fontSize: '13px' }}>{generalInfo ? generalInfo.workNumber : '-'}</span>
        ),
        width: '10%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => (
          <Tooltip placement="left" title={`Filter by ${title.name}`}>
            <span className={styles.title} onClick={() => this.onFilter(title, 'title')}>
              {title ? title.name : ''}
            </span>
          </Tooltip>
        ),
        width: '12%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => {
          const tag = departmentTag.find((d) => d.name === department.name) || { color: '#108ee9' };
          return (
            <Tooltip placement="left" title={`Filter by ${department.name}`}>
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
            <span>{location ? location.name : ''}</span>
          </Popover>
        ),
        width: '14%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'managerPack',
        key: 'managerPack',
        render: (managerPack) => (
          <span
            className={styles.managerName}
            onClick={() => this.handleProfileEmployee(managerPack._id, managerPack.tenant)}
          >
            {managerPack.generalInfo
              ? `${managerPack?.generalInfo?.firstName} ${managerPack?.generalInfo?.lastName}`
              : ''}
          </span>
        ),
        align: 'left',
        width: '12%',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'employeeType',
        key: 'employmentType',
        render: (employeeType) => <span>{employeeType ? employeeType.name : ''}</span>,
        align: 'left',
        width: '12%',
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
    const descend = 'descend';
    const ascend = 'ascend';
    let isSort = false;
    if (sorter.order === descend || sorter.order === ascend) {
      isSort = true;
    }
    this.setState({
      sortedName: sorter,
      isSort,
    });
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  handleProfileEmployee = async (_id, tenant) => {
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
      ? `/employees/employee-profile/${_id}`
      : `/directory/employee-profile/${_id}`;
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

  onFilter = (obj, fieldName) => {
    const { dispatch } = this.props;
    const { list = [], handleFilterPane = () => {} } = this.props;
    let newList = [];

    if (fieldName === 'department') {
      dispatch({
        type: 'employee/saveFilter',
        payload: { name: 'Department', checkedList: [obj.name] },
      });
    }
    if (fieldName === 'title') {
      newList = list.filter((item) => item.title?._id === obj._id);
      dispatch({
        type: 'employee/save',
        payload: { listEmployeeActive: [...newList] },
      });
    }
    handleFilterPane(true);
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
    } = location;

    return (
      <div className={styles.locationContent}>
        <span>
          Address: {addressLine1}
          {addressLine2 && ', '}
          {addressLine2}
          {state && ', '}
          {state}
          {country && ', '}
          {country?.name || country}
          {zipCode && ', '}
          {zipCode}
        </span>
        {/* <p>Current time: {result}</p> */}
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
          _id: item.manager._id,
          generalInfo: item.manager.generalInfo,
          tenant: item.tenant,
        },
      };
    });
  };

  render() {
    const { sortedName = {}, pageSelected, openModal = false, valueReason = '' } = this.state;
    const { list = [], loading, keyTab, loadingTerminateReason } = this.props;
    const newList = this.getNewList(list);

    const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
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
            pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
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
