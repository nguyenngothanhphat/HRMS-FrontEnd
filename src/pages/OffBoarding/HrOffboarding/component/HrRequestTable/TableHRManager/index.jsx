import React, { PureComponent } from 'react';
import { Table } from 'antd';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class HrTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = () => {
    history.push('/employee-offboarding/HrRequest/1854545');
  };

  render() {
    const { data = [] } = this.props;

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
      // pageSize: rowSize,
      // current: pageSelected,
      // onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketId',
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employeeId',
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'createDate',
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'name',
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
        dataIndex: 'lwd',
      },
      {
        title: <span className={styles.title}>LWD Change</span>,
        dataIndex: 'LwdChange',
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: 'Action',
        render: () => (
          <div className={styles.rowAction}>
            <span onClick={this.push}>View Request</span>
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
          // pagination={{
          //   ...pagination,
          //   total: data.length,
          // }}
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
