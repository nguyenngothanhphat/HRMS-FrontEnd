import React, { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import { formatMessage, connect } from 'umi';
import EditUserIcon from '@/assets/admin_iconedit.svg';
import DeleteUserIcon from '@/assets/admin_icondelete.svg';
import moment from 'moment';
import EditUserModal from '../EditUserModal';
import ConfirmRemoveModal from '../ConfirmRemoveModal';
import ResetPasswordModal from '../ResetPasswordModal';
import styles from './index.less';

@connect(({ loading, usersManagement }) => ({
  loadingUserProfile: loading.effects['employeesManagement/fetchEmployeeDetail'],
  usersManagement,
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

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setFirstPage();
    }
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/ClearFilter',
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Full name',
        dataIndex: 'generalInfo',
        align: 'left',
        fixed: 'left',
        render: (generalInfo) =>
          generalInfo ? (
            <span className={styles.fullname}>
              {`${generalInfo.firstName} ${generalInfo.lastName}`}
            </span>
          ) : (
            ''
          ),
        sorter: {
          compare: (a, b) => a.generalInfo.firstName.localeCompare(b.generalInfo.firstName),
        },
      },
      {
        title: 'Employee ID',
        dataIndex: 'generalInfo',
        align: 'left',
        width: '10%',
        className: `${styles.employeeId}`,
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) =>
        //     a.generalInfo.employeeId.slice(4, a.generalInfo.employeeId) -
        //     b.generalInfo.employeeId.slice(4, b.generalInfo.employeeId),
        // },
      },
      {
        title: 'Created date',
        dataIndex: 'joinDate',
        // width: '8%',
        align: 'left',
        render: (joinDate) =>
          joinDate ? <span>{moment(joinDate).locale('en').format('MM.DD.YY')}</span> : '',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: {
          compare: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
        },
      },
      {
        title: 'Email',
        dataIndex: 'generalInfo',
        width: '17%',
        align: 'left',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.workEmail : ''}</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        // compare: (a, b) => a.workEmail && b.workEmail && a.workEmail.localeCompare(b.workEmail),
        // },
      },
      {
        title: 'Role',
        dataIndex: 'user',
        align: 'left',
        render: (user = {}) => {
          const { roles = [] } = user;
          return roles.map((role) => {
            const color = 'geekblue';
            return (
              <Tag className={styles.roleTags} color={color}>
                {role.toUpperCase()}
              </Tag>
            );
          });
        },
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
        width: '10%',
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
            {/* <span className={styles.userPassword}>*******</span> */}
            <div onClick={(e) => this.resetPassword(_id, e)}>
              <span>RESET</span>
            </div>
          </div>
        ),
      },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   align: 'left',
      //   render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
      // },
      {
        title: 'Action',
        dataIndex: '_id',
        width: '6%',
        align: 'center',
        render: (_id) => (
          <div className={styles.userAction}>
            <img
              src={EditUserIcon}
              alt="edit-user"
              onClick={(e) => this.editUser(_id, e)}
              className={styles.editUserBtn}
            />
            <img
              src={DeleteUserIcon}
              alt="delete-user"
              onClick={(e) => this.deleteUser(_id, e)}
              className={styles.editUserBtn}
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
      type: 'usersManagement/fetchEmployeeDetail',
      id: record,
    }).then(() => {
      this.setState({
        editModalVisible: true,
        selectedUserId: record,
      });
    });
  };

  closeEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
    setTimeout(() => {
      this.setState({
        selectedUserId: null,
      });
    }, 500);
  };

  // delete user
  deleteUser = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchEmployeeDetail',
      id: record,
    }).then(() => {
      this.setState({
        selectedUserId: record,
        deleteConfirmModalVisible: true,
      });
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
      type: 'usersManagement/fetchEmployeeDetail',
      id: record,
    }).then(() => {
      this.setState({
        selectedUserId: record,
        resetPasswordModalVisible: true,
      });
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
      usersManagement: {
        employeeDetail = [],
        employeeDetail: { generalInfo: { workEmail = '' } = {} } = {},
      },
    } = this.props;

    return (
      <div className={styles.tableUsers}>
        {!loadingUserProfile && selectedUserId && (
          <EditUserModal
            user={employeeDetail}
            editModalVisible={editModalVisible}
            closeEditModal={this.closeEditModal}
          />
        )}
        {!loadingUserProfile && selectedUserId && (
          <ConfirmRemoveModal
            user={employeeDetail}
            titleModal="Remove User Confirm"
            visible={deleteConfirmModalVisible}
            handleCancel={this.closeConfirmRemoveModal}
          />
        )}
        <ResetPasswordModal
          workEmail={workEmail}
          titleModal="Reset Password"
          visible={resetPasswordModalVisible}
          handleCancel={this.closeResetPasswordModal}
        />
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
