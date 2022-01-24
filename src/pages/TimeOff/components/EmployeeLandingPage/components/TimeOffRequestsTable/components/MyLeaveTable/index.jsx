import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip, Tag, Spin } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import DefaultAvatar from '@/assets/defaultAvatar.png';

import styles from './index.less';

const { IN_PROGRESS } = TIMEOFF_STATUS;
// loading
@connect(({ loading, dispatch, timeOff: { paging } }) => ({
  paging,
  dispatch,
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
}))
class MyLeaveTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '20%',
      render: (id) => {
        const { ticketID = '', _id = '', updated = false, status = '' } = id;
        const checkUpdated = status === IN_PROGRESS && updated;
        return (
          <span className={styles.ID} onClick={() => this.viewRequest(_id)}>
            {ticketID}
            {checkUpdated && <Tag color="#2C6DF9">Updated</Tag>}
          </span>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
      render: (type) => <span>{type ? type.name : '-'}</span>,
      // defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => {
          const { type: { shortType: s1 = '' } = {} } = a;
          const { type: { shortType: s2 = '' } = {} } = b;
          return s1.localeCompare(s2);
        },
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },

    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'leaveTimes',
      align: 'left',
      render: (leaveTimes) => <span>{leaveTimes !== '' ? leaveTimes : '-'}</span>,
    },
    {
      title: `Requested on `,
      dataIndex: 'onDate',
      align: 'center',
      // width: '30%',
      render: (onDate) => <span>{moment.utc(onDate).locale('en').format('MM/DD/YYYY')}</span>,
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment.utc(a.onDate).isAfter(moment.utc(b.onDate)),
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'center',
      render: (duration) => <span>{duration !== 0 ? duration : '-'}</span>,
    },
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'assigned',
      // width: '25%',
      render: (assigned) => {
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={3}
              maxStyle={{
                color: '#FFA100',
                backgroundColor: '#EAF0FF',
              }}
            >
              {assigned.map((user) => {
                const { firstName = '', lastName = '', avatar = '' } = user;
                return (
                  <Tooltip title={`${firstName} ${lastName}`} placement="top">
                    <Avatar
                      size="small"
                      style={{ backgroundColor: '#EAF0FF' }}
                      src={avatar || DefaultAvatar}
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </div>
        );
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      align: 'left',
      width: '15%',
      dataIndex: '_id',
      // width: '20%',
      render: (_id) => (
        <div className={styles.rowAction}>
          <span onClick={() => this.viewRequest(_id)}>View Request</span>
        </div>
      ),
    },
  ];

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
      // state: { location: name },
    });
  };

  // pagination
  onChangePagination = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: pageNumber,
      },
    });
  };

  // setFirstPage = () => {
  //   this.setState({
  //     pageSelected: 1,
  //   });
  // };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        status = '',
        fromDate = '',
        toDate = '',
        approvalManager: { generalInfo: generalInfoA = {} } = {},
        // cc = [],
        ticketID = '',
        _id = '',
        updated = false,
      } = value;

      let leaveTimes = '';
      if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
        leaveTimes = `${moment.utc(fromDate).locale('en').format('MM/DD/YYYY')} - ${moment
          .utc(toDate)
          .locale('en')
          .format('MM/DD/YYYY')}`;
      }

      // let employeeFromCC = [];
      // if (cc.length > 0) {
      //   employeeFromCC = cc[0].map((each) => {
      //     return each;
      //   });
      // }
      // const assigned = [generalInfoA, ...employeeFromCC];

      return {
        ...value,
        leaveTimes,
        // assigned,
        assigned: [generalInfoA],
        id: {
          ticketID,
          _id,
          updated,
          status,
        },
      };
    });
  };

  render() {
    const {
      data = [],
      loadingFetchLeaveRequests = false,
      paging: { page, limit, total },
    } = this.props;
    // const rowSize = 10;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loadingFetchLeaveRequests,
      indicator: <Spin indicator={antIcon} />,
    };

    const parsedData = this.processData(data);

    const pagination = {
      position: ['bottomLeft'],
      total,
      showTotal: (totals, range) => (
        <span>
          {' '}
          Showing{'  '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {totals}{' '}
        </span>
      ),
      pageSize: limit,
      current: page,
      onChange: this.onChangePagination,
    };

    const scroll = {
      x: '60vw',
      y: 'max-content',
    };

    return (
      <div className={styles.MyLeaveTable}>
        <Table
          // size="middle"
          loading={tableLoading}
          // rowSelection={rowSelection}
          pagination={{ ...pagination, total }}
          columns={this.columns}
          dataSource={parsedData}
          scroll={scroll}
          rowKey={(id) => id.ticketID}
        />
        {parsedData.length === 0 && <div className={styles.paddingContainer} />}
      </div>
    );
  }
}

export default MyLeaveTable;
