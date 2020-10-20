import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
import EditUserModal from '../EditUserModal';
import ConfirmRemoveModal from '../ConfirmRemoveModal';
import ResetPasswordModal from '../ResetPasswordModal';
import styles from './index.less';

@connect(({ loading, employeesManagement }) => ({
  loadingUserProfile: loading.effects['employeesManagement/fetchEmployeeDetail'],
  employeesManagement,
}))
class TableUsers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      editModalVisible: false,
      deleteConfirmModalVisible: false,
      resetPasswordModalVisible: false,
      selectedUserId: null,
    };
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'User ID',
        dataIndex: 'userId',
        width: '8%',
        align: 'left',
        // defaultSortOrder: 'ascend',
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.userId - b.userId,
        // },
        render: () => <span>User ID</span>,
      },
      {
        title: 'Employee ID',
        dataIndex: 'generalInfo',
        align: 'left',
        width: '10%',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.employeeId.slice(4, a.userId) - b.employeeId.slice(4, b.userId),
        // },
      },
      {
        title: 'Joined date',
        dataIndex: 'joinedDate',
        width: '10%',
        align: 'left',
        render: () => <span>Joined date</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
        // },
      },
      {
        title: 'Email',
        dataIndex: 'generalInfo',
        width: '18%',
        align: 'left',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.workEmail : ''}</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.email.localeCompare(b.email),
        // },
      },
      {
        title: 'Full name',
        dataIndex: 'generalInfo',
        align: 'left',
        render: (generalInfo) =>
          generalInfo ? <span>{`${generalInfo.firstName} ${generalInfo.lastName}`}</span> : '',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        align: 'left',
        render: () => <span>Role</span>,
      },
      {
        title: 'Location',
        dataIndex: 'location',
        align: 'left',
        render: (location) => <span>{location ? location.name : ''}</span>,
      },
      {
        title: 'Company',
        dataIndex: 'company',
        align: 'left',
        render: (company) => <span>{company ? company.name : ''}</span>,
      },
      {
        title: 'Password',
        dataIndex: '_id',
        width: '10%',
        align: 'left',
        render: (_id) => (
          <div className={styles.userPasswordReset}>
            <span className={styles.userPassword}>*******</span>
            <div onClick={(e) => this.resetPassword(_id, e)}>
              <span>RESET</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'left',
        render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
      },
      {
        title: 'Action',
        dataIndex: '_id',
        width: '6%',
        align: 'left',
        render: (_id) => (
          <div className={styles.userAction}>
            <UserOutlined onClick={(e) => this.editUser(_id, e)} className={styles.editUserBtn} />
            <DeleteOutlined
              onClick={(e) => this.deleteUser(_id, e)}
              className={styles.deleteUserBtn}
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

  editUser = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchEmployeeDetail',
      id: record,
    });
    this.setState({
      editModalVisible: true,
      selectedUserId: record,
    });
  };

  closeEditModal = () => {
    this.setState({
      editModalVisible: false,
      selectedUserId: null,
    });
  };

  // delete user
  deleteUser = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchEmployeeDetail',
      id: record,
    });
    this.setState({
      selectedUserId: record,
      deleteConfirmModalVisible: true,
    });
  };

  closeConfirmRemoveModal = () => {
    this.setState({
      selectedUserId: null,
      deleteConfirmModalVisible: false,
    });
  };

  resetPassword = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchEmployeeDetail',
      id: record,
    });
    this.setState({
      selectedUserId: record,
      resetPasswordModalVisible: true,
    });
  };

  closeResetPasswordModal = () => {
    this.setState({
      selectedUserId: null,
      resetPasswordModalVisible: false,
    });
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
    // eslint-disable-next-line no-console
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading, loadingUserProfile } = this.props;
    // console.log('data', data);
    const {
      pageSelected,
      selectedRowKeys,
      editModalVisible,
      deleteConfirmModalVisible,
      resetPasswordModalVisible,
      selectedUserId,
    } = this.state;
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
      employeesManagement: { employeeDetail = [] },
    } = this.props;

    return (
      <div className={styles.tableUsers}>
        {!loadingUserProfile && selectedUserId && editModalVisible && (
          <EditUserModal
            user={employeeDetail}
            editModalVisible={editModalVisible}
            closeEditModal={this.closeEditModal}
          />
        )}
        {!loadingUserProfile && selectedUserId && deleteConfirmModalVisible && (
          <ConfirmRemoveModal
            user={employeeDetail}
            titleModal="Remove User Confirm"
            visible={deleteConfirmModalVisible}
            handleCancel={this.closeConfirmRemoveModal}
          />
        )}
        {!loadingUserProfile && selectedUserId && resetPasswordModalVisible && (
          <ResetPasswordModal
            user={employeeDetail}
            titleModal="Reset Password"
            visible={resetPasswordModalVisible}
            handleCancel={this.closeResetPasswordModal}
          />
        )}
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record._id}
          // onChange={this.onSortChange}
        />
      </div>
    );
  }
}
export default TableUsers;
