import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history, connect } from 'umi';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import moment from 'moment';
import styles from './index.less';

@connect(({ loading }) => ({
  loading1: loading.effects['timeOff/fetchTeamLeaveRequests'],
  loading2: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
}))
class DataTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      // width: '20%',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        return (
          <span className={styles.ID} onClick={() => this.viewRequest(_id)}>
            ID
          </span>
        );
      },
    },
    {
      title: 'Requestee',
      dataIndex: 'requestee',
      align: 'left',
      render: (requestee) => <span>{requestee}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
      render: (type) => <span>{type ? type.shortType : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },

    {
      title: 'Duration',
      width: '20%',
      dataIndex: 'leaveTimes',
      align: 'left',
    },
    // {
    //   title: `Req’ted on `,
    //   dataIndex: 'onDate',
    //   align: 'center',
    //   // width: '30%',
    //   render: (onDate) => <span>{moment(onDate).locale('en').format('MM.DD.YYYY')}</span>,
    //   defaultSortOrder: ['ascend'],
    //   sorter: {
    //     compare: (a, b) => moment(a.onDate).isAfter(moment(b.onDate)),
    //   },
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    // },
    {
      title: 'Comment',
      dataIndex: 'comment',
      align: 'center',
      render: () => <span />,
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
      align: 'center',
      dataIndex: '_id',
      // width: '20%',
      render: (_id) => {
        const { selectedTab = '' } = this.props;
        if (selectedTab === 'IN-PROGRESS')
          return (
            <div className={styles.rowAction}>
              <img src={OpenIcon} onClick={() => this.onOpenClick(_id)} alt="open" />
              <img src={ApproveIcon} onClick={this.onApproveClick} alt="approve" />
              <img src={CancelIcon} onClick={this.onCancelClick} alt="cancel" />
            </div>
          );

        return (
          <div className={styles.rowAction}>
            <span onClick={() => this.viewRequest(_id)}>View Request</span>
          </div>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  // HANDLE TEAM REQUESTS
  onOpenClick = (_id) => {
    history.push({
      pathname: `/time-off/manager-view-request/${_id}`,
      // state: { location: name },
    });
  };

  onIdClick = (_id) => {
    this.onOpenClick(_id);
  };

  onApproveClick = () => {
    alert('Approve');
  };

  onCancelClick = () => {
    alert('Cancel');
  };

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/view-compoff-request/${_id}`,
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
        fromDate = '',
        toDate = '',
        approvalManager: { generalInfo: generalInfoA = {} } = {},
        cc = [],
        ticketID = '',
        _id = '',
        employee: { generalInfo: { firstName = '', lastName = '' } = {} },
      } = value;

      let leaveTimes = '';
      if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
        leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YYYY')} - ${moment(toDate)
          .locale('en')
          .format('MM.DD.YYYY')}`;
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
        },
        requestee: `${firstName} ${lastName}`,
      };
    });
  };

  render() {
    const { data = [], loading1, loading2, selectedTab = '' } = this.props;
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

    const tableByRole =
      selectedTab === 'REJECTED' || selectedTab === 'APPROVED'
        ? this.columns.filter((col) => col.dataIndex !== 'assigned')
        : this.columns.filter((col) => col.dataIndex !== 'comment');

    return (
      <div className={styles.DataTable}>
        <Table
          size="middle"
          loading={loading1 || loading2}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: parsedData.length }}
          columns={tableByRole}
          dataSource={parsedData}
          scroll={scroll}
          rowKey="_id"
        />
      </div>
    );
  }
}

export default DataTable;
