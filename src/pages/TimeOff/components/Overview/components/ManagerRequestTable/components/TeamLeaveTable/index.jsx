import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, history, Link } from 'umi';
import ApproveIcon from '@/assets/approveTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import {
  isNewRequest,
  isUpdatedRequest,
  checkNormalTypeTimeoff,
  roundNumber,
} from '@/utils/timeOff';
import RejectCommentModal from '../RejectCommentModal';
import styles from './index.less';
import { TIMEOFF_DATE_FORMAT, TIMEOFF_STATUS } from '@/constants/timeOff';
import CommonTable from '@/components/CommonTable';

const { IN_PROGRESS, REJECTED, ON_HOLD } = TIMEOFF_STATUS;

const COLUMN_WIDTH = {
  TYPE_A: {
    TICKET_ID: '17%',
    REQUESTEE: '15%',
    TYPE: '17%',
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
  loading1: loading.effects['timeOff/fetchLeaveRequests'],
  loading3: loading.effects['timeOff/approveMultipleRequests'],
  loading4: loading.effects['timeOff/rejectMultipleRequests'],
  loading5: loading.effects['timeOff/approveRequest'],
  loading6: loading.effects['timeOff/rejectRequest'],
}))
class TeamLeaveTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      commentModalVisible: false,
      rejectingPayload: {},
      rejectMultiple: false,
    };
  }

  // HANDLE TEAM REQUESTS
  onOpenClick = (_id) => {
    history.push({
      pathname: `/time-off/overview/manager-timeoff/view/${_id}`,
    });
  };

  dataHover = (employee) => {
    const {
      generalInfoInfo: {
        legalName = '',
        avatar: avatar1 = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        skills = [],
      } = {},
      generalInfoInfo = {},
      department = {},
      locationInfo = {},
      managerInfo = {},
      titleInfo = {},
    } = employee;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      locationInfo,
      generalInfo: generalInfoInfo,
      managerInfo,
      titleInfo,
      avatar1,
      skills,
    };
  };

  getListDate = (listDate) => {
    return listDate.map((x) => (
      <div>
        {`${moment(x.date).locale('en').format('DD')} ${moment(x.date)
          .locale('en')
          .format('MMM')} (${x.timeOfDay})`}
      </div>
    ));
  };

  formatDate = (date1, date2) => {
    return `${moment(date1).locale('en').format(TIMEOFF_DATE_FORMAT)} - ${moment(date2)
      .locale('en')
      .format(TIMEOFF_DATE_FORMAT)}`;
  };

  getColumns = (TYPE) => {
    return [
      {
        title: 'Ticket ID',
        dataIndex: 'ticketID',
        align: 'left',
        fixed: 'left',
        width: COLUMN_WIDTH[TYPE].TICKET_ID,
        render: (_, record) => {
          const { ticketID = '', _id = '', onDate = '', updated = false, status = '' } = record;
          const isUpdated = isUpdatedRequest(status, updated);
          const isNew = isNewRequest(status, onDate);
          return (
            <span className={styles.ID}>
              <Link to={`/time-off/overview/manager-timeoff/view/${_id}`}>
                <span className={styles.text}>{ticketID}</span>
              </Link>
              {isUpdated && <Tag color="#2C6DF9">Updated</Tag>}
              {isNew && !isUpdated && <Tag color="#2C6DF9">New</Tag>}
            </span>
          );
        },
      },
      {
        title: 'Requestee',
        dataIndex: 'employee',
        width: COLUMN_WIDTH[TYPE].REQUESTEE,
        align: 'left',
        render: (employee) => {
          const { generalInfoInfo: { legalName = '' } = {} } = employee;
          return (
            <UserProfilePopover data={this.dataHover(employee)}>
              <span style={{ cursor: 'pointer' }}>{legalName}</span>
            </UserProfilePopover>
          );
        },
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
          const { fromDate = '', toDate = '', leaveDates = [], type: { type = '' } = {} } = record;
          const listLeave = leaveDates.sort((a, b) => moment(a.date) - moment(b.date));
          if (!checkNormalTypeTimeoff(type)) {
            return this.formatDate(fromDate, toDate);
          }
          return (
            <Tooltip title={() => this.getListDate(leaveDates)}>
              {this.formatDate(listLeave[0].date, listLeave[listLeave.length - 1].date)}
            </Tooltip>
          );
        },
      },
      {
        title: 'Duration',
        width: COLUMN_WIDTH[TYPE].DURATION,
        dataIndex: 'duration',
        align: 'center',
        render: (duration) => <span>{duration !== 0 ? roundNumber(duration) : '-'}</span>,
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
        render: (_, record) => {
          const { approvalManager = '' } = record;
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
                  <Link
                    to={`/time-off/overview/manager-timeoff/view/${record._id}`}
                    className={styles.ID}
                  >
                    <img src={OpenIcon} alt="open" />
                  </Link>
                </Tooltip>
                {isMyTicket && (
                  <>
                    <Tooltip title="Approve">
                      <img
                        src={ApproveIcon}
                        onClick={() => this.onApproveClick(record)}
                        alt="approve"
                      />
                    </Tooltip>
                    <Tooltip title="Reject">
                      <img
                        src={CancelIcon}
                        onClick={() => this.onRejectClick(record)}
                        alt="cancel"
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            );

          return (
            <div className={styles.rowAction}>
              <span onClick={() => this.onOpenClick(record._id)}>View Request</span>
            </div>
          );
        },
      },
    ];
  };

  onRefreshTable = (onMovedTab) => {
    const { onRefreshTable = () => {} } = this.props;
    onRefreshTable(onMovedTab);
  };

  onReset = () => {
    this.setState({
      selectedRowKeys: [],
    });
    const { onHandle = () => {} } = this.props;
    const payload = {
      length: 0,
    };
    onHandle(payload);
  };

  onApproveClick = async (record) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/approveRequest',
      payload: {
        _id: record._id,
      },
    });
    if (res.statusCode === 200) {
      this.onReset();
      this.onRefreshTable('1');
    }
  };

  onRejectClick = (record) => {
    if (record.status === ON_HOLD) {
      this.onRejectWithdraw(record);
    } else {
      this.setState({
        rejectingPayload: record,
      });
      this.toggleCommentModal(true);
    }
  };

  onReject = async (comment) => {
    const { dispatch } = this.props;
    const { rejectingPayload } = this.state;

    const res = await dispatch({
      type: 'timeOff/rejectRequest',
      payload: {
        _id: rejectingPayload._id,
        comment,
      },
    });

    if (res.statusCode === 200) {
      this.onReset();
      this.toggleCommentModal(false);
      this.onRefreshTable('1');
    }
  };

  onRejectWithdraw = async (record) => {
    const { dispatch } = this.props;

    const res = await dispatch({
      type: 'timeOff/rejectRequest',
      payload: {
        _id: record._id,
      },
    });

    if (res.statusCode === 200) {
      this.onReset();
      this.onRefreshTable('1');
    }
  };

  // pagination
  onChangePagination = (pageNumber, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: pageNumber, limit: pageSize },
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
      type: 'timeOff/approveMultipleRequests',
      payload: {
        ticketList: selectedRowKeys,
      },
    });
    if (statusCode === 200) {
      this.onReset();
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
      type: 'timeOff/rejectMultipleRequests',
      payload: {
        ticketList: selectedRowKeys,
        comment,
      },
    });
    if (statusCode === 200) {
      this.onReset();
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
          return <>You have not applied for any LOP requests.</>;
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
            No LOP requests received. <br />
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
      selectedTab = '',
      paging: { page, limit, total },
      currentUser: { employee: { _id: myId = '' } = {} } = {},
      isHR = false,
    } = this.props;

    const { selectedRowKeys, commentModalVisible, rejectingPayload, rejectMultiple } = this.state;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loading1 || loading3 || loading5,
      indicator: <Spin indicator={antIcon} />,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => {
        const { approvalManager: { _id: approvalManagerId = '' } = {} } = record;

        return {
          disabled: myId !== approvalManagerId && !isHR,
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
        <CommonTable
          loading={tableLoading}
          rowSelection={selectedTab === IN_PROGRESS ? rowSelection : null}
          columns={tableByRole}
          list={data}
          scrollable={data.length > 0}
          isBackendPaging
          onChangePage={this.onChangePagination}
          limit={limit}
          page={page}
          total={total}
          rowKey="_id"
          width={selectedTab !== REJECTED ? '50vw' : '64vw'}
          height="max-content"
          locale={{
            emptyText: (
              <div className={styles.emptyTable}>
                <img src={EmptyIcon} alt="empty-table" />
                <p className={styles.describeTexts}>{this.renderEmptyTableContent()}</p>
              </div>
            ),
          }}
        />
        <RejectCommentModal
          visible={commentModalVisible}
          onClose={() => this.toggleCommentModal(false)}
          onReject={rejectMultiple ? this.onMultipleReject : this.onReject}
          item={rejectingPayload}
          rejectMultiple={rejectMultiple}
          loading={loading4 || loading6}
        />
      </div>
    );
  }
}

export default TeamLeaveTable;
