import React, { PureComponent } from 'react';
import { Table } from 'antd';
import empty from '@/assets/empty.svg';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class TableEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = [];

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketId',
      },
      {
        title: <span className={styles.title}>Created date </span>,
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
      },
      {
        title: <span className={styles.title}>Current Project </span>,
      },
      {
        title: <span className={styles.title}>Project Manager </span>,
      },
      {
        title: <span className={styles.title}>Assigned </span>,
      },
      {
        title: <span className={styles.title}>1-on-1 date</span>,
      },
      {
        title: <span className={styles.title}>Action</span>,
      },
    ];

    return (
      <div className={styles.tableStyles}>
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
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableEmployee;
