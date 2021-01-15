import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history, connect } from 'umi';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import moment from 'moment';
import MultipleCheckTablePopup from '@/components/MultipleCheckTablePopup';
import RejectCommentModal from '../RejectCommentModal';
import styles from './index.less';

@connect(({ loading }) => ({
  loading1: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading2: loading.effects['timeOff/fetchTeamCompoffRequests'],
  loading3: loading.effects['timeOff/approveMultipleCompoffRequest'],
  loading4: loading.effects['timeOff/rejectMultipleCompoffRequest'],
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
      title: 'Project',
      dataIndex: 'project',
      align: 'left',
      render: (project) => <span>{project ? project.name : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
    },
    // {
    //   title: `Req’ted on `,
    //   dataIndex: 'onDate',
    //   align: 'left',
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
      render: (comment) =>
        comment ? (
          <span>{comment.length >= 12 ? `${comment.slice(0, 12)}...` : comment}</span>
        ) : (
          <span />
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
      dataIndex: 'id',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        const { selectedTab = '' } = this.props;
        if (selectedTab === 'IN-PROGRESS' || selectedTab === 'IN-PROGRESS-NEXT')
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
      multipleCheckModalVisible: false,
      rejectMultiple: false,
    };
  }

  // HANDLE TEAM REQUESTS
  onOpenClick = (_id) => {
    history.push({
      pathname: `/time-off/manager-view-compoff/${_id}`,
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
      type: 'timeOff/rejectCompoffRequest',
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
    this.setState({ selectedRowKeys });
    let visible = false;
    if (selectedRowKeys.length > 0) visible = true;
    const { selectedTab = '' } = this.props;
    if (['IN-PROGRESS', 'IN-PROGRESS-NEXT'].includes(selectedTab))
      this.setState({ multipleCheckModalVisible: visible });
  };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        ticketID = '',
        _id = '',
        extraTime = [],
        onDate,
        employee: { generalInfo: { firstName = '', lastName = '' } = {} },
        approvalFlow: { step1 = {}, step2 = {}, step3 = {} } = {},
        commentPM = '',
        commentCLA = '',
      } = value;

      let duration = '';
      if (extraTime.length !== 0) {
        const fromDate = extraTime[0].date;
        const toDate = extraTime[extraTime.length - 1].date;
        duration = `${moment(fromDate).format('DD.MM.YYYY')} - ${moment(toDate).format(
          'DD.MM.YYYY',
        )}`;
      }

      const oneAssign = (step) => {
        const { generalInfo: { firstName: fn = '', lastName: ln = '', avatar = '' } = {} } = step;
        return {
          firstName: fn,
          lastName: ln,
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
      type: 'timeOff/approveMultipleCompoffRequest',
      payload: {
        ticketList: selectedRowKeys,
      },
    });
    if (statusCode === 200) {
      this.setState({
        selectedRowKeys: [],
        multipleCheckModalVisible: false,
      });
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
      type: 'timeOff/rejectMultipleCompoffRequest',
      payload: {
        ticketList: selectedRowKeys,
        comment,
      },
    });
    if (statusCode === 200) {
      this.setState({
        selectedRowKeys: [],
        multipleCheckModalVisible: false,
      });
      this.toggleCommentModal(false);
      this.onRefreshTable('3');
    }
  };

  render() {
    const { data = [], loading1, loading2, loading3, loading4, selectedTab = '' } = this.props;
    const {
      selectedRowKeys,
      pageSelected,
      commentModalVisible,
      rejectingTicketID,
      multipleCheckModalVisible,
      rejectMultiple,
    } = this.state;

    const rowSize = 10;

    const parsedData = this.processData(data);

    const pagination = {
      hideOnSinglePage: false,
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
      selectedTab === 'REJECTED' || selectedTab === 'ACCEPTED'
        ? this.columns.filter((col) => col.dataIndex !== 'assigned')
        : this.columns.filter((col) => col.dataIndex !== 'comment');

    return (
      <div className={styles.TeamCompoffTable}>
        <Table
          size="middle"
          loading={loading1 || loading2}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: parsedData.length }}
          columns={tableByRole}
          dataSource={parsedData}
          scroll={scroll}
          rowKey={(id) => id._id}
        />
        <RejectCommentModal
          visible={commentModalVisible}
          onClose={() => this.toggleCommentModal(false)}
          onReject={rejectMultiple ? this.onMultipleReject : this.onReject}
          ticketID={rejectingTicketID}
          rejectMultiple={rejectMultiple}
          loading={loading4}
        />
        {multipleCheckModalVisible && ['IN-PROGRESS', 'IN-PROGRESS-NEXT'].includes(selectedTab) && (
          <MultipleCheckTablePopup
            onApprove={this.onMultipleApprove}
            onReject={this.onMultipleCancelClick}
            length={selectedRowKeys.length}
            loading3={loading3}
            loading4={loading4}
          />
        )}
      </div>
    );
  }
}
export default TeamCompoffTable;
