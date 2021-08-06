import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Input, InputNumber, message, Select, Skeleton, Table } from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import styles from './index.less';

@connect(({ loading, projectManagement: { projectMembers: members = [] } } = {}) => ({
  loading: loading.effects['projectManagement/getProjectById'],
  loadingListEmployees: loading.effects['projectManagement/getEmployees'],
  members,
}))
class ListMemberTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMember: { employee: '', role: '', effort: 100 },
    };
  }

  componentDidMount() {
    const { dispatch, projectId = '' } = this.props;
    dispatch({
      type: 'projectManagement/getProjectById',
      payload: {
        _id: projectId,
      },
    });
  }

  handleClickDelete = (_id) => {
    const { members = [], dispatch } = this.props;
    let newMembers = JSON.parse(JSON.stringify(members));
    newMembers = newMembers.filter((member) => member._id !== _id);

    dispatch({
      type: 'projectManagement/save',
      payload: {
        projectMembers: newMembers,
      },
    });
  };

  handleChangeValue = (value) => {
    const { newDepartment } = this.state;
    this.setState({ newDepartment: { ...newDepartment, ...value } });
  };

  // new
  handleNewValue = (val, type) => {
    const { newMember } = this.state;
    newMember[type] = val;
    this.setState({
      newMember,
    });
  };

  handleChangingValue = (val, type, record) => {
    const { _id } = record;
    const { members, dispatch } = this.props;

    const newMembers = JSON.parse(JSON.stringify(members));

    newMembers.forEach((member) => {
      if (member._id === _id) {
        // eslint-disable-next-line no-param-reassign
        member[type] = val;
      }
    });

    dispatch({
      type: 'projectManagement/save',
      payload: {
        projectMembers: newMembers,
      },
    });
  };

  handleAddingMember = () => {
    const { newMember } = this.state;
    const { members, dispatch } = this.props;

    if (newMember.employee && newMember.effort && newMember.role) {
      const newMembers = JSON.parse(JSON.stringify(members));

      newMembers.push(newMember);
      
      dispatch({
        type: 'projectManagement/save',
        payload: {
          projectMembers: [...newMembers],
        },
      });

      this.setState({
        newMember: { employee: '', role: '', effort: 100 },
      });
    } else {
      message.error('Please input all fields.');
    }
  };

  render() {
    const {
      loading,
      loadingListEmployees,
      members = [],
      employeeList = [],
      roleList = [],
    } = this.props;
    const { newMember } = this.state;

    const existEmployees = members.map((emp) => emp.employee);
    const filterEmployeeList = employeeList.filter((emp) => !existEmployees.includes(emp.employee));

    if (loading || loadingListEmployees)
      return (
        <div className={styles.ListMemberTable}>
          <Skeleton active />
        </div>
      );

    const columns = [
      {
        key: 1,
        title: 'Employee',
        dataIndex: 'employee',
        align: 'left',
        width: '35%',
        render: (employee, record) => {
          return record._id !== '' ? (
            <Select
              disabled
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={employee}
            >
              {employeeList.map((d) => (
                <Select.Option value={d.id}>{d.name}</Select.Option>
              ))}
            </Select>
          ) : (
            employee
          );
        },
      },
      {
        key: 2,
        title: 'Role',
        dataIndex: 'role',
        align: 'left',
        width: '35%',
        render: (role, record) => {
          return record._id !== '' ? (
            <Select
              onChange={(val) => this.handleChangingValue(val, 'role', record)}
              value={role}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {roleList.map((d) => (
                <Select.Option value={d}>{d}</Select.Option>
              ))}
            </Select>
          ) : (
            role
          );
        },
      },
      {
        key: 3,
        title: 'Effort (%)',
        dataIndex: 'effort',
        align: 'left',
        width: '20%',
        render: (text, record) => {
          return record._id !== '' ? (
            <InputNumber
              onChange={(value) => this.handleChangingValue(value, 'effort', record)}
              min={0}
              max={100}
              value={text}
            />
          ) : (
            text
          );
        },
      },
      {
        key: 4,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record._id !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(record._id)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddingMember()} />
          ),
        align: 'center',
      },
    ];
    const add = {
      _id: '',
      employee: (
        <Select
          onChange={(val) => this.handleNewValue(val, 'employee')}
          placeholder="Select an employee"
          value={newMember.employee}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {filterEmployeeList.map((d) => (
            <Select.Option value={d.id}>{d.name}</Select.Option>
          ))}
        </Select>
      ),
      role: (
        <Select
          value={newMember.role}
          onChange={(val) => this.handleNewValue(val, 'role')}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="Select role"
        >
          {roleList.map((d) => (
            <Select.Option value={d}>{d}</Select.Option>
          ))}
        </Select>
      ),
      effort: <InputNumber min={0} max={100} value={newMember.effort} />,
    };
    const renderAdd = [...members, add];

    return (
      <div className={styles.ListMemberTable}>
        <Table
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="employee"
        />
      </div>
    );
  }
}

export default ListMemberTable;
