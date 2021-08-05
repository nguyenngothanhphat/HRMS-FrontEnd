import { DeleteOutlined, DropboxOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table, Spin, Popconfirm, message } from 'antd';
import { history, connect } from 'umi';
import React, { PureComponent } from 'react';
import styles from './index.less';

@connect(({ loading, adminSetting: { tempData: { formatData = [] } = {} } = {} }) => ({
  loading: loading.effects['adminSetting/fetchListRoles'],
  formatData,
}))
class RolesPermission extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      roleId: '',
      roleValue: '',
    };
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleClickDelete = async (_id, roleId) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const res = await dispatch({
      type: 'adminSetting/removeRole',
      payload: { _id },
    });
    if (res.statusCode === 200) {
      this.setState({
        selectedRowKeys: selectedRowKeys.filter((val) => val !== roleId),
      });
    }
  };

  handleChangeInput = (e, type) => {
    const { value } = e.target;
    this.setState({
      [type]: type === 'roleId' ? value.toUpperCase().replace(/\s/g, '') : value,
    });
  };

  handleRandomNumberID = () => {
    const min = 1;
    const max = 100;
    const randomNumber = min + Math.trunc(Math.random() * (max - min));
    if (randomNumber === min + Math.trunc(Math.random() * (max - min))) {
      const randomAgainst = min + Math.trunc(Math.random() * (max - min));
      return randomAgainst;
    }
    return randomNumber;
  };

  handleAddNewValue = async (roleId, roleValue) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (roleId && roleValue) {
      const res = await dispatch({
        type: 'adminSetting/addRole',
        payload: { idSync: roleId, name: roleValue, description: roleValue },
      });
      if (res.statusCode === 200) {
        this.setState({
          roleId: '',
          roleValue: '',
          selectedRowKeys: [...selectedRowKeys, roleId],
        });
      }
    } else {
      message.error('Please input fields');
    }
  };

  handlePermission = (text, record) => {
    const { RolesID = '' } = record;
    history.push(`/settings/roles-permissions/${RolesID.toLowerCase()}`);
  };

  isString = (text) => {
    return typeof text === 'string' || text instanceof String;
  };

  render() {
    const { selectedRowKeys, roleValue, roleId } = this.state;
    const { formatData, loading = true } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = [
      {
        key: 1,
        title: 'Role ID',
        dataIndex: 'RolesID',
        align: 'center',
        sorter: (a, b) => {
          return this.isString(a.RolesID) && this.isString(b.RolesID)
            ? a.RolesID.localeCompare(b.RolesID)
            : null;
        },
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        key: 2,
        title: 'Description',
        dataIndex: 'Rolesname',
        align: 'center',
        width: '250px',
        sorter: (a, b) => {
          return this.isString(a.Rolesname) && this.isString(b.Rolesname)
            ? a.Rolesname.localeCompare(b.Rolesname)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        key: 4,
        title: 'Permission',
        dataIndex: 'Permission',
        align: 'center',
        render: (text, record) =>
          record._id ? (
            <DropboxOutlined
              className={styles.iconPermission}
              onClick={() => this.handlePermission(text, record)}
            />
          ) : (
            ''
          ),
      },
      {
        key: 5,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record._id ? (
            <Popconfirm
              title="Are you sure to delete this role?"
              onConfirm={() => this.handleClickDelete(record._id, record.idSync)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(roleId, roleValue)} />
          ),
        align: 'center',
      },
    ];
    if (loading)
      return (
        <div className={styles.RolesPermission}>
          <Spin loading={loading} active size="large" />
        </div>
      );
    const add = {
      _id: '',
      RolesID: <Input onChange={(e) => this.handleChangeInput(e, 'roleId')} value={roleId} />,
      Rolesname: (
        <Input onChange={(e) => this.handleChangeInput(e, 'roleValue')} value={roleValue} />
      ),
    };

    const renderAdd = [...formatData, add];

    return (
      <div className={styles.RolesPermission}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="RolesID"
        />
      </div>
    );
  }
}

export default RolesPermission;
