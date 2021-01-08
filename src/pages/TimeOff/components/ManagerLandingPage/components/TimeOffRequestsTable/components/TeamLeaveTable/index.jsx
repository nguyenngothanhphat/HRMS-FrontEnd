import React, { PureComponent } from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { history, connect } from 'umi';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import moment from 'moment';
import RejectCommentModal from '../RejectCommentModal';
import styles from './index.less';

@connect(({ loading }) => ({
  loading1: loading.effects['timeOff/fetchTeamLeaveRequests'],
  loading2: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
}))
class TeamLeaveTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '17%',
      render: (id) => {
        const { ticketID = '', _id = '', onDate = '', status = '' } = id;
        const createdDate = moment(onDate).locale('en').format('YYYY/MM/DD');
        const nowDate = moment().locale('en').format('YYYY/MM/DD');
        const isNewRequest =
          status === 'IN-PROGRESS' &&
          moment(nowDate).subtract(2, 'days').isSameOrBefore(moment(createdDate));

        return (
          <span className={styles.ID} onClick={() => this.onIdClick(_id)}>
            {ticketID}
            {isNewRequest && <Tag color="#2C6DF9">New</Tag>}
          </span>
        );
      },
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment(a.onDate).isAfter(moment(b.onDate)),
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
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
      // defaultSortOrder: ['ascend'],
      // sorter: {
      //   compare: (a, b) => {
      //     const { type: { shortType: s1 = '' } = {} } = a;
      //     const { type: { shortType: s2 = '' } = {} } = b;
      //     return s1.localeCompare(s2);
      //   },
      // },
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
      align: 'left',
      render: (comment) => (comment ? <span>{comment.slice(0, 12)}...</span> : <span />),
    },
    // {
    //   title: 'Assigned',
    //   align: 'left',
    //   dataIndex: 'assigned',
    //   // width: '25%',
    //   render: (assigned) => {
    //     return (
    //       <div className={styles.rowAction}>
    //         <Avatar.Group
    //           maxCount={3}
    //           maxStyle={{
    //             color: '#FFA100',
    //             backgroundColor: '#EAF0FF',
    //           }}
    //         >
    //           {assigned.map((user) => {
    //             const { firstName = '', lastName = '', avatar = '' } = user;
    //             return (
    //               <Tooltip title={`${firstName} ${lastName}`} placement="top">
    //                 <Avatar size="small" style={{ backgroundColor: '#EAF0FF' }} src={avatar} />
    //               </Tooltip>
    //             );
    //           })}
    //         </Avatar.Group>
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'id',
      // fixed: 'right',
      // width: '20%',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        const { selectedTab = '' } = this.props;
        if (selectedTab === 'IN-PROGRESS')
          return (
            <div className={styles.rowAction}>
              <Tooltip title="View">
                <img src={OpenIcon} onClick={() => this.onOpenClick(_id)} alt="open" />
              </Tooltip>
              <Tooltip title="Approve">
                <img src={ApproveIcon} onClick={() => this.onApproveClick(_id)} alt="approve" />
              </Tooltip>
              <Tooltip title="Reject">
                <img
                  src={CancelIcon}
                  onClick={() => this.onCancelClick(_id, ticketID)}
                  alt="cancel"
                />
              </Tooltip>
            </div>
          );

        return (
          <div className={styles.rowAction}>
            <span onClick={() => this.onOpenClick(_id)}>View Request</span>
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
      commentModalVisible: false,
      rejectingId: '',
      rejectingTicketID: '',
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

  onRefreshTable = (onMovedTab) => {
    const { onRefreshTable = () => {} } = this.props;
    onRefreshTable(onMovedTab);
  };

  onApproveClick = async (_id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/reportingManagerApprove',
      payload: {
        _id,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.onRefreshTable('2');
    }
  };

  onCancelClick = (_id, ticketID) => {
    this.toggleCommentModal(true);
    this.setState({
      rejectingId: _id,
      rejectingTicketID: ticketID,
    });
  };

  onReject = async (comment) => {
    const { dispatch } = this.props;
    const { rejectingId } = this.state;
    const res = await dispatch({
      type: 'timeOff/reportingManagerReject',
      payload: {
        _id: rejectingId,
        comment,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.toggleCommentModal(false);
      this.onRefreshTable('3');
    }
  };

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
        // cc = [],
        ticketID = '',
        _id = '',
        onDate = '',
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
          onDate,
          status,
        },
        requestee: `${firstName} ${lastName}`,
      };
    });
  };

  toggleCommentModal = (value) => {
    this.setState({
      commentModalVisible: value,
    });
  };

  render() {
    const { data = [], loading1, loading2, selectedTab = '' } = this.props;
    const { selectedRowKeys, pageSelected, commentModalVisible, rejectingTicketID } = this.state;
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
      selectedTab === 'REJECTED'
        ? this.columns.filter((col) => col.dataIndex !== 'assigned')
        : this.columns.filter((col) => col.dataIndex !== 'comment');

    return (
      <div className={styles.TeamLeaveTable}>
        <Table
          size="middle"
          loading={loading1 || loading2}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: parsedData.length }}
          columns={tableByRole}
          dataSource={parsedData}
          scroll={scroll}
          rowKey={(id) => id.ticketID}
        />
        <RejectCommentModal
          visible={commentModalVisible}
          onClose={() => this.toggleCommentModal(false)}
          onReject={this.onReject}
          ticketID={rejectingTicketID}
        />
      </div>
    );
  }
}

export default TeamLeaveTable;
