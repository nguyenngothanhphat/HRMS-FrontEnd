import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Input, Select, Spin, Table, message } from 'antd';
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

  handleClickDelete = (_, record) => {
    const { department } = this.props;

    let hasChildDept = false;
    department.forEach((item) => {
      if (item?.departmentParentId === record._id) {
        hasChildDept = true;
      }
    });

    if (!hasChildDept) {
      this.setState({
        visible: true,
        testRecord: record,
      });
    } else {
      message.error('This department cannot be deleted');
    }
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
        dataIndex: '_id',
        align: 'left',
        width: '35%',
        render: (_id, record) => {
          const dataChild = department.filter((item) => item._id === record?.departmentParentId);
          const getDeptParentName = department.find((item) => item._id === _id);

          if (dataChild.length > 0) {
            return dataChild[0].name;
          }

          if (getDeptParentName?._id) {
            return <>{getDeptParentName.name}</>;
          }

          return (
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
          );
        },
      },
      {
        key: 4,
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => {
          const disabled =
            record.name === 'Engineering' ||
            record.name === 'Finance' ||
            record.name === 'Legal' ||
            record.name === 'HR' ||
            record.name === 'Sales' ||
            record.name === 'Marketing' ||
            record.name === 'Operations & Facility management';

          return (
            <>
              {record._id ? (
                <>
                  {!disabled ? (
                    <Button
                      disabled={disabled}
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => this.handleClickDelete(_, record)}
                    />
                  ) : null}
                </>
              ) : (
                <PlusCircleFilled onClick={() => this.handleAddNewValue()} />
              )}
            </>
          );
        },
        align: 'center',
      },
    ];
    const add = {
      // _id: '',
      departmentId: '',
      name: (
        <Input
          placeholder="Department Name"
          onChange={(e) => this.handleChangeValue({ name: e.target.value })}
          value={newDepartment.name}
        />
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
