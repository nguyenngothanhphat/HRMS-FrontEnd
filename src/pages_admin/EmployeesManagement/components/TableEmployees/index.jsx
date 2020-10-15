import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, history } from 'umi';
import ModalConfirmRemove from '../ModalConfirmRemove';
import styles from './index.less';

export default class TableEmployees extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
    };
  }

  generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'pages_admin.employees.table.userID' }),
        dataIndex: 'userId',
        width: '8%',
        align: 'left',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: {
          compare: (a, b) => a.userId - b.userId,
        },
        render: () => <span>User ID</span>,
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        align: 'left',
        width: '10%',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.employees.table.joinedDate' }),
        dataIndex: 'joinedDate',
        width: '10%',
        align: 'left',
        render: () => <span>Aug-7,20</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.employees.table.email' }),
        dataIndex: 'generalInfo',
        width: '15%',
        align: 'center',
        render: (generalInfo) => (
          <span>{generalInfo && generalInfo.workEmail ? generalInfo.workEmail : ''}</span>
        ),
      },
      {
        title: formatMessage({ id: 'component.directory.table.fullName' }),
        dataIndex: 'generalInfo',
        align: 'center',
        render: (generalInfo) =>
          generalInfo ? <span>{`${generalInfo.firstName} ${generalInfo.lastName}`}</span> : '',
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        align: 'left',
      },
      {
        title: 'Job Title',
        dataIndex: 'title',
        // width: '10%',
        align: 'center',
        render: (title) => <span>{title ? title.name : ''}</span>,
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
        // align: 'left',
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
        // align: 'left',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'employeeType',
        key: 'employmentType',
        render: (employeeType) => <span>{employeeType ? employeeType.name : ''}</span>,
        // align: 'left',
        width: '10%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: '5%',
        align: 'center',
        render: () => (
          <div className={styles.employeesAction}>
            <img
              src="assets/images/remove.svg"
              alt="removeIcon"
              onClick={(e) => this.deleteEmployee(e)}
              width="15px"
            />
          </div>
        ),
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  deleteEmployee = (e) => {
    e.stopPropagation();
    this.openModal();
  };

  editUser = (key, e) => {
    e.preventDefault();
    alert('EDIT USER', key);
  };

  // pagination
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

  // onSortChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handleProfileEmployee = (_id) => {
    history.push(`/employees/employee-profile/${_id}`);
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys, visible } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
      y: 'max-content',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
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

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.tableEmployees}>
        <Table
          size="small"
          loading={loading}
          onRow={(record) => {
            return {
              onClick: () => this.handleProfileEmployee(record._id), // click row
            };
          }}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record._id}
          // onChange={this.onSortChange}
        />
        <ModalConfirmRemove
          titleModal="Confirm Remove Employee"
          visible={visible}
          handleCancel={this.handleCancel}
          getResponse={this.getResponse}
        />
      </div>
    );
  }
}
