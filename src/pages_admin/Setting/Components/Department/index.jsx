import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table } from 'antd';
import { connect } from 'umi';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

@connect(({ employee: { department = [] } = {} }) => ({ department }))
class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      // data: [
      //   { DepartmentID: 20, Deparmentname: 'IT' },
      //   { DepartmentID: 22, Deparmentname: 'HR' },
      //   { DepartmentID: 24, Deparmentname: 'Accounting' },
      // ],
      data2: [],
      newValue: '',
      getIndex: '',
    };
  }

  componentDidMount() {
    const { department } = this.props;
    const formatData = department.map((item) => {
      const { _id: DepartmentID, name: Deparmentname } = item;
      return { DepartmentID, Deparmentname };
    });
    this.setState({ data2: formatData });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({ selectedRowKeys });
  };

  handleOk = (e, getIndex) => {
    const { data2 } = this.state;
    data2.splice(getIndex, 1);
    this.setState({
      visible: false,
      data2,
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

  handleAddNewValue = (newValue, data2) => {
    if (newValue === '') return;
    const addData = {
      DepartmentID: this.handleRandomNumberID(),
      Deparmentname: newValue,
    };
    const newData = [...data2, addData];
    this.setState({ data2: newData, newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data2, newValue, getIndex } = this.state;
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
            <PlusCircleFilled onClick={() => this.handleAddNewValue(newValue, data2)} />
          ),
        align: 'center',
      },
    ];
    const add = {
      DepartmentID: '',
      Deparmentname: <Input onChange={this.handleChangeValue} value={newValue} />,
    };
    const renderAdd = [...data2, add];

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
