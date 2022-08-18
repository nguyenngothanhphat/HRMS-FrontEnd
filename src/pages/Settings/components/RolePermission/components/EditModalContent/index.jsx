import { Form, Input, Spin, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    loadingFetchRoleByID = false,
    viewingRole: {
      name: nameProp = '',
      description: descriptionProp = '',
      idSync: idSyncProp = '',
    } = {},
    viewingRole = {},
    dispatch,
    selectedRoleID = '',
    onRefresh = () => {},
    onClose = () => {},
    permissionList = [],
    visible = false,
  } = props;

  const [selectedList, setSelectedList] = useState([]);
  const [roleNameState, setRoleNameState] = useState('');

  const setList = (list) => {
    setSelectedList(list);
  };

  const fetchRoleByID = (id) => {
    dispatch({
      type: 'adminSetting/fetchRoleByID',
      payload: {
        id,
      },
    });
  };

  useEffect(() => {
    if (selectedRoleID && visible) {
      fetchRoleByID(selectedRoleID);
    }
  }, [selectedRoleID]);

  useEffect(() => {
    return () => {
      setList([]);
    };
  }, []);

  useEffect(() => {
    setSelectedList(viewingRole?.permissions);
    form.setFieldsValue({
      name: nameProp,
      description: descriptionProp,
      idSync: idSyncProp,
    });
  }, [JSON.stringify(viewingRole)]);

  const handleDone = () => {
    form.resetFields();
    setList([]);
    onClose();
  };

  const onFinish = async (values) => {
    const { idSync = '', name = '', description = '' } = values;

    const addRole = async () => {
      const res = await dispatch({
        type: 'adminSetting/addRole',
        payload: {
          idSync,
          name,
          description,
          permissions: selectedList,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };
    const editRole = async () => {
      const res = await dispatch({
        type: 'adminSetting/updateRole',
        payload: {
          _id: selectedRoleID,
          name,
          idSync,
          description,
          permissions: selectedList,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };

    const { action = '' } = props;
    if (action === 'add') {
      addRole();
    }
    if (action === 'edit') {
      editRole();
    }
  };

  const renderList = () => {
    let formatList = permissionList.map((per) => per?.module);
    formatList = formatList.filter(
      (value) => value !== undefined && value !== '' && value !== null,
    );
    formatList = [...new Set(formatList)];
    const treeData = formatList.map((moduleName, index) => {
      let result = permissionList.map((per) => {
        const { _id = '', name = '', module = '' } = per;
        if (moduleName === module) {
          return {
            title: name,
            key: _id,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);

      return {
        key: index,
        title: moduleName,
        children: result,
      };
    });
    const onCheck = (checkedKeys) => {
      setList(checkedKeys);
    };

    return (
      <>
        <span className={styles.permissionTitle}>Permission</span>
        <div className={styles.roleList}>
          <Tree
            checkable
            defaultExpandAll={false}
            // onSelect={onSelect}
            onCheck={onCheck}
            checkedKeys={selectedList}
            treeData={treeData}
            showLine={{ showLeafIcon: false }}
            showIcon={false}
          />
        </div>
      </>
    );
  };

  const onRoleNameChange = (e) => {
    const re = /^[A-Za-z][A-Za-z0-9]*$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setRoleNameState(e.target.value);
    }
  };

  return (
    <>
      <div className={styles.EditModalContent}>
        <Spin spinning={loadingFetchRoleByID}>
          <Form name="basic" form={form} id="myForm" onFinish={onFinish}>
            <Form.Item
              label="Role ID"
              name="idSync"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please enter the role ID!' }]}
            >
              <Input
                // disabled={action === 'edit'}
                placeholder="Role ID"
                // eslint-disable-next-line no-return-assign
                onInput={(e) =>
                  (e.target.value = `${e.target.value}`.toUpperCase().replace(/ /g, ''))}
              />
            </Form.Item>

            <Form.Item
              rules={[{ required: true, message: 'Please enter the role name!' }]}
              label="Role Name"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input value={roleNameState} placeholder="Role Name" onChange={onRoleNameChange} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please enter the role description!' }]}
            >
              <Input placeholder="Role Description" />
            </Form.Item>
            {renderList()}
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default connect(
  ({ loading, adminSetting: { viewingRole = {}, tempData: { listRoles = [] } = {} } = {} }) => ({
    listRoles,
    viewingRole,
    loadingFetchRoleList: loading.effects['adminSetting/fetchRoleList'],
    loadingFetchRoleByID: loading.effects['adminSetting/fetchRoleByID'],
  }),
)(EditModalContent);
