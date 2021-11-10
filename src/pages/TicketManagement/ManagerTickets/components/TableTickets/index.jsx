import React, { PureComponent } from 'react';
import { Table, Dropdown, Menu, Input } from 'antd';
import moment from 'moment';
import { DownOutlined, UpOutlined, SearchOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idAssigned: '',
      visible: false,
      employeeAssigned: '',
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

  handleClickSelect = (e) => {
    e.preventDefault();
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  handleSelectChange = ({ key }) => {
    const { listEmployee } = this.props;
    const employeeAssigned = listEmployee.find((val) => val._id === key);
    this.setState({ employeeAssigned: employeeAssigned.generalInfo.legalName });
  };

  render() {
    const {
      data = [],
      textEmpty = 'No resignation request is submitted',
      loading,
      pageSelected,
      size,
      loadingFilter,
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
    const { visible, idAssigned } = this.state;
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
        render: (created_at) => {
          return <span>{moment(created_at).format('DD/MM/YYYY')}</span>;
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
          const {
            location: {
              headQuarterAddress: {
                country: { name = '' },
              },
            } = {},
          } = employeeRaise;
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
        dataIndex: ['department_assign', 'employee_assignee'],
        key: 'assign',
        fixed: 'right',
        render: (department_assign, employee_assignee) => {
          if (employee_assignee.employee_assignee !== '') {
            const employeeAssigned = listEmployee.find(
              (val) => val._id === employee_assignee.employee_assignee,
            );
            return <span>{employeeAssigned ? employeeAssigned.generalInfo.legalName : ''}</span>;
          }
          return (
            <Dropdown
              overlayClassName="dropDown"
              overlay={
                <Menu>
                  <div className="inputSearch">
                    <Input placeholder="Search by name" prefix={<SearchOutlined />} />
                  </div>
                  <Menu.Divider />
                  {listEmployee
                    ? listEmployee.map((val) => {
                        const departmentID = val.department._id;
                        if (departmentID === employee_assignee.department_assign) {
                          return (
                            <Menu.Item
                              onClick={this.handleSelectChange}
                              key={val._id}
                              value={val._id}
                            >
                              {val.generalInfo.legalName}
                            </Menu.Item>
                          );
                        }
                      })
                    : ''}
                </Menu>
              }
              trigger={['click']}
            >
              <div onClick={(e) => this.handleClickSelect(e)}>
                Select User &emsp;
                {visible ? <UpOutlined /> : <DownOutlined />}
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
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          loadingSearch={loadingFilter}
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

export default connect(({ ticketManagement: { listEmployee = [] } = {} }) => ({
  listEmployee,
}))(TableTickets);
