import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, Select, Spin, Table } from 'antd';
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
      newDepartment: { name: '', departmentParentId: '' },
    };
  }

  componentDidMount() {
    const { department } = this.props;
    const formatData = department.map((item) => {
      const { departmentId: DepartmentIDText, _id: DepartmentID, name: DepartmentName } = item;
      return { DepartmentID, DepartmentName, DepartmentIDText };
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
      const { departmentId: DepartmentIDText, _id: DepartmentID, name: DepartmentName } = item;
      return { DepartmentID, DepartmentName, DepartmentIDText };
    });
    return { data2: formatData };
  }

  onSelectChange = (selectedRowKeys) => {
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

  handleCancel = () => {
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

  handleChangeValue = (value) => {
    const { newDepartment } = this.state;
    this.setState({ newDepartment: { ...newDepartment, ...value } });
  };

  handleAddNewValue = async () => {
    const { dispatch } = this.props;
    const { newDepartment } = this.state;
    if (newDepartment.name === '') return;
    await dispatch({
      type: 'adminSetting/addDepartment',
      payload: newDepartment,
    });
    this.setState({ newDepartment: { name: '', departmentParentId: '' } });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data2, newDepartment } = this.state;
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
        width: '20%',
      },
      {
        key: 2,
        title: 'Department name',
        dataIndex: 'DepartmentName',
        align: 'left',
        width: '70%',
      },
      {
        key: 3,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record.DepartmentID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue()} />
          ),
        align: 'center',
      },
    ];
    const add = {
      DepartmentID: '',
      DepartmentName: (
        <>
          <Input
            placeholder="DepartmentName"
            onChange={(e) => this.handleChangeValue({ name: e.target.value })}
            value={newDepartment.name}
          />
          <Select
            onChange={
              (value) =>
                this.handleChangeValue({
                  departmentParentId: value,
                })
              // eslint-disable-next-line react/jsx-curly-newline
            }
            placeholder="Parent Department"
          >
            <Select.Option value="">None</Select.Option>
            {data2.map((d) => (
              <Select.Option value={d.DepartmentIDText}>{d.DepartmentName}</Select.Option>
            ))}
          </Select>
        </>
      ),
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
          title={`Delete ${testReord.DepartmentName}? Are you sure?`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Department;
