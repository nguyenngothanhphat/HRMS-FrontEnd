import { Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import EditIcon from '@/assets/adminSetting/edit.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomBlueButton from '@/components/CustomBlueButton';
import EditModalContent from './components/EditModalContent';
import styles from './index.less';

const RolePermission = (props) => {
  const {
    dispatch,
    listRoles = [],
    permissionList = [],
    loadingFetchRoleList = false,
    loadingAddRole = false,
    loadingUpdateRole = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedRoleID, setSelectedRoleID] = useState('');

  const fetchRoleList = () => {
    dispatch({
      type: 'adminSetting/fetchRoleList',
    });
  };

  const fetchPermissionList = () => {
    dispatch({
      type: 'adminSetting/fetchPermissionList',
    });
  };

  useEffect(() => {
    fetchRoleList();
    fetchPermissionList();
  }, []);

  const getPermissionName = (arr = []) => {
    let res = arr.map((item) => {
      return item.module || '';
    });
    res = res.filter((val) => val);
    return [...new Set(res)];
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <CustomBlueButton onClick={() => setVisible(true)}>Add Roles & Permission</CustomBlueButton>
      </div>
    );
  };

  const onEditRole = (row) => {
    setVisible(true);
    setSelectedRoleID(row._id);
  };

  const onRemoveRole = async (row) => {
    const res = await dispatch({
      type: 'adminSetting/removeRole',
      payload: {
        _id: row._id,
      },
    });
    if (res.statusCode === 200) {
      fetchRoleList();
    }
  };

  const generateColumns = () => {
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
          const permissionName = getPermissionName(permissions);
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
              <Popconfirm title="Sure to remove?" onConfirm={() => onRemoveRole(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>

              <img src={EditIcon} onClick={() => onEditRole(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const onCloseModal = () => {
    setVisible(false);
    setSelectedRoleID('');
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingRole: {},
      },
    });
  };

  return (
    <div className={styles.RolePermission}>
      {renderHeader()}
      <CommonTable loading={loadingFetchRoleList} columns={generateColumns()} list={listRoles} />
      <CommonModal
        visible={visible}
        title={`${selectedRoleID ? 'Edit' : 'Add New'} Role & Permissions`}
        onClose={onCloseModal}
        width={550}
        loading={loadingAddRole || loadingUpdateRole}
        content={
          <EditModalContent
            visible={visible}
            onClose={onCloseModal}
            permissionList={permissionList}
            onRefresh={fetchRoleList}
            selectedRoleID={selectedRoleID}
            action={selectedRoleID ? 'edit' : 'add'}
          />
        }
      />
    </div>
  );
};
export default connect(
  ({ loading, adminSetting: { permissionList = [], tempData: { listRoles = [] } = {} } = {} }) => ({
    permissionList,
    listRoles,
    loadingFetchRoleList: loading.effects['adminSetting/fetchRoleList'],
    loadingAddRole: loading.effects['adminSetting/addRole'],
    loadingUpdateRole: loading.effects['adminSetting/updateRole'],
  }),
)(RolePermission);
