import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table } from 'antd';
import { history } from 'umi';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

class RolesPermission extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [
        { RolesID: 20, Rolesname: 'Roles 1', Permission: 'view' },
        { RolesID: 22, Rolesname: 'Roles 2', Permission: 'view' },
        { RolesID: 24, Rolesname: 'Roles 3', Permission: 'view' },
      ],
      roleValue: '',
      getIndex: '',
      permissionValues: '',
    };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({ selectedRowKeys });
  };

  handleOk = (e, getIndex) => {
    const { data } = this.state;
    data.splice(getIndex, 1);
    this.setState({
      visible: false,
      data,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleClickDelete = (text, record, index) => {
    console.log('click', 'text: ', text, 'record: ', record, 'index: ', index);
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

  handleAddNewValue = (roleValue, permissionValues) => {
    const { data } = this.state;
    const addData = {
      RolesID: this.handleRandomNumberID(),
      Rolesname: roleValue,
      Permission: permissionValues,
    };
    const newData = [...data, addData];
    this.setState({ data: newData, roleValue: '', permissionValues: '' });
  };

  handlePermission = (text, record, index) => {
    console.log(text, record, index);
    history.push('/settings/Permission');
  };

  render() {
    const {
      selectedRowKeys,
      visible,
      testReord,
      data,
      roleValue,
      getIndex,
      permissionValues,
    } = this.state;
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
        render: (text, record, index) =>
          record.RolesID !== '' ? (
            <div onClick={() => this.handlePermission(text, record, index)}>View</div>
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
            <PlusCircleFilled onClick={() => this.handleAddNewValue(roleValue, permissionValues)} />
          ),
        align: 'center',
      },
    ];
    const add = {
      RolesID: '',
      Rolesname: <Input onChange={this.handleChangeValueRoles} value={roleValue} />,
      Permission: <Input onChange={this.handleChangeValuePermission} value={permissionValues} />,
    };
    const renderAdd = [...data, add];

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
