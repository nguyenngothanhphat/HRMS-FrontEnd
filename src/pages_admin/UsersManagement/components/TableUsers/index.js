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

const roleTags = [
  { name: 'ADMIN-CLA', color: 'magenta' },
  { name: 'CANDIDATE', color: 'gold' },
  { name: 'CUSTOMER', color: 'orange' },
  { name: 'EMPLOYEE', color: 'blue' },
  { name: 'HR', color: 'green' },
  { name: 'ADMIN-CDA', color: 'lime' },
  { name: 'LEADER', color: 'red' },
  { name: 'HR-MANAGER', color: 'volcano' },
  { name: 'HR-GLOBAL', color: 'cyan' },
  { name: 'MANAGER', color: 'geekblue' },
];

@connect(({ usersManagement }) => ({
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
        width: '9%',
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
        dataIndex: 'roles',
        align: 'left',
        render: (roles = []) => {
          return roles.map((role) => {
            const tag = roleTags.find((d) => d.name === role) || {};
            return (
              <Tag className={styles.roleTags} color={tag.color || 'purple'}>
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
        dataIndex: 'userIndentity',
        width: '10%',
        align: 'left',
        render: (userIndentity) => (
          <div className={styles.userPasswordReset}>
            {/* <span className={styles.userPassword}>*******</span> */}
            <div onClick={(e) => this.resetPassword(userIndentity, e)}>
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
        dataIndex: 'userIndentity',
        width: '6%',
        align: 'center',
        fixed: 'right',
        render: (userIndentity) => (
          <div className={styles.userAction}>
            <img
              src={EditUserIcon}
              alt="edit-user"
              onClick={(e) => this.editUser(userIndentity, e)}
              className={styles.editUserBtn}
            />
            <img
              src={DeleteUserIcon}
              alt="delete-user"
              onClick={(e) => this.deleteUser(userIndentity, e)}
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
    this.setState({
      editModalVisible: true,
    });
    this.saveSelectedUserState(record._id, record.tenant);
  };

  closeEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
    this.clearSelectedUserState();
    this.refreshList();
  };

  // delete user
  deleteUser = (record) => {
    this.setState({
      deleteConfirmModalVisible: true,
    });
    this.saveSelectedUserState(record._id, record.tenant);
  };

  closeConfirmRemoveModal = () => {
    this.setState({
      deleteConfirmModalVisible: false,
    });
    this.clearSelectedUserState();
    this.refreshList();
  };

  resetPassword = (record) => {
    this.setState({
      resetPasswordModalVisible: true,
    });
    this.saveSelectedUserState(record._id, record.tenant);
  };

  closeResetPasswordModal = () => {
    this.setState({
      resetPasswordModalVisible: false,
    });
    this.clearSelectedUserState();
    this.refreshList();
  };

  saveSelectedUserState = async (id, tenant) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'usersManagement/save',
      payload: {
        selectedUserId: id,
        selectedUserTenant: tenant,
      },
    });
  };

  clearSelectedUserState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/save',
      payload: {
        selectedUserId: '',
        selectedUserTenant: '',
      },
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
    this.setState({ selectedRowKeys });
  };

  formatData = (data) => {
    return data.map((value) => {
      return {
        ...value,
        userIndentity: {
          _id: value._id,
          tenant: value.tenant,
        },
        roles: value.managePermission?.roles || [],
      };
    });
  };

  refreshList = () => {
    const { getTableData = () => {}, tabId = 1 } = this.props;
    getTableData({}, tabId);
  };

  render() {
    const { data = [], loading } = this.props;
    const newData = this.formatData(data);

    const {
      pageSelected,
      selectedRowKeys,
      editModalVisible,
      deleteConfirmModalVisible,
      resetPasswordModalVisible,
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
      usersManagement: { employeeDetail: { generalInfo: { workEmail = '' } = {} } = {} },
    } = this.props;

    return (
      <div className={styles.tableUsers}>
        <EditUserModal editModalVisible={editModalVisible} closeEditModal={this.closeEditModal} />

        <ConfirmRemoveModal
          titleModal="Remove User Confirm"
          visible={deleteConfirmModalVisible}
          handleCancel={this.closeConfirmRemoveModal}
        />

        <ResetPasswordModal
          workEmail={workEmail}
          titleModal="Reset Password"
          visible={resetPasswordModalVisible}
          handleCancel={this.closeResetPasswordModal}
        />
        <Table
          size="middle"
          loading={loading}
          rowSelection={rowSelection}
          // onRow={(record) => {
          //   return {
          //     onClick: () => this.editUser(record.userIndentity), // click row
          //   };
          // }}
          pagination={{ ...pagination, total: newData.length }}
          columns={this.generateColumns()}
          dataSource={newData}
          scroll={scroll}
          rowKey={(record) => record._id}
          // onChange={this.onSortChange}
        />
      </div>
    );
  }
}
export default TableUsers;
