import { Button, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import CommonTable from '../CommonTable';
import EditModal from './components/EditModal';
import styles from './index.less';

@connect(
  ({ loading, adminSetting: { permissionList = [], tempData: { listRoles = [] } = {} } = {} }) => ({
    permissionList,
    listRoles,
    loadingFetchRoleList: loading.effects['adminSetting/fetchRoleList'],
  }),
)
class RolePermission extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRoleID: '',
    };
  }

  fetchRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchRoleList',
    });
  };

  fetchPermissionList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchPermissionList',
      // payload: {
      //   type: 'ADMIN',
      // },
    });
  };

  componentDidMount = () => {
    this.fetchRoleList();
    this.fetchPermissionList();
  };

  handleModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Role ID',
        dataIndex: 'idSync',
        key: 'idSync',
        width: '20%',
        render: (id) => {
          return <span className={styles.roleName}>{id}</span>;
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '35%',
      },
      {
        title: 'Permissions',
        dataIndex: 'permissions',
        key: 'permissions',
        width: '30%',
        render: (permissions = []) => {
          const permissionName = this.getPermissionName(permissions);
          return (
            <div>
              {permissionName.map((name) => (
                <span className={styles.permissionTag}>{name}</span>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => this.onRemoveRole(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>

              <img src={EditIcon} onClick={() => this.onEditRole(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  onEditRole = (row) => {
    this.setState({
      modalVisible: true,
      selectedRoleID: row._id,
    });
  };

  onRemoveRole = async (row) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/removeRole',
      payload: {
        _id: row._id,
      },
    });
    if (res.statusCode === 200) {
      this.fetchRoleList();
    }
  };

  getPermissionName = (permissionList = []) => {
    let res = permissionList.map((item) => {
      return item.module || '';
    });
    res = res.filter((val) => val);
    return [...new Set(res)];
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <Button onClick={() => this.handleModalVisible(true)}>Add Roles & Permission</Button>
      </div>
    );
  };

  render() {
    const { modalVisible, selectedRoleID } = this.state;
    const { listRoles = [], permissionList = [], loadingFetchRoleList = false } = this.props;
    return (
      <div
        className={styles.RolePermission}
        style={listRoles.length === 0 ? {} : { paddingBottom: '0' }}
      >
        {this.renderHeader()}
        <CommonTable
          loading={loadingFetchRoleList}
          columns={this.generateColumns()}
          list={listRoles}
        />
        <EditModal
          visible={modalVisible}
          onClose={() => {
            this.handleModalVisible(false);
            this.setState({
              selectedRoleID: '',
            });
          }}
          permissionList={permissionList}
          onRefresh={this.fetchRoleList}
          selectedRoleID={selectedRoleID}
          action={selectedRoleID ? 'edit' : 'add'}
        />
      </div>
    );
  }
}
export default RolePermission;
