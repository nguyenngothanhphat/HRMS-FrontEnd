import React, { Component } from 'react';
import { history } from 'umi';
import { Table, Avatar } from 'antd';
import styles from './index.less';

class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedName: {},
    };
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
        align: 'center',
        sorter: (a, b) => a.generalInfo.fullName.localeCompare(b.generalInfo.fullName),
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        width: '30%',
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
        align: 'center',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        render: (department) => <span>{department ? department.name : ''}</span>,
        align: 'center',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        align: 'center',
      },
      {
        title: 'Reporting Manager',
        dataIndex: 'manager',
        render: (manager) => <span>{manager ? manager.name : ''}</span>,
        align: 'center',
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

  handleProfileEmployee = () => {
    history.push('/directory/employee-profile/0001');
  };

  render() {
    const { sortedName = {} } = this.state;
    const { list = [] } = this.props;

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
          onRow={() => {
            return {
              onClick: () => this.handleProfileEmployee(), // click row
            };
          }}
          dataSource={list}
          pagination={list.length > 10 ? pagination : false}
          onChange={this.handleChangeTable}
          scroll={{ y: 540 }}
        />
      </div>
    );
  }
}

export default DirectoryTable;
