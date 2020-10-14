import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

class Location extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [
        { LocationID: 20, Country: 'USA' },
        { LocationID: 22, Country: 'India' },
        { LocationID: 24, Country: 'Viet Nam' },
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
      LocationID: this.handleRandomNumberID(),
      Country: newValue,
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
        title: 'Location ID',
        dataIndex: 'LocationID',
        align: 'center',
      },
      {
        key: 2,
        title: 'Country',
        dataIndex: 'Country',
        align: 'center',
      },
      {
        key: 3,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record, index) =>
          record.LocationID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record, index)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(newValue)} />
          ),
        align: 'center',
      },
    ];
    const add = {
      LocationID: '',
      Country: <Input onChange={this.handleChangeValue} value={newValue} />,
    };
    const renderAdd = [...data, add];

    return (
      <div className={styles.Location}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="LocationID"
        />

        <Modal
          title={`Delete ${testReord.Country}? Are you sure?`}
          visible={visible}
          onOk={(e) => this.handleOk(e, getIndex)}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Location;
