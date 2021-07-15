/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Avatar } from 'antd';
import moment from 'moment';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

class TableManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: '1',
    };
  }

  push = (id) => {
    history.push(`/offboarding/review/${id}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  openViewTicket = (ticketID) => {
    const { data = [] } = this.props;
    let id = '';

    data.forEach((item) => {
      if (item.ticketID === ticketID) {
        id = item._id;
      }
    });

    if (id) {
      history.push(`/offboarding/review/${id}`);
    }
  };

  render() {
    const { data = [], textEmpty = 'No resignation request is submitted', loading } = this.props;
    const { pageNavigation } = this.state;
    const rowSize = 10;

    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return (
            <span onClick={() => this.openViewTicket(ticketID)} className={styles.title__value}>
              {ticketID}
            </span>
          );
        },
        fixed: 'left',
        width: 200,
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <span>{employee.employeeId}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'requestDate',
        render: (requestDate) => {
          return <span>{moment(requestDate).format('YYYY/MM/DD')}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        render: (employee) => {
          const { generalInfo: { firstName = '', userId = '' } = {} } = employee;
          return (
            <span
              onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              className={`${styles.title__value} ${styles.title__requteeName}`}
            >
              {firstName}
            </span>
          );
        },
        width: 200,
      },
      // {
      //   title: <span className={styles.title}>Current Project </span>,
      //   dataIndex: 'currentProject',
      //   width: 200,
      // },
      // {
      //   title: <span className={styles.title}>Project Manager </span>,
      //   dataIndex: 'projectManager',
      //   width: 200,
      // },
      {
        title: <span className={styles.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const {
            hrManager: {
              generalInfo: { firstName = '', lastName = '', middleName = '', userId = '' } = {},
            } = {},
          } = this.props;
          const fullName = `${firstName} ${middleName} ${lastName}`;
          return (
            <span
              className={styles.title__value}
              onClick={() => history.push(`/directory/employee-profile/${userId}`)}
            >
              {fullName}
            </span>
          );
        },
      },
      {
        title: <span className={styles.title}>Action</span>,
        // dataIndex: '_id',
        // render: (_id) => (
        //   <div className={styles.rowAction}>
        //     <span onClick={() => this.push(_id)}>View Request</span>
        //   </div>
        // ),
      },
    ];

    return (
      <div className={styles.tableStyles}>
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
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableManager;
