import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { history } from 'umi';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import t from './index.less';

class TableEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = () => {
    history.push('/employee-offboarding/request/112454');
  };

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
    };

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
        render: () => (
          <div className={t.rowAction}>
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
        title: <span className={t.title}>Reason of leaving</span>,
        dataIndex: 'reasionOfLeaving',
      },
      {
        title: <span className={t.title}>Action</span>,
        dataIndex: 'action',
        render: () => (
          <div className={t.rowAction}>
            <span onClick={this.push}>View Request</span>
          </div>
        ),
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
          dataSource={data}
          pagination={{
            ...pagination,
            total: data.length,
          }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableEmployee;
