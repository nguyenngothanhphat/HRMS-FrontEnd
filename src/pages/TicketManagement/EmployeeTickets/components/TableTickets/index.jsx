import React, { PureComponent } from 'react';

import { Table, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import moment from 'moment';
import { history, connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';

import styles from './index.less';

@connect(
  ({
    loading,
    ticketManagement: { listEmployee = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    listEmployee,
    employee,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  }),
)
class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
    };
  }

  openViewTicket = (ticketID) => {
    const { data = [] } = this.props;
    let id = '';

    data.forEach((item) => {
      if (item.id === ticketID) {
        id = item.id;
      }
    });

    if (id) {
      history.push(`/ticket-management/detail/${id}`);
    }
  };

  handleClickSelect = (value) => {
    const { data = [] } = this.props;
    const ticket = data.find((val) => val.id === value);
    this.setState({ ticket });
  };

  handleSelectChange = () => {
    const { ticket } = this.state;
    const { dispatch, employee: { _id = '' } = {} } = this.props;
    const {
      id = '',
      employee_raise: employeeRaise = '',
      query_type: queryType = '',
      subject = '',
      description = '',
      priority = '',
      cc_list: ccList = [],
      attachments = [],
      department_assign: departmentAssign = '',
    } = ticket;
    dispatch({
      type: 'ticketManagement/updateTicket',
      payload: {
        id,
        employeeRaise,
        employeeAssignee: _id,
        status: 'Assigned',
        queryType,
        subject,
        description,
        priority,
        ccList,
        attachments,
        departmentAssign,
        employee: _id,
      },
    });
  };

  handleSelect = (e) => {
    e.preventDefault();
  };

  render() {
    const {
      data = [],
      textEmpty = 'No rasie ticket  is submitted',
      loading,
      pageSelected,
      size,
      getPageAndSize = () => {},
    } = this.props;

    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {data.length}
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const { listEmployee } = this.props;

    const columns = [
      {
        title: 'Ticket ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
          return (
            <span className={styles.ticketID} onClick={() => this.openViewTicket(id)}>
              {id}
            </span>
          );
        },
        fixed: 'left',
      },
      {
        title: 'User ID',
        dataIndex: 'employeeRaise',
        key: 'userID',
        render: (employeeRaise, id) => {
          const { generalInfo: { userId = '' } = {} } = employeeRaise;
          return (
            <span className={styles.userID} onClick={() => this.openViewTicket(id.id)}>
              {userId}
            </span>
          );
        },
      },
      {
        title: 'Name',
        dataIndex: 'employeeRaise',
        key: 'name',
        render: (employeeRaise) => {
          const { generalInfo: { legalName = '' } = {} } = employeeRaise;
          return <span>{legalName}</span>;
        },
      },
      {
        title: 'Request Date',
        dataIndex: 'created_at',
        key: 'requestDate',
        render: (createdAt) => {
          return <span>{moment(createdAt).format('DD/MM/YYYY')}</span>;
        },
      },
      {
        title: 'Request Type',
        dataIndex: 'query_type',
        key: 'query_type',
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority) => {
          if (priority === 'High') {
            return <div className={styles.priorityHigh}>{priority}</div>;
          }
          if (priority === 'Normal') {
            return <div className={styles.priorityMedium}>{priority}</div>;
          }
          if (priority === 'Urgent') {
            return <div className={styles.priorityUrgent}>{priority}</div>;
          }
          return <div className={styles.priorityLow}>{priority}</div>;
        },
      },
      {
        title: 'Loacation',
        dataIndex: 'employeeRaise',
        key: 'loacation',
        render: (employeeRaise) => {
          const { location: { name = '' } = {} } = employeeRaise;
          return <span>{name}</span>;
        },
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
      },
      {
        title: 'Assign To',
        dataIndex: ['department_assign', 'employee_assignee', 'id'],
        key: 'assign',
        fixed: 'right',
        render: (departmentAssign, employeeAssignee) => {
          if (employeeAssignee.employee_assignee !== '') {
            const employeeAssigned = listEmployee.find(
              (val) => val._id === employeeAssignee.employee_assignee,
            );
            return (
              <span style={{ color: '#2c6df9' }}>
                {employeeAssigned ? employeeAssigned.generalInfo.legalName : ''}
              </span>
            );
          }
          return (
            <Dropdown
              overlayClassName="dropDown__employee"
              overlay={
                <Menu>
                  <Menu.Item onClick={this.handleSelectChange}>Assign to self</Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <div onClick={() => this.handleClickSelect(employeeAssignee.id)}>
                Select User &emsp;
                <DownOutlined />
              </div>
            </Dropdown>
          );
        },
      },
    ];

    return (
      <div className={styles.TableTickets}>
        <Table
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="emty" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.handleChangeTable}
          rowKey="id"
          scroll={{ x: 1500, y: 487 }}
        />
      </div>
    );
  }
}

export default TableTickets;
