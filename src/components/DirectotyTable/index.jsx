import React, { Component } from 'react';
import { history } from 'umi';
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
        <Avatar className={styles.avatar} alt="avatar" />
        <p>{`${generalInfo.firstName} ${generalInfo.lastName}`}</p>
      </div>
    );
  };

  generateColumns = (sortedName) => {
    const columns = [
      {
        title: 'Full Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo) => (generalInfo ? this.renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) =>
          `${a.generalInfo.firstName} ${a.generalInfo.lastName}`.localeCompare(
            `${b.generalInfo.firstName} ${b.generalInfo.lastName}`,
          ),
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        width: '25%',
      },
      {
        title: 'Title',
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
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (department) => <span>{department ? department.name : ''}</span>,
        align: 'left',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        align: 'left',
      },
      {
        title: 'Reporting Manager',
        dataIndex: 'manager',
        key: 'manager',
        render: (manager) => <span>{manager ? manager.name : ''}</span>,
        align: 'left',
      },
      {
        title: 'Employment Type',
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

  handleProfileEmployee = (_id) => {
    history.push(`/directory/employee-profile/${_id}`);
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const { list = [], loading } = this.props;
    const rowSize = 15;
    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };
    return (
      <div className={styles.directoryTable}>
        <Table
          size="medium"
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
          // scroll={{ y: 540, x: 700 }}
        />
      </div>
    );
  }
}

export default DirectoryTable;
