import React, { PureComponent } from 'react';
import { Table, Dropdown, Menu, Input } from 'antd';
import moment from 'moment';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: '1',
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

  handleSelect = (e) => {
    e.preventDefault();
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
    // dropdown select

    const menu = (
      <Menu>
        <div className="inputSearch">
          <Input placeholder="Search by name" prefix={<SearchOutlined />} />
        </div>
        <Menu.Divider />
        {data.map((item) => (
          <Menu.Item> {item.employeeRaise.generalInfo.legalName}</Menu.Item>
        ))}
        {/* <Menu.Item> Lewis Tuan</Menu.Item>
        <Menu.Item>Vo Nghia</Menu.Item> */}
      </Menu>
    );
    // Thay thế data khi co du lieu
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
        render: (employeeRaise) => {
          const { generalInfo: { userId = '' } = {} } = employeeRaise;
          return <span className={styles.userID}>{userId}</span>;
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
            return <span className={styles.priorityHigh}>{priority}</span>;
          }
          if (priority === 'Normal') {
            return <span className={styles.priorityMedium}>{priority}</span>;
          }
          return <span className={styles.priorityLow}>{priority}</span>;
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
        key: 'operation',
        fixed: 'right',
        render: () => {
          return (
            <Dropdown overlayClassName="dropDown" overlay={menu} trigger={['click']}>
              <div onClick={(e) => this.handleSelect(e)}>
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
