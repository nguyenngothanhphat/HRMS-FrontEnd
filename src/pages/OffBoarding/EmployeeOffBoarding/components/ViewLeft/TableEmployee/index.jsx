import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import t from './index.less';

class TableEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = (data) => {
    history.push(`/employee-offboarding/request/${data}`);
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
    };

    const columns = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketId',
      },
      {
        title: <span className={t.title}>Requested on</span>,
        dataIndex: 'createdAt',
        render: (createdAt) => {
          return <p>{moment(createdAt).format('YYYY/MM/DD')}</p>;
        },
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
        dataIndex: 'reasonForLeaving',
      },
      {
        title: <span className={t.title}>Action</span>,
        dataIndex: 'action',
        render: () => (
          <div className={t.rowAction}>
            <span onClick={() => this.push(data.map((x) => x._id))}>View Request</span>
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
