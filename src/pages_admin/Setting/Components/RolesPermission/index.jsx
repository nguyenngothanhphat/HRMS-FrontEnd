import { DeleteOutlined, DropboxOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table, Spin } from 'antd';
import { history, connect } from 'umi';
import Modal from 'antd/lib/modal/Modal';
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
      visible: false,
      testReord: {},
      roleValue: '',
      getIndex: '',
      permissionValues: '',
    };
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleOk = (e, getIndex) => {
    const { dispatch, formatData } = this.props;
    formatData.splice(getIndex, 1);
    this.setState({
      visible: false,
    });
    dispatch({
      type: 'adminSetting/saveTemp',
      payload: { formatData },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleClickDelete = (text, record, index) => {
    // console.log('click', 'text: ', text, 'record: ', record, 'index: ', index);
    this.setState({
      visible: true,
      testReord: record,
      getIndex: index,
    });
  };

  handleChangeValueRoles = (e) => {
    const { value } = e.target;
    this.setState({ roleValue: value });
  };

  handleChangeValuePermission = (e) => {
    const { value } = e.target;
    this.setState({ permissionValues: value });
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

  handleAddNewValue = (roleValue, permissionValues, data) => {
    const { dispatch } = this.props;
    const addData = {
      RolesID: this.handleRandomNumberID(),
      Rolesname: roleValue,
      Permission: permissionValues,
    };
    const newData = [...data, addData];
    this.setState({ roleValue: '', permissionValues: '' });
    dispatch({
      type: 'adminSetting/saveTemp',
      payload: { formatData: newData },
    });
  };

  handlePermission = (text, record) => {
    const { Rolesname = '' } = record;
    history.push(`/settings/roles-permissions/${Rolesname.toLowerCase()}`);
  };

  render() {
    const { selectedRowKeys, visible, testReord, roleValue, getIndex, permissionValues } =
      this.state;
    const { formatData, loading = true } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        key: 1,
        title: 'Roles ID',
        dataIndex: 'RolesID',
        align: 'center',
      },
      {
        key: 2,
        title: 'Roles name',
        dataIndex: 'Rolesname',
        align: 'center',
        width: '250px',
      },
      {
        key: 4,
        title: 'Permission',
        dataIndex: 'Permission',
        align: 'center',
        render: (text, record) =>
          record.RolesID !== '' ? (
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
        render: (text, record, index) =>
          record.RolesID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record, index)} />
          ) : (
            <PlusCircleFilled
              onClick={() => this.handleAddNewValue(roleValue, permissionValues, formatData)}
            />
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
      RolesID: '',
      Rolesname: <Input onChange={this.handleChangeValueRoles} value={roleValue} />,
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

        <Modal
          title={`Delete ${testReord.Rolesname}? Are you sure?`}
          visible={visible}
          onOk={(e) => this.handleOk(e, getIndex)}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default RolesPermission;
