import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class HrTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  push = (data) => {
    history.push(`/offboarding/review/${data}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    const { pageNavigation } = this.state;
    const { data = [] } = this.props;
    // const dateFormat = 'YYYY/MM/DD';
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
        dataIndex: 'createDate',
        render: (createDate) => {
          return <p>{moment(createDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        render: (employee) => {
          const { generalInfo = {} } = employee;
          return <p>{generalInfo.firstName}</p>;
        },
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
        title: <span className={styles.title}>Department</span>,
        dataIndex: 'department',
      },
      {
        title: <span className={styles.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={styles.title}>LWD Change</span>,
        dataIndex: 'LwdChange',
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: '_id',
        align: 'left',
        render: (_id) => (
          <div className={styles.rowAction}>
            <span onClick={() => this.push(_id)}>View Request</span>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.HRtableStyles}>
        <Table
          locale={{
            emptyText: (
              <span>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>No resignation request is submitted</p>
              </span>
            ),
          }}
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
export default HrTable;
