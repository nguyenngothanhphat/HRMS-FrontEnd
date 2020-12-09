import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
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
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'requestDate',
        render: (requestDate) => {
          return <p>{moment(requestDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        render: (employee) => {
          const { generalInfo: { firstName = '' } = {} } = employee;
          return <p>{firstName}</p>;
        },
      },
      {
        title: <span className={styles.title}>Current Project </span>,
        dataIndex: 'currentProject',
      },
      {
        title: <span className={styles.title}>Project Manager </span>,
        dataIndex: 'projectManager',
      },
      {
        title: <span className={styles.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: () => (
          <div className={styles.rowAction}>
            <p>
              <span>
                <img src={persion} style={{ marginTop: '10px' }} alt="" />
              </span>
              <span>
                <img src={persion} style={{ marginTop: '10px' }} alt="" />
              </span>
            </p>
          </div>
        ),
      },
      {
        title: <span className={styles.title}>1-on-1 date</span>,
        dataIndex: 'date',
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: '_id',
        render: (_id) => (
          <div className={styles.rowAction}>
            <span onClick={() => this.push(_id)}>View Request</span>
          </div>
        ),
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
