import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';

const data = [
  {
    key: '1',
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: 'Aug-7,2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '2',
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: 'Aug-8,2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '3',
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: 'Aug-25,2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '4',
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: 'Jan-7,2020',
    email: 'uuyer@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '5',
    userId: '6456',
    employeeId: 'PSI 2454',
    joinedDate: 'Aug-7,2020',
    email: 'tuasdna@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '6',
    userId: '1235',
    employeeId: 'PSI 1245',
    joinedDate: 'Aug-7,2020',
    email: 'hahahahh@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '7',
    userId: '3453',
    employeeId: 'PSI 4565',
    joinedDate: 'Aug-7,2020',
    email: 'test1@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '8',
    userId: '4444',
    employeeId: 'PSI 4564',
    joinedDate: 'Aug-7,2020',
    email: 'billgates@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '9',
    userId: '5435',
    employeeId: 'PSI 1111',
    joinedDate: 'Aug-7,2020',
    email: 'mark@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '10',
    userId: '2363',
    employeeId: 'PSI 1235',
    joinedDate: 'Aug-7,2020',
    email: 'alibaba@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '11',
    userId: '9785',
    employeeId: 'PSI 7895',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '12',
    userId: '3454',
    employeeId: 'PSI 1112',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '13',
    userId: '7645',
    employeeId: 'PSI 3232',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
];

export default class TableUsers extends PureComponent {
  columns = [
    {
      title: 'User ID',
      render: (text) => <a>{text}</a>,
      dataIndex: 'userId',
      width: '9%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.userId - b.userId,
      },
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      align: 'center',
      width: '10%',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.employeeId.slice(4, a.userId) - b.employeeId.slice(4, b.userId),
      },
    },
    {
      title: 'Joined date',
      dataIndex: 'joinedDate',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '18%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      align: 'center',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      width: '10%',
      align: 'center',
      render: () => (
        <div className={styles.userPasswordReset}>
          <span className={styles.userPassword}>*******</span>
          <div>
            <span onClick={this.resetPassword}>RESET</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '6%',
      align: 'center',
      render: () => (
        <div className={styles.userAction}>
          <UserOutlined onClick={this.editUser} className={styles.editUserBtn} />
          <DeleteOutlined onClick={this.deleteUser} className={styles.deleteUserBtn} />
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
    };
  }

  // user
  deleteUser = () => {
    alert('DELETE USER');
  };

  editUser = () => {
    alert('EDIT USER');
  };

  resetPassword = () => {
    alert('RESET PASSWORD');
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

  onSortChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  render() {
    const { pageSelected } = this.state;
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

    return (
      <div className={styles.tableUsers}>
        <Table
          size="small"
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          onChange={this.onSortChange}
        />
      </div>
    );
  }
}
