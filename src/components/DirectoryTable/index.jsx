import React, { Component } from 'react';
import { history, formatMessage } from 'umi';
import { Table, Avatar } from 'antd';
import styles from './index.less';

class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedName: {},
      pageSelected: 1,
    };
  }

  componentDidUpdate(prevProps) {
    const { list } = this.props;
    if (prevProps.list.length !== list.length) {
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

  generateColumns = (sortedName) => {
    const columns = [
      {
        title: formatMessage({ id: 'component.directory.table.fullName' }),
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo) => (generalInfo ? this.renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) =>
          `${a.generalInfo.firstName} ${a.generalInfo.lastName}`.localeCompare(
            `${b.generalInfo.firstName} ${b.generalInfo.lastName}`,
          ),
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        fixed: 'left',
        width: '18%',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        align: 'center',
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'compensation',
        key: 'compensation',
        render: (compensation) => (
          <span>
            {compensation && Object.prototype.hasOwnProperty.call(compensation, 'tittle')
              ? compensation.tittle.name
              : ''}
          </span>
        ),
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
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'manager',
        key: 'manager',
        render: (manager) => <span>{manager ? manager.name : ''}</span>,
        align: 'left',
        width: '15%',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'compensation',
        key: 'employmentType',
        render: (compensation) => (
          <span>
            {compensation && compensation.employeeType ? compensation.employeeType.name : ''}
          </span>
        ),
        align: 'left',
        width: '15%',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedName: sorter,
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

  handleProfileEmployee = () => {
    history.push('/directory/employee-profile/0001');
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const { list = [], loading } = this.props;
    const rowSize = 10;
    const pagination = {
      position: ['bottomRight'],
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
    return (
      <div className={styles.directoryTable}>
        <Table
          size="small"
          columns={this.generateColumns(sortedName)}
          onRow={(record) => {
            return {
              onClick: () => this.handleProfileEmployee(record._id), // click row
            };
          }}
          dataSource={list}
          rowKey={(record) => record._id}
          // pagination={{ ...pagination, total: list.length }}
          pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          loading={loading}
          onChange={this.handleChangeTable}
          scroll={{ x: 1000, y: 'max-content' }}
        />
      </div>
    );
  }
}

export default DirectoryTable;
