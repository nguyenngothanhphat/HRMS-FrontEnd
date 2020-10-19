import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [
        { DepartmentID: 20, Deparmentname: 'IT' },
        { DepartmentID: 22, Deparmentname: 'HR' },
        { DepartmentID: 24, Deparmentname: 'Accounting' },
      ],
      newValue: '',
      getIndex: '',
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

  handleChangeValue = (e) => {
    const { value } = e.target;
    this.setState({ newValue: value });
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

  handleAddNewValue = (newValue) => {
    const { data } = this.state;
    const addData = {
      DepartmentID: this.handleRandomNumberID(),
      Deparmentname: newValue,
    };
    const newData = [...data, addData];
    this.setState({ data: newData, newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data, newValue, getIndex } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        key: 1,
        title: 'Department ID',
        dataIndex: 'DepartmentID',
        align: 'center',
      },
      {
        key: 2,
        title: 'Deparment name',
        dataIndex: 'Deparmentname',
        align: 'center',
      },
      {
        key: 3,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record, index) =>
          record.DepartmentID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record, index)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(newValue)} />
          ),
        align: 'center',
      },
    ];
    const add = {
      DepartmentID: '',
      Deparmentname: <Input onChange={this.handleChangeValue} value={newValue} />,
    };
    const renderAdd = [...data, add];

    return (
      <div className={styles.Department}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="DepartmentID"
        />

        <Modal
          title={`Delete ${testReord.Deparmentname}? Are you sure?`}
          visible={visible}
          onOk={(e) => this.handleOk(e, getIndex)}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Department;
