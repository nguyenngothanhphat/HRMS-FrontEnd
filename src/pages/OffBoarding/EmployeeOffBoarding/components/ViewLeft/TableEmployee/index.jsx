/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
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
    const {
      data = [],
      textEmpty = 'No resignation request is submitted',
      loading,
      tabId,
    } = this.props;
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

    const columnsRequest = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketID',
        // width: '10%',
        render: (ticketID) => {
          return <span className={t.lastEdited}>{ticketID}</span>;
        },
      },
      {
        title: <span className={t.title}>Requested on</span>,
        dataIndex: 'requestDate',
        // width: '15%',
        render: (requestDate) => {
          return <span>{moment(requestDate).format('MM.DD.YY')}</span>;
        },
      },
      {
        title: <span className={t.title}>Assigned </span>,
        dataIndex: 'Assigned',
        // width: '10%',
        render: (_, row) => {
          const { hrManager: { generalInfo: { avatar: avtHrManager = '' } = {} } = {} } =
            this.props;
          const { manager: { generalInfo: { avatar: avtManager = '' } = {} } = {} } = row;
          const arrAvt = [avtManager, avtHrManager];
          return (
            <div className={t.rowAction}>
              <Avatar.Group
                maxCount={3}
                maxStyle={{
                  color: '#FFA100',
                  backgroundColor: '#EAF0FF',
                }}
              >
                {arrAvt.map((user) => {
                  return <Avatar size="small" style={{ backgroundColor: '#EAF0FF' }} src={user} />;
                })}
              </Avatar.Group>
            </div>
          );
        },
      },
      {
        title: <span className={t.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        // width: '10%',
        render: (lastWorkingDate) => {
          return <span>{lastWorkingDate && moment(lastWorkingDate).format('MM.DD.YY')} </span>;
        },
      },
      // {
      //   title: <span className={t.title}>Reason of leaving</span>,

      //   dataIndex: 'reasonForLeaving',
      //   render: (reasonForLeaving) => <div className={t.reason}>{reasonForLeaving}</div>,
      // },
      {
        title: <span className={t.title}>Update</span>,
        // width: '15%',
        dataIndex: 'update',
        render: (update) => <span className={t.update}>{update}</span>,
      },
      {
        title: <span className={t.title} />,
        dataIndex: '_id',
        width: '15%',
        render: (_id) => (
          <div className={t.rowAction}>
            <span className={t.rowAction__action}>Withdraw</span>
            <span className={t.rowAction__view} onClick={() => this.push(_id)}>
              View
            </span>
          </div>
        ),
      },
    ];

    const columnsDraft = [
      {
        title: <span className={t.title}>Last Edited</span>,
        dataIndex: 'requestDate',
        // width: 150,
        render: (requestDate) => {
          // return <span>{moment(createdAt).format('YYYY/MM/DD')}</p>;
          return <span className={t.lastEdited}>{moment(requestDate).format('DD-MM-YYYY')}</span>;
        },
      },
      {
        title: <span className={t.title}>Reason</span>,
        // width: 150,
        dataIndex: 'reasonForLeaving',
        render: (reasonForLeaving) => <span className={t.reason}>{reasonForLeaving}</span>,
      },
      {
        title: <span className={t.title} />,
        dataIndex: '_id',
        // width: 150,
        render: (_id) => (
          <div className={t.rowAction}>
            <span className={t.rowAction__action}>Delete</span>
            <span className={t.rowAction__view} onClick={() => this.push(_id)}>
              View
            </span>
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
          columns={tabId === '1' ? columnsRequest : columnsDraft}
          dataSource={data}
          hideOnSinglePage
          // pagination={{
          //   ...pagination,
          //   total: data.length,
          // }}
          rowKey="id"
          // scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableEmployee;
