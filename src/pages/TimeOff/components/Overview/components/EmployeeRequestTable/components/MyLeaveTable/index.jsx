import { LoadingOutlined } from '@ant-design/icons';
import { Avatar, Spin, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import {
  isNewRequest,
  isUpdatedRequest,
  roundNumber,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_STATUS,
} from '@/utils/timeOff';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import DefaultAvatar from '@/assets/avtDefault.jpg';

import styles from './index.less';

const { ON_HOLD } = TIMEOFF_STATUS;
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
      dataIndex: 'ticketId',
      align: 'left',
      fixed: 'left',
      width: '15%',
      render: (_, record) => {
        const { ticketID = '', _id = '', onDate = '', updated = false, status = '' } = record;
        const isUpdated = isUpdatedRequest(status, updated);
        const isNew = isNewRequest(status, onDate);
        return (
          <span className={styles.ID}>
            <Link to={`/time-off/overview/personal-timeoff/view/${_id}`}>
              <span className={styles.text}>{ticketID}</span>
            </Link>
            {isUpdated && <Tag color="#2C6DF9">Updated</Tag>}
            {isNew && !isUpdated && <Tag color="#2C6DF9">New</Tag>}
          </span>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '15%',
      align: 'left',
      render: (type, record) => {
        if (record.status === ON_HOLD) return <span>Withdraw Request</span>;
        return <span>{type ? type.name : '-'}</span>;
      },
    },

    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'startDate',
      align: 'left',
      render: (_, record) => {
        const { fromDate = '', toDate = '', leaveDates = [] } = record;
        const listLeave = leaveDates.sort((a, b) => moment(a.date) - moment(b.date));
        if (fromDate && toDate) {
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
      title: `Requested on `,
      dataIndex: 'onDate',
      align: 'center',
      // width: '30%',
      render: (onDate) => <span>{moment(onDate).locale('en').format(TIMEOFF_DATE_FORMAT)}</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'center',
      render: (duration) => <span>{duration !== 0 ? roundNumber(duration) : '-'}</span>,
    },
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'approvalManager',
      // width: '25%',
      render: (approvalManager = {}) => {
        const assigned = approvalManager ? [approvalManager?.generalInfo] : [];
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
      fixed: 'right',
      align: 'left',
      width: '15%',
      dataIndex: '_id',
      // width: '20%',
      render: (_id) => (
        <div className={styles.rowAction}>
          <Link to={`/time-off/overview/personal-timeoff/view/${_id}`}>View Request</Link>
        </div>
      ),
    },
  ];

  // pagination
  onChangePagination = (pageNumber, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: pageNumber,
        limit: pageSize,
      },
    });
  };

  getListDate = (listDate) => {
    return listDate.map((x) => (
      <div>
        {`${moment(x.date).locale('en').format('DD')} ${moment(x.date)
          .locale('en')
          .format('MMM')}  (${x.timeOfDay})`}
      </div>
    ));
  };

  formatDate = (date1, date2) => {
    return `${moment(date1).locale('en').format(TIMEOFF_DATE_FORMAT)} - ${moment(date2)
      .locale('en')
      .format(TIMEOFF_DATE_FORMAT)}`;
  };

  renderEmptyTableContent = () => {
    const { tab = 0 } = this.props;

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
  };

  render() {
    const {
      data = [],
      loadingFetchLeaveRequests = false,
      paging: { page, total, limit },
    } = this.props;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loadingFetchLeaveRequests,
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
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
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
          pagination={data.length === 0 ? null : { ...pagination, total }}
          columns={this.columns}
          dataSource={data}
          scroll={data.length > 0 ? scroll : null}
          rowKey={(id) => id.ticketID}
          locale={{
            emptyText: (
              <div className={styles.emptyTable}>
                <img src={EmptyIcon} alt="empty-table" />
                <p className={styles.describeTexts}>{this.renderEmptyTableContent()}</p>
              </div>
            ),
          }}
        />
      </div>
    );
  }
}

export default MyLeaveTable;
