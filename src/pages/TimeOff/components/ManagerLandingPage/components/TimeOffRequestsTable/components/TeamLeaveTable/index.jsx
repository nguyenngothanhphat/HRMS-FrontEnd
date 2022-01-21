import React, { PureComponent } from 'react';
import { Table, Tag, Tooltip, Spin } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
// import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';

import RejectCommentModal from '../RejectCommentModal';

import styles from './index.less';

const { IN_PROGRESS, REJECTED } = TIMEOFF_STATUS;
@connect(({ dispatch, user: { currentUser = {} }, timeOff: { paging }, loading }) => ({
  dispatch,
  currentUser,
  paging,
  loading1: loading.effects['timeOff/fetchTeamLeaveRequests'],
  // loading2: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  loading3: loading.effects['timeOff/approveMultipleTimeoffRequest'],
  loading4: loading.effects['timeOff/rejectMultipleTimeoffRequest'],
  loading5: loading.effects['timeOff/reportingManagerApprove'],
  loading6: loading.effects['timeOff/reportingManagerReject'],
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
        const createdDate = moment.utc(onDate).locale('en').format('YYYY/MM/DD');
        const nowDate = moment.utc().locale('en').format('YYYY/MM/DD');
        const isNewRequest =
          status === IN_PROGRESS &&
          moment.utc(nowDate).subtract(2, 'days').isSameOrBefore(moment.utc(createdDate));

        return (
          <span className={styles.ID} onClick={() => this.onIdClick(_id)}>
            {ticketID}
            {isNewRequest && <Tag color="#2C6DF9">New</Tag>}
          </span>
        );
      },
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment.utc(a.onDate).isAfter(moment.utc(b.onDate)),
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
      render: (type) => <span>{type ? type.name : '-'}</span>,
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
      render: (leaveTimes) => (leaveTimes !== '' ? <span>{leaveTimes}</span> : <span>-</span>),
    },
    // {
    //   title: `Req’ted on `,
    //   dataIndex: 'onDate',
    //   align: 'center',
    //   // width: '30%',
    //   render: (onDate) => <span>{moment.utc(onDate).locale('en').format('MM/DD/YYYY')}</span>,
    //   defaultSortOrder: ['ascend'],
    //   sorter: {
    //     compare: (a, b) => moment.utc(a.onDate).isAfter(moment.utc(b.onDate)),
    //   },
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    // },
    {
      title: 'Comment',
      dataIndex: 'comment',
      align: 'left',
      render: (comment) =>
        comment ? (
          <span>{comment.length >= 12 ? `${comment.slice(0, 12)}...` : comment}</span>
        ) : (
          <span>-</span>
        ),
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
      fixed: 'right',
      width: '10%',
      // width: '20%',
      render: (id) => {
        const { ticketID = '', _id = '', approvalManagerId = '' } = id;
        const { selectedTab = '', currentUser: { employee: { _id: myId = '' } = {} } = {} } =
          this.props;

        // only manager accept/reject a ticket
        const isMyTicket = myId === approvalManagerId;

        if (selectedTab === IN_PROGRESS)
          return (
            <div className={styles.rowAction}>
              <Tooltip title="View">
                <img src={OpenIcon} onClick={() => this.onOpenClick(_id)} alt="open" />
              </Tooltip>
              {isMyTicket && (
                <>
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
                </>
              )}
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
      // pageSelected: 1,
      selectedRowKeys: [],
      commentModalVisible: false,
      rejectingId: '',
      rejectingTicketID: '',
      rejectMultiple: false,
    };
  }

  // HANDLE TEAM REQUESTS
  onOpenClick = (_id) => {
    history.push({
      pathname: `/time-off/overview/manager-timeoff/view/${_id}`,
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
    this.setState({
      rejectingId: _id,
      rejectingTicketID: ticketID,
    });
    this.toggleCommentModal(true);
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
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
      // state: { location: name },
    });
  };

  // pagination
  onChangePagination = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: pageNumber },
    });
  };

  // setFirstPage = () => {
  //   this.setState({
  //     pageSelected: 1,
  //   });
  // };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    const { selectedTab = '', onHandle = () => {}, loading3, loading4 } = this.props;
    if (selectedTab === IN_PROGRESS) {
      const payload = {
        onApprove: this.onMultipleApprove,
        onReject: this.onMultipleCancelClick,
        length: selectedRowKeys.length,
        loading3,
        loading4,
      };
      onHandle(payload);
    } else onHandle({});
  };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        status = '',
        fromDate = '',
        toDate = '',
        approvalManager: { _id: approvalManagerId = '', generalInfo: generalInfoA = {} } = {},
        // cc = [],
        ticketID = '',
        _id = '',
        onDate = '',
        employee: { generalInfo: { firstName = '', lastName = '' } = {} },
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
          onDate,
          status,
          approvalManagerId,
        },
        requestee: `${firstName} ${lastName}`,
      };
    });
  };

  toggleCommentModal = (value) => {
    this.setState({
      commentModalVisible: value,
    });
    if (!value) {
      // this.setState({
      //   multipleCheckModalVisible: false,
      // });
      setTimeout(() => {
        this.setState({
          rejectMultiple: false,
        });
      }, 500);
    }
  };

  // on multiple checkbox
  onMultipleApprove = async () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/approveMultipleTimeoffRequest',
      payload: {
        ticketList: selectedRowKeys,
      },
    });
    if (statusCode === 200) {
      this.setState({
        selectedRowKeys: [],
      });
      const { onHandle = () => {} } = this.props;
      const payload = {
        length: 0,
      };
      onHandle(payload);
      this.onRefreshTable('2');
    }
  };

  onMultipleCancelClick = () => {
    this.toggleCommentModal(true);
    this.setState({
      rejectMultiple: true,
    });
  };

  onMultipleReject = async (comment) => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/rejectMultipleTimeoffRequest',
      payload: {
        ticketList: selectedRowKeys,
        comment,
      },
    });
    if (statusCode === 200) {
      this.setState({
        selectedRowKeys: [],
      });
      const { onHandle = () => {} } = this.props;
      const payload = {
        length: 0,
      };
      onHandle(payload);
      this.toggleCommentModal(false);
      this.onRefreshTable('3');
    }
  };

  render() {
    const {
      data = [],
      loading1 = false,
      loading3 = false,
      loading4 = false,
      loading5 = false,
      loading6 = false,
      selectedTab = '',
      paging: { page, limit, total },
      // currentUser: { employee: { _id: myId = '' } = {} } = {},
    } = this.props;

    const {
      selectedRowKeys,
      // pageSelected,
      commentModalVisible,
      rejectingTicketID,
      rejectMultiple,
    } = this.state;
    // const rowSize = 10;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loading1 || loading3 || loading5,
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

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const tableByRole =
      selectedTab === REJECTED
        ? this.columns.filter((col) => col.dataIndex !== 'assigned')
        : this.columns.filter((col) => col.dataIndex !== 'comment');

    return (
      <div className={styles.TeamLeaveTable}>
        <Table
          // size="middle"
          loading={tableLoading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total }}
          columns={tableByRole}
          dataSource={parsedData}
          scroll={scroll}
          rowKey={(id) => id._id}
        />
        {parsedData.length === 0 && <div className={styles.paddingContainer} />}
        <RejectCommentModal
          visible={commentModalVisible}
          onClose={() => this.toggleCommentModal(false)}
          onReject={rejectMultiple ? this.onMultipleReject : this.onReject}
          ticketID={rejectingTicketID}
          rejectMultiple={rejectMultiple}
          loading={loading4 || loading6}
        />
      </div>
    );
  }
}

export default TeamLeaveTable;
