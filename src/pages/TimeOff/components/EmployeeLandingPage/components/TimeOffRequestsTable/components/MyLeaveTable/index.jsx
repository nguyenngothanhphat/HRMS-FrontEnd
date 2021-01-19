import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip, Tag } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

@connect(({ loading }) => ({
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
        const checkUpdated = status === 'IN-PROGRESS' && updated;
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
      render: (type) => <span>{type ? type.shortType : '-'}</span>,
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
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'center',
      // width: '30%',
      render: (onDate) => <span>{moment(onDate).locale('en').format('DD.MM.YY')}</span>,
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment(a.onDate).isAfter(moment(b.onDate)),
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
                    <Avatar size="small" style={{ backgroundColor: '#EAF0FF' }} src={avatar} />
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
      align: 'left',
      dataIndex: '_id',
      // width: '20%',
      render: (_id) => (
        <div className={styles.rowAction}>
          <span onClick={() => this.viewRequest(_id)}>View Request</span>
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/view-request/${_id}`,
      // state: { location: name },
    });
  };

  // pagination
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    // eslint-disable-next-line no-console
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        status = '',
        fromDate = '',
        toDate = '',
        approvalManager: { generalInfo: generalInfoA = {} } = {},
        cc = [],
        ticketID = '',
        _id = '',
        updated = false,
      } = value;

      let leaveTimes = '';
      if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
        leaveTimes = `${moment(fromDate).locale('en').format('DD.MM.YY')} - ${moment(toDate)
          .locale('en')
          .format('DD.MM.YY')}`;
      }

      let employeeFromCC = [];
      if (cc.length > 0) {
        employeeFromCC = cc[0].map((each) => {
          return each;
        });
      }
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
    const { data = [], loadingFetchLeaveRequests } = this.props;
    const { selectedRowKeys, pageSelected } = this.state;
    const rowSize = 10;

    const parsedData = this.processData(data);

    const pagination = {
      position: ['bottomLeft'],
      total: parsedData.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          Showing{'  '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const scroll = {
      x: '60vw',
      y: 'max-content',
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.MyLeaveTable}>
        <Table
          size="middle"
          loading={loadingFetchLeaveRequests}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: parsedData.length }}
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
