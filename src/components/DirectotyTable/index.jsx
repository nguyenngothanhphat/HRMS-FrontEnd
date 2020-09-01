import React, { Component } from 'react';
import { Table, Avatar } from 'antd';
import styles from './index.less';

class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderUser = (record) => {
    console.log('record', record);
    return (
      <div className={styles.directoryTableName}>
        <Avatar className={styles.avatar} alt="avatar" />
        <p>{record}</p>
      </div>
    );
  };

  generateColumns = (sortedName) => {
    const columns = [
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        render: (fullName) => this.renderUser(fullName),
        align: 'center',
        sorter: (a, b) => a.fullName.length - b.fullName.length,
        sortOrder: sortedName.columnKey === 'fullName' && sortedName.order,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        align: 'center',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        align: 'center',
      },
      {
        title: 'Reporting Manager',
        dataIndex: 'reportingManager',
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

  render() {
    const { sortedName = {} } = this.state;
    const data = [
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '1',
        fullName: 'John Brown',
        title: 98,
        department: 60,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '2',
        fullName: 'Jim Green',
        title: 98,
        department: 66,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '3',
        fullName: 'Joe Black',
        title: 98,
        department: 90,
        location: 70,
        reportingManager: 'xxxxxxxxx',
      },
      {
        key: '4',
        fullName: 'Jim Red',
        title: 88,
        department: 99,
        location: 89,
        reportingManager: 'xxxxxxxxx',
      },
    ];
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`,
      pageSize: 20,
      defaultCurrent: 1,
    };
    return (
      <div className={styles.directoryTable}>
        <Table
          size="medium"
          columns={this.generateColumns(sortedName)}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}

export default DirectoryTable;
