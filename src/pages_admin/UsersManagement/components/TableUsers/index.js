import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
import EditUserModal from '../EditUserModal';
import styles from './index.less';

@connect(({ loading, usersManagement }) => ({
  loadingUserProfile: loading.effects['usersManagement/fetchUserProfile'],
  usersManagement,
}))
class TableUsers extends PureComponent {
  columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      width: '8%',
      align: 'center',
      defaultSortOrder: 'ascend',
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
      render: (text, record) => (
        <div className={styles.userPasswordReset}>
          <span className={styles.userPassword}>*******</span>
          <div>
            <span onClick={(e) => this.resetPassword(record.key, e)}>RESET</span>
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
      render: (text, record) => (
        <div className={styles.userAction}>
          <UserOutlined
            onClick={(e) => this.editUser(record.userId, e)}
            className={styles.editUserBtn}
          />
          <DeleteOutlined
            onClick={(e) => this.deleteUser(record.key, e)}
            className={styles.deleteUserBtn}
          />
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      editModalVisible: false,
      selectedUserId: null,
    };
  }

  closeEditModal = () => {
    this.setState({
      editModalVisible: false,
      selectedUserId: null,
    });
  };

  // user
  deleteUser = (key, e) => {
    // e.preventDefault();
    alert('DELETE USER');
    console.log('DELETE USER', key);
  };

  editUser = (userId, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchUserProfile',
      payload: userId,
    });
    this.setState({
      editModalVisible: true,
      selectedUserId: userId,
    });
  };

  resetPassword = (key, e) => {
    e.preventDefault();
    alert('RESET PASSWORD');
    console.log('RESET PASSWORD', key);
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

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys, editModalVisible, selectedUserId } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
      y: '',
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

    const {
      usersManagement: { listUserProfile = [] },
    } = this.props;

    return (
      <div className={styles.tableUsers}>
        {selectedUserId && editModalVisible && (
          <EditUserModal
            userProfile={listUserProfile}
            editModalVisible={editModalVisible}
            closeEditModal={this.closeEditModal}
          />
        )}

        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          // onChange={this.onSortChange}
        />
      </div>
    );
  }
}
export default TableUsers;
