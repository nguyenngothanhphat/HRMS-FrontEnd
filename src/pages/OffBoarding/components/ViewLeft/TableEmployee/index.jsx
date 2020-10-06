import React, { PureComponent } from 'react';
import { Table } from 'antd';
import empty from '@/assets/empty.svg';
import t from './index.less';

class TableEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columns = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticket',
      },
      {
        title: <span className={t.title}>Requested on</span>,
      },
      {
        title: <span className={t.title}>LWD</span>,
      },
      {
        title: <span className={t.title}>LWD Change</span>,
      },
      {
        title: <span className={t.title}>Assigned</span>,
      },
      {
        title: <span className={t.title}>Reason of leaving</span>,
      },
      {
        title: <span className={t.title}>Action</span>,
      },
    ];

    return (
      <div className={t.styles}>
        <Table
          locale={{
            emptyText: (
              <span>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>No resignation request is submitted</p>
              </span>
            ),
          }}
          columns={columns}
          // dataSource={data}
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
