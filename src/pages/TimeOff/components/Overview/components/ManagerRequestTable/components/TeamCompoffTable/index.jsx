import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip, Spin } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { roundNumber, TIMEOFF_STATUS } from '@/utils/timeOff';
import RejectCommentModal from '../RejectCommentModal';

import styles from './index.less';

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, REJECTED } = TIMEOFF_STATUS;
@connect(({ dispatch, timeOff: { paging }, loading }) => ({
  dispatch,
  paging,
  // loading2: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading1: loading.effects['timeOff/fetchTeamCompoffRequests'],
  loading3: loading.effects['timeOff/approveMultipleCompoffRequest'],
  loading4: loading.effects['timeOff/rejectMultipleCompoffRequest'],
  loading5: loading.effects['timeOff/approveCompoffRequest'],
  loading6: loading.effects['timeOff/rejectCompoffRequest'],
}))
class TeamCompoffTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '15%',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        return (
          <span className={styles.ID} onClick={() => this.onIdClick(_id)}>
            {ticketID}
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
      title: 'Project',
      dataIndex: 'project',
      align: 'left',
      render: (project) => <span>{project ? project.projectName : '-'}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
      render: (duration) => <span>{duration !== 0 ? roundNumber(duration) : '-'}</span>,
    },
    // {
    //   title: `Req’ted on `,
    //   dataIndex: 'onDate',
    //   align: 'left',
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
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'assigned',
      render: (assigned) => {
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={2}
              maxStyle={{
                color: '#FFA100',
                backgroundColor: '#EAF0FF',
              }}
            >
              {assigned.map((user) => {
                const { legalName = '', avatar = '' } = user;
                return (
                  <Tooltip title={legalName} placement="top">
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
      align: 'left',
      dataIndex: 'id',
      fixed: 'right',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        const { selectedTab = '' } = this.props;
        if (selectedTab === IN_PROGRESS || selectedTab === IN_PROGRESS_NEXT)
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
      // pageSelected: 1,
      rowSize: 10,
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
      pathname: `/time-off/overview/manager-compoff/view/${_id}`,
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
      type: 'timeOff/approveCompoffRequest',
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
      type: 'timeOff/rejectCompoffRequest',
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
      pathname: `/time-off/overview/personal-compoff/view/${_id}`,
      // state: { location: name },
    });
  };

  // pagination
  onChangePagination = (pageNumber, pageSize) => {
    this.setState({
      rowSize: pageSize,
      // pageSelected: pageNumber,
    });
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
    const { selectedTab = '', loading3, loading4, onHandle = () => {} } = this.props;
    if ([IN_PROGRESS, IN_PROGRESS_NEXT].includes(selectedTab)) {
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
        ticketID = '',
        _id = '',
        extraTime = [],
        onDate,
        employee: { generalInfo: { legalName: requesteeName = '' } = {} },
        approvalFlow: { step1 = {}, step2 = {}, step3 = {} } = {},
        commentPM = '',
        commentCLA = '',
      } = value;

      let duration = '';
      if (extraTime.length !== 0) {
        const fromDate = extraTime[0].date;
        const toDate = extraTime[extraTime.length - 1].date;
        duration = `${moment.utc(fromDate).format('MM/DD/YYYY')} - ${moment
          .utc(toDate)
          .format('MM/DD/YYYY')}`;
      }

      const oneAssign = (step) => {
        const { employee: { generalInfo: { legalName = '', avatar = '' } = {} } = {} } = step;
        return {
          legalName,
          avatar,
        };
      };
      const assigned = [oneAssign(step1), oneAssign(step2), oneAssign(step3)];

      return {
        ...value,
        duration,
        assigned,
        id: {
          ticketID,
          _id,
          onDate,
        },
        comment: commentCLA || commentPM,
        requestee: requesteeName,
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
      type: 'timeOff/approveMultipleCompoffRequest',
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
      type: 'timeOff/rejectMultipleCompoffRequest',
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
    } = this.props;
    const {
      selectedRowKeys,
      // pageSelected,
      commentModalVisible,
      rejectingTicketID,
      rejectMultiple,
      rowSize,
    } = this.state;
    // const rowSize = 10;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loading1 || loading3 || loading5,
      indicator: <Spin indicator={antIcon} />,
    };

    const parsedData = this.processData(data);

    const pagination = {
      hideOnSinglePage: false,
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
      defaultPageSize: rowSize,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: rowSize,
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
      selectedTab === REJECTED || selectedTab === ACCEPTED
        ? this.columns.filter((col) => col.dataIndex !== 'assigned')
        : this.columns.filter((col) => col.dataIndex !== 'comment');

    return (
      <div className={styles.TeamCompoffTable}>
        <Table
          size="middle"
          loading={tableLoading}
          rowSelection={rowSelection}
          pagination={data.length === 0 ? null : { ...pagination }}
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
export default TeamCompoffTable;
