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
      testRecord: {},
      // data2: [],
      newDepartment: { name: '', departmentParentId: '' },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartment',
    });
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { department } = props;
  //   const { data2 } = state;
  //   if (department.length === data2.length) {
  //     return {
  //       data2,
  //     };
  //   }
  //   const formatData = department.map((item) => {
  //     const {
  //       departmentId: DepartmentIDText,
  //       _id: DepartmentID,
  //       name: DepartmentName,
  //       departmentParentId: DepartmentParentId,
  //     } = item;
  //     return { DepartmentID, DepartmentName, DepartmentIDText, DepartmentParentId };
  //   });
  //   return { data2: formatData };
  // }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleOk = () => {
    const { testRecord } = this.state;
    const { dispatch } = this.props;
    const { _id = '' } = testRecord;
    const statusCode = dispatch({
      type: 'adminSetting/removeDepartment',
      payload: {
        id: _id,
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
      testRecord: record,
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
    const { selectedRowKeys, visible, testRecord, newDepartment } = this.state;
    const { loading, department } = this.props;
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
        dataIndex: 'departmentId',
        align: 'center',
        width: '20%',
      },
      {
        key: 2,
        title: 'Department Name',
        dataIndex: 'name',
        align: 'left',
        width: '35%',
      },
      {
        key: 3,
        title: 'Department Parent Name',
        dataIndex: 'departmentParent',
        align: 'left',
        width: '35%',
        render: (text, record) => {
          if (!record.departmentParent) {
            const data = department.find((item) => item.departmentId === record.departmentParentId);
            return <>{data && data.name}</>;
          }
          return text;
          // return ({record.DepartmentParentName});
        },
      },
      {
        key: 4,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record._id !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue()} />
          ),
        align: 'center',
      },
    ];
    const add = {
      _id: '',
      departmentId: '',
      name: (
        <Input
          placeholder="Department Name"
          onChange={(e) => this.handleChangeValue({ name: e.target.value })}
          value={newDepartment.name}
        />
      ),
      departmentParent: (
        <Select
          onChange={
            (value) =>
              this.handleChangeValue({
                departmentParentId: value,
              })
            // eslint-disable-next-line react/jsx-curly-newline
          }
          placeholder="Parent Department Name"
        >
          <Select.Option value="">None</Select.Option>
          {department.map((d) => (
            <Select.Option value={d.departmentId}>{d.name}</Select.Option>
          ))}
        </Select>
      ),
    };
    const renderAdd = [...department, add];

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
          title={`Delete ${testRecord.DepartmentName}? Are you sure?`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Department;
