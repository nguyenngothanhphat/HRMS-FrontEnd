import React, { PureComponent } from 'react';
import { Table, Tag, Tooltip, Spin } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import { TIMEOFF_DATE_FORMAT, TIMEOFF_STATUS } from '@/utils/timeOff';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';

import RejectCommentModal from '../RejectCommentModal';

import styles from './index.less';

const { IN_PROGRESS, REJECTED, ON_HOLD } = TIMEOFF_STATUS;

const COLUMN_WIDTH = {
  TYPE_A: {
    TICKET_ID: '15%',
    REQUESTEE: '15%',
    TYPE: '17%',
    // LEAVE_DATES: '25%',
    DURATION: '15%',
    ACTION: '15%',
  },
  TYPE_B: {
    TICKET_ID: '15%',
    REQUESTEE: '14%',
    TYPE: '19%',
    LEAVE_DATES: '25%',
    DURATION: '11%',
    COMMENT: '17%',
    ACTION: '15%',
  },
};
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
  loading7: loading.effects['timeOff/fetchAllLeaveRequests'],
}))
class TeamLeaveTable extends PureComponent {
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

  getColumns = (TYPE) => {
    return [
      {
        title: 'Ticket ID',
        dataIndex: 'ticketID',
        align: 'left',
        fixed: 'left',
        width: COLUMN_WIDTH[TYPE].TICKET_ID,
        render: (_, record) => {
          const { ticketID = '', _id = '', onDate = '', status = '' } = record;
          const createdDate = moment(onDate).locale('en').format('YYYY/MM/DD');
          const nowDate = moment().locale('en').format('YYYY/MM/DD');
          const isNewRequest =
            status === IN_PROGRESS &&
            moment(nowDate).subtract(2, 'days').isSameOrBefore(moment(createdDate));
          // const checkWithdraw = status === ON_HOLD;

          return (
            <span className={styles.ID} onClick={() => this.onIdClick(_id)}>
              <span className={styles.text}>{ticketID}</span>
              {isNewRequest && <Tag color="#2C6DF9">New</Tag>}
              {/* {checkWithdraw && <Tag color="#2C6DF9">Withdrawing</Tag>} */}
            </span>
          );
        },
      },
      {
        title: 'Requestee',
        dataIndex: 'employee',
        width: COLUMN_WIDTH[TYPE].REQUESTEE,
        align: 'left',
        render: (employee) => <span>{employee?.generalInfo?.legalName || '-'}</span>,
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: COLUMN_WIDTH[TYPE].TYPE,
        align: 'center',
        render: (type, record) => {
          if (record.status === ON_HOLD) return <span>Withdraw Request</span>;
          return <span>{type ? type.name : '-'}</span>;
        },
      },

      {
        title: 'Leave Dates',
        width: COLUMN_WIDTH[TYPE].LEAVE_DATES,
        dataIndex: 'leaveTimes',
        align: 'left',
        render: (_, record) => {
          return `${moment(record.fromDate).locale('en').format(TIMEOFF_DATE_FORMAT)} - ${moment(
            record.toDate,
          )
            .locale('en')
            .format(TIMEOFF_DATE_FORMAT)}`;
        },
        defaultSortOrder: ['ascend'],
        sorter: {
          compare: (a, b) =>
            a.fromDate && b.fromDate ? moment(a.fromDate).isAfter(moment(b.fromDate)) : false,
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Duration',
        width: COLUMN_WIDTH[TYPE].DURATION,
        dataIndex: 'duration',
        align: 'center',
        render: (duration) => (
          <span>{duration !== 0 ? Math.round(duration * 100) / 100 : '-'}</span>
        ),
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        align: 'left',
        width: COLUMN_WIDTH[TYPE].COMMENT,
        render: (comment) =>
          comment ? (
            <span>{comment.length >= 12 ? `${comment.slice(0, 12)}...` : comment}</span>
          ) : (
            <span>-</span>
          ),
      },
      {
        title: 'Action',
        align: 'left',
        dataIndex: 'action',
        fixed: 'right',
        width: COLUMN_WIDTH[TYPE].ACTION,
        // width: '20%',
        render: (_, record) => {
          const { ticketID = '', _id = '', approvalManager = '' } = record;
          const {
            isHR = false,
            selectedTab = '',
            currentUser: { employee: { _id: myId = '' } = {} } = {},
          } = this.props;

          // only manager accept/reject a ticket
          const isMyTicket = myId === approvalManager?._id || isHR;

          if (selectedTab === IN_PROGRESS)
            return (
              <div className={styles.rowAction}>
                <Tooltip title="View">
                  <img src={OpenIcon} onClick={() => this.onOpenClick(_id)} alt="open" />
                </Tooltip>
                {isMyTicket && record.status !== ON_HOLD && (
                  <>
                    <Tooltip title="Approve">
                      <img
                        src={ApproveIcon}
                        onClick={() => this.onApproveClick(_id)}
                        alt="approve"
                      />
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
  };

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
      this.onRefreshTable('1');
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
      this.onRefreshTable('1');
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
      this.onRefreshTable('1');
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
      this.onRefreshTable('1');
    }
  };

  renderEmptyTableContent = () => {
    const { tab = 0, category } = this.props;

    if (category === 'MY') {
      switch (tab) {
        case 1:
          return (
            <>
              You have not applied for any Leave requests. <br />
              Submitted Casual, Sick & Compoff requests will be displayed here.
            </>
          );
        case 2:
          return (
            <>
              You have not applied for any Special Leave requests.
              <br />
              Submitted Restricted Holiday, Bereavement, Marriage & Maternity/ Paternity leave
              requests will be displayed here.
            </>
          );
        case 3:
          return <>You have not applied for any LWP requests.</>;
        case 4:
          return <>You have not applied any request to Work from home or Client’s place.</>;
        case 5:
          return <>You have not submitted any requests to earn compensation leaves.</>;
        default:
          return '';
      }
    }

    switch (tab) {
      case 1:
        return (
          <>
            No Leave requests received. <br />
            Submitted Casual, Sick & Compoff requests will be displayed here.
          </>
        );
      case 2:
        return (
          <>
            No Special Leave requests received. <br />
            Submitted Restricted Holiday, Bereavement, Marriage & Maternity/ Paternity leave
            requests will be displayed here.
          </>
        );
      case 3:
        return (
          <>
            No LWP requests received. <br />
          </>
        );
      case 4:
        return <>No Work from home or Client’s place requests received.</>;
      case 5:
        return <>No Compoff requests received.</>;
      default:
        return 'No data';
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
      loading7 = false,
      selectedTab = '',
      paging: { page, limit, total },
      // currentUser: { employee: { _id: myId = '' } = {} } = {},
      currentUser: { employee: { _id: myId = '' } = {} } = {},
      isHR = false,
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
      spinning: loading1 || loading3 || loading5 || loading7,
      indicator: <Spin indicator={antIcon} />,
    };

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
      x: selectedTab !== REJECTED ? '50vw' : '58vw',
      y: 'max-content',
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => {
        const {
          approvalManager: { _id: approvalManagerId = '' },
        } = record;

        return {
          disabled:
            (selectedTab === IN_PROGRESS && myId !== approvalManagerId && !isHR) ||
            record.status === ON_HOLD, // Column configuration not to be checked
          name: record.name,
        };
      },
    };

    const tableByRole =
      selectedTab !== REJECTED
        ? this.getColumns('TYPE_A').filter((col) => col.dataIndex !== 'comment')
        : this.getColumns('TYPE_B');

    return (
      <div className={styles.TeamLeaveTable}>
        <Table
          // size="middle"
          loading={tableLoading}
          rowSelection={rowSelection}
          pagination={data.length === 0 ? null : { ...pagination, total }}
          columns={tableByRole}
          dataSource={data}
          scroll={scroll}
          rowKey={(id) => id._id}
          locale={{
            emptyText: (
              <div className={styles.emptyTable}>
                <img src={EmptyIcon} alt="empty-table" />
                <p className={styles.describeTexts}>{this.renderEmptyTableContent()}</p>
              </div>
            ),
          }}
        />
        {data.length === 0 && <div className={styles.paddingContainer} />}
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
