/* eslint-disable no-console */
import React, { Component } from 'react';
import { history, formatMessage, connect } from 'umi';
import { CaretDownOutlined } from '@ant-design/icons';
import { Table, Avatar, Button } from 'antd';
import styles from './index.less';
import ModalTerminate from './components/ModalTerminate';

@connect(({ loading, offboarding: { approvalflow = [] } = {} }) => ({
  loadingTerminateReason: loading.effects['offboarding/terminateReason'],
  approvalflow,
}))
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

  componentDidUpdate(prevProps) {
    const { list } = this.props;
    if (prevProps.list !== list) {
      this.setFirstPage();
    }
  }

  renderUser = (generalInfo) => {
    return (
      <div className={styles.directoryTableName}>
        {generalInfo.avatar ? (
          <Avatar size="medium" className={styles.avatar} src={generalInfo.avatar} alt="avatar" />
        ) : (
          <Avatar className={styles.avatar_emptySrc} alt="avatar" />
        )}
        <p>{`${generalInfo.firstName} ${generalInfo.lastName}`}</p>
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
    const { isSort } = this.state;
    const columns = [
      {
        title: (
          <div className={styles.directoryTable_fullName}>
            {formatMessage({ id: 'component.directory.table.fullName' })}
            {isSort ? null : <CaretDownOutlined className={styles.directoryTable_iconSort} />}
          </div>
        ),
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo) => (generalInfo ? this.renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) =>
          a.generalInfo && a.generalInfo.firstName
            ? `${a.generalInfo.firstName} ${a.generalInfo.lastName}`.localeCompare(
                `${b.generalInfo.firstName} ${b.generalInfo.lastName}`,
              )
            : null,
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        fixed: 'left',
        width: '18%',
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
      },
      {
        title: formatMessage({ id: 'component.directory.table.email' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        render: (generalInfo) => <span>{generalInfo?.workEmail}</span>,
        width: '18%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => <span>{title ? title.name : ''}</span>,
        width: '12%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => (
          <span className={styles.directoryTable_deparmentText}>
            {department ? department.name : ''}
          </span>
        ),
        width: '14%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        width: '14%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'manager',
        key: 'manager',
        render: (manager) => (
          <span>
            {manager.generalInfo
              ? `${manager.generalInfo.firstName} ${manager.generalInfo.lastName}`
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

    return columns.map((col) => ({
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

  handleProfileEmployee = (row) => {
    const { _id = '', location: { name = '' } = {} } = row;
    history.push({
      pathname: `/directory/employee-profile/${_id}`,
      state: { location: name },
    });
  };

  checkPermissionViewProfile = (permissions) => {
    const viewProfile = 'P_PROFILE_VIEW';
    const findIndexViewProfile = permissions.indexOf(viewProfile);
    return findIndexViewProfile;
  };

  render() {
    const { sortedName = {}, pageSelected, openModal = false, valueReason = '' } = this.state;
    const { list = [], loading, keyTab, loadingTerminateReason } = this.props;
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
            dataSource={list}
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
