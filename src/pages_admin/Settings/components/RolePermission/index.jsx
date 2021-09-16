import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CommonTable from '../CommonTable';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import styles from './index.less';
import EditModal from './components/EditModal';

@connect(({ adminSetting: { permissionList = [], tempData: { listRoles = [] } = {} } = {} }) => ({
  permissionList,
  listRoles,
}))
class RolePermission extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  fetchPermissionList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchPermissionList',
      payload: {
        type: 'ADMIN',
      },
    });
  };

  componentDidMount = () => {
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
        title: 'Role',
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
        // dataIndex: 'permissions',
        key: 'permissions',
        width: '30%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <div className={styles.actions}>
              <img src={DeleteIcon} alt="" />
              <img src={EditIcon} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <Button onClick={() => this.handleModalVisible(true)}>Add Roles & Permission</Button>
      </div>
    );
  };

  render() {
    const { modalVisible } = this.state;
    const { listRoles = [], permissionList = [] } = this.props;
    return (
      <div className={styles.RolePermission}>
        {this.renderHeader()}
        <CommonTable columns={this.generateColumns()} list={listRoles} />
        <EditModal
          visible={modalVisible}
          onClose={() => this.handleModalVisible(false)}
          permissionList={permissionList}
        />
      </div>
    );
  }
}
export default RolePermission;
