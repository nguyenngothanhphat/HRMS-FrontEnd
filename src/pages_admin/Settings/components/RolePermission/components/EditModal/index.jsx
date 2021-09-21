import { Button, Form, Input, Modal, Skeleton, Tree } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({ loading, adminSetting: { viewingRole = {}, tempData: { listRoles = [] } = {} } = {} }) => ({
    listRoles,
    viewingRole,
    loadingFetchRoleList: loading.effects['adminSetting/fetchRoleList'],
    loadingFetchRoleByID: loading.effects['adminSetting/fetchRoleByID'],
    loadingAddRole: loading.effects['adminSetting/addRole'],
    loadingUpdateRole: loading.effects['adminSetting/updateRole'],
  }),
)
class EditModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
      roleNameState: '',
    };
  }

  setList = (list) => {
    this.setState({
      selectedList: list,
    });
  };

  componentDidMount = async () => {};

  componentDidUpdate = (prevProps) => {
    const { selectedRoleID = '' } = this.props;

    if (selectedRoleID && selectedRoleID !== prevProps.selectedRoleID) {
      this.fetchRoleByID(selectedRoleID);
    }
  };

  fetchRoleByID = async (id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/fetchRoleByID',
      payload: {
        id,
      },
    });
    if (res.statusCode === 200) {
      this.setState({ selectedList: res.data?.permissions });
    }
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add New Roles & Permission';
    if (action === 'edit') {
      title = 'Edit New Roles & Permission';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const { dispatch, selectedRoleID = '', onRefresh = () => {} } = this.props;
    const { name = '', description = '' } = values;
    const { selectedList } = this.state;

    const addRole = async () => {
      const res = await dispatch({
        type: 'adminSetting/addRole',
        payload: {
          idSync: name,
          name,
          description,
          permissions: selectedList,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };
    const editRole = async () => {
      const res = await dispatch({
        type: 'adminSetting/updateRole',
        payload: {
          _id: selectedRoleID,
          name,
          description,
          permissions: selectedList,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };

    const { action = '' } = this.props;
    if (action === 'add') {
      addRole();
    }
    if (action === 'edit') {
      editRole();
    }
  };

  handleCancel = () => {
    const { dispatch, onClose = () => {} } = this.props;
    this.formRef.current.resetFields();
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingRole: {},
      },
    });

    onClose(false);
  };

  renderList = () => {
    const { permissionList = [] } = this.props;
    // const filterFunction = (text) => {
    //   return permissionList
    //     .filter((item) => Object.keys(item).some((k) => item[k].includes(text)))
    //     .map((item) => {
    //       return { ...item, key: item._id, title: item.name };
    //     });
    // };
    // const getListDIRECTORY = filterFunction('P_DIRECTORY');
    // const getListUser = filterFunction('P_USERS');
    // const getListEmployees = filterFunction('P_EMPLOYEES');
    // const getProfileEmployees = filterFunction('P_PROFILE');
    // const getListOnBoarding = filterFunction('P_ONBOARDING');
    // const getListSETTING = filterFunction('P_SETTINGS');

    // const newData = [
    //   {
    //     key: 1,
    //     title: 'DIRECTORY',
    //     children: getListDIRECTORY,
    //   },
    //   {
    //     key: 2,
    //     title: 'USER',
    //     children: getListUser,
    //   },
    //   {
    //     key: 3,
    //     title: 'EMPLOYEES',

    //     children: getListEmployees,
    //   },
    //   {
    //     key: 4,
    //     title: 'PROFILE',

    //     children: getProfileEmployees,
    //   },
    //   {
    //     key: 5,
    //     title: 'ONBOARDING',

    //     children: getListOnBoarding,
    //   },
    //   {
    //     key: 6,
    //     title: 'SETTING',

    //     children: getListSETTING,
    //   },
    // ];

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
      this.setList(checkedKeys);
    };

    const { selectedList } = this.state;

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

  onRoleNameChange = (e) => {
    const re = /^[A-Za-z][A-Za-z0-9]*$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({ roleNameState: e.target.value });
    }
  };

  render() {
    const {
      visible = false,
      action = '',
      // listRoles = [],
      // loadingFetchRoleList = false,
      loadingFetchRoleByID = false,
      loadingUpdateRole = false,
      loadingAddRole = false,
      viewingRole: { name: nameProp = '', description: descriptionProp = '' } = {},
    } = this.props;

    const { roleNameState } = this.state;

    return (
      <>
        <Modal
          className={styles.EditModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              loading={loadingUpdateRole || loadingAddRole}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          {loadingFetchRoleByID ? (
            <Skeleton />
          ) : (
            <Form
              name="basic"
              ref={this.formRef}
              id="myForm"
              onFinish={this.onFinish}
              initialValues={{
                name: nameProp,
                description: descriptionProp,
              }}
            >
              <Form.Item
                rules={[{ required: true, message: 'Please enter role name!' }]}
                label="Role"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input
                  value={roleNameState}
                  placeholder="Role Name"
                  onChange={this.onRoleNameChange}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter role description!' }]}
              >
                <Input placeholder="Role Description" />
              </Form.Item>
              {this.renderList()}
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
