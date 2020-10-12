import React, { PureComponent } from 'react';
import { Table } from 'antd';
import empty from '@/assets/empty.svg';
// import persion from '@/assets/people.svg';
import t from './index.less';

class TableEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const data = [
    //   {
    //     ticketId: <span className={t.tableText}>16003134</span>,
    //     requestOn: <span className={t.tableText}>22.08.2020</span>,
    //     lwd: '',
    //     lwdchange: '',
    //     assigned: (
    //       <p>
    //         <span>
    //           <img src={persion} style={{ marginTop: '10px' }} alt="" />
    //         </span>
    //         <span>
    //           <img src={persion} style={{ marginTop: '10px' }} alt="" />
    //         </span>
    //       </p>
    //     ),
    //     reasionOfLeaving: <span className={t.tableText}>I have decide to quit….</span>,
    //     action: (
    //       <span className={t.tableText} style={{ color: 'blue', textDecoration: 'underline' }}>
    //         View Request
    //       </span>
    //     ),
    //   },
    // ];

    const columns = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketId',
      },
      {
        title: <span className={t.title}>Requested on</span>,
        dataIndex: 'requestOn',
      },
      {
        title: <span className={t.title}>LWD</span>,
        dataIndex: 'lwd',
      },
      {
        title: <span className={t.title}>LWD Change</span>,
        dataIndex: 'lwdChange',
      },
      {
        title: <span className={t.title}>Assigned</span>,
        dataIndex: 'assigned',
      },
      {
        title: <span className={t.title}>Reason of leaving</span>,
        dataIndex: 'reasionOfLeaving',
      },
      {
        title: <span className={t.title}>Action</span>,
        dataIndex: 'action',
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
