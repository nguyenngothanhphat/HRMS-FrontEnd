/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Table, Avatar } from 'antd';
import moment from 'moment';
import { history, connect } from 'umi';
import { UserOutlined } from '@ant-design/icons';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import t from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['offboarding/fetchList'],
}))
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
        title: <span className={t.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const {
            hrManager: { generalInfo: { avatar: avtHrManager = '' } = {} } = {},
          } = this.props;
          const { manager: { generalInfo: { avatar: avtManager = '' } = {} } = {} } = row;
          const arrAvt = [avtManager, avtHrManager];
          return (
            <div className={t.rowAction}>
              {arrAvt.map(
                (item, index) =>
                  item && (
                    <div key={index} style={{ marginRight: '13px', display: 'inline-block' }}>
                      <Avatar src={item} size={20} icon={<UserOutlined />} />
                    </div>
                  ),
              )}
            </div>
          );
        },
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
              <div className={t.viewEmpty}>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
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
