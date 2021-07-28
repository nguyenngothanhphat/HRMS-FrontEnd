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
    };
  }

  componentDidMount() {
    const { department } = this.props;
    const formatData = department.map((item) => {
      const { departmentId: DepartmentIDText, _id: DepartmentID, name: Deparmentname } = item;
      return { DepartmentID, Deparmentname, DepartmentIDText };
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
      const { departmentId: DepartmentIDText, _id: DepartmentID, name: Deparmentname } = item;
      return { DepartmentID, Deparmentname, DepartmentIDText };
    });
    return { data2: formatData };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  handleOk = () => {
    const { testReord } = this.state;
    const { dispatch } = this.props;
    const { DepartmentID = '' } = testReord;
    const statusCode = dispatch({
      type: 'adminSetting/removeDepartment',
      payload: {
        id: DepartmentID,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'adminSetting/fetchDepartment',
      });
    }

    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleClickDelete = (text, record) => {
    this.setState({
      visible: true,
      testReord: record,
    });
  };

  handleChangeValue = (e) => {
    const { value } = e.target;
    this.setState({ newValue: value });
  };

  handleAddNewValue = async (newValue) => {
    const { dispatch } = this.props;
    if (newValue === '') return;
    await dispatch({
      type: 'adminSetting/addDepartment',
      payload: { name: newValue },
    });
    this.setState({ newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data2, newValue } = this.state;
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
        dataIndex: 'DepartmentIDText',
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
        render: (text, record) =>
          record.DepartmentID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record)} />
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
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Department;
