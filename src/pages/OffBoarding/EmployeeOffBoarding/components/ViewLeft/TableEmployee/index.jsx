/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Table, Avatar, Popconfirm } from 'antd';
import moment from 'moment';
import { history, connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import t from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['offboarding/fetchList'],
}))
class TableEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: 1,
    };
  }

  // onChangePagination = (pageNumber) => {
  //   this.setState({
  //     pageNavigation: pageNumber,
  //   });
  // };

  push = (data) => {
    history.push(`/offboarding/review/${data}`);
  };

  handleWithDraw = (id) => {
    const {
      dispatch,
      // data = [],
      fetchData = () => {},
    } = this.props;
    // const getStatus = data.map((item) => (item._id === id ? item.status : null)).join('');

    // if (getStatus === 'ACCEPTED' || getStatus === 'REJECTED') {
    //   dispatch({
    //     type: 'offboarding/handleWithdrawApproval',
    //     payload: {
    //       id,
    //       action: getStatus,
    //     },
    //     isNotStatusAccepted: true,
    //   }).then(() => {
    //     fetchData();
    //   });
    // } else {
    dispatch({
      type: 'offboarding/handleWithdraw',
      payload: {
        id,
      },
      isNotStatusAccepted: true,
    }).then(() => {
      fetchData();
    });
    // }
  };

  render() {
    const {
      data = [],
      textEmpty = 'No resignation request is submitted',
      loading,
      tabId,
      pageSelected,
      size,
      getPageAndSize = () => {},
      total: totalData,
    } = this.props;

    // const { pageNavigation } = this.state;

    const confirm = (id) => {
      this.handleWithDraw(id);
    };

    const cancel = (e) => {};

    // const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: totalData,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
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
            <Popconfirm
              title="Are you sure to withdraw this offboarding ticket?"
              onConfirm={() => confirm(_id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <span className={t.rowAction__action}>Withdraw</span>
            </Popconfirm>
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
          return <span className={t.lastEdited}>{moment(requestDate).format('MM.DD.YY')}</span>;
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
          pagination={pagination}
          rowKey="id"
          // scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableEmployee;
