import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Spin, Table } from 'antd';
import { connect } from 'umi';
import Modal from 'antd/lib/modal/Modal';
import React, { Component } from 'react';
import styles from './index.less';

@connect(({ loading, adminSetting: { tempData: { department = [] } = {} } = {} }) => ({
  loading: loading.effects['adminSetting/fetchDepartment'],
  department,
}))
class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
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

  static getDerivedStateFromProps(props, state) {
    const { department } = props;
    const { data2 } = state;
    if (department.length === data2.length) {
      return {
        data2,
      };
    }
    const formatData = department.map((item) => {
      const { _id: DepartmentID, name: Deparmentname } = item;
      return { DepartmentID, Deparmentname };
    });
    return { data2: formatData };
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

  handleAddNewValue = (newValue) => {
    const { dispatch } = this.props;
    if (newValue === '') return;
    dispatch({
      type: 'adminSetting/addDepartment',
      payload: { name: newValue },
    });
    this.setState({ newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data2, newValue, getIndex } = this.state;
    const { loading } = this.props;
    if (loading)
      return (
        <div className={styles.Department}>
          <Spin loading={loading} active size="large" />
        </div>
      );
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
