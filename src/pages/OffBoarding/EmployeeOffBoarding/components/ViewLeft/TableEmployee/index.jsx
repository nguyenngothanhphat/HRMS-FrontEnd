import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import t from './index.less';

class TableEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  push = (data) => {
    history.push(`/offboarding/review/${data}`);
  };

  render() {
    const { data = [] } = this.props;
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
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
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
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
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
        render: (reasonForLeaving) => <div className={t.reason}>{reasonForLeaving}</div>,
      },
      {
        title: <span className={t.title}>Action</span>,
        dataIndex: '_id',
        render: (_id) => (
          <div className={t.rowAction}>
            <span onClick={() => this.push(_id)}>View Request</span>
          </div>
        ),
      },
    ];

    return (
      <div className={t.employeeTable}>
        <Table
          locale={{
            emptyText: (
              <span>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>No resignation request is submitted</p>
              </span>
            ),
          }}
          hidein
          columns={columns}
          dataSource={data}
          hideOnSinglePage
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
