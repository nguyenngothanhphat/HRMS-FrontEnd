import React, { Component } from 'react';
import { Link, NavLink, history } from 'umi';
import { Table, Avatar, Pagination } from 'antd';
import styles from './index.less';

class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedName: {}
    };
  }

  renderUser = (generalInfo) => {
    console.log('record', generalInfo);
    return (
      <div className={styles.directoryTableName}>
        <Avatar className={styles.avatar} alt="avatar" />
        <p>{generalInfo.fullName}</p>
      </div>
    );
  };

  generateColumns = (sortedName) => {
    const columns = [
      {
        title: 'Full Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo) => this.renderUser(generalInfo),
        align: 'center',
        sorter: (a, b) => a.generalInfo.fullName.localeCompare(b.generalInfo.fullName),
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        width: '30%'
      },
      { 
        title: 'Title',
        dataIndex: 'compensation',
        key: 'compensation',
        render: (compensation) => <span>{compensation.title}</span>,
        align: 'center',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        render: (department) => <span>{department.name}</span>,
        align: 'center',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        render: (location) => <span>{location.name}</span>,
        align: 'center',
      },
      {
        title: 'Reporting Manager',
        dataIndex: 'manager',
        render: (manager) => <span>{manager.name}</span>,
        align: 'center',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    console.log('handleChange');
    this.setState({
      sortedName: sorter
    });
  };

  handleProfileEmployee = () => {
    history.push('/directory/employee-profile/0001">Link to profile employee 0001');
  }

  render() {
    const { sortedName = {} } = this.state;
    const {
      list = [],
      pagination: paginationProps,
    } = this.props;

    console.log(this.props);

    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`,
      pageSize: 20,
      defaultCurrent: 1,
    };
    return (
      <div className={styles.directoryTable}>
        <Table
          size="medium"
          columns={this.generateColumns(sortedName)}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => this.handleProfileEmployee() // click row
            };
          }}
          dataSource={list}
          pagination={paginationProps === false ? false : pagination}
          onChange={this.handleChangeTable}
          scroll={{ y: 702 }}
        />
      </div>
    );
  }
}

export default DirectoryTable;
