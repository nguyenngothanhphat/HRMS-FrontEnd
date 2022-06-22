import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import ViewIcon from '@/assets/dashboard/open.svg';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';
import TimesheetDetailModal from './components/TimesheetDetailModal';
import UserProfilePopover from '@/components/UserProfilePopover';

const MyRequest = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    employee: { _id: employeeId = '' } = {},
    myRequest = [],
  } = props;

  const [pageSelected, setPageSelected] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [handlingWeek, setHandlingWeek] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // fetch list
  const fetchList = async () => {
    await dispatch({
      type: 'timeSheet/fetchMyRequest',
      payload: {
        employeeId,
      },
    });
  };
  useEffect(() => {
    fetchList();
  }, [pageSize, pageSelected]);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Ticket ID',
        dataIndex: 'ticketId',
        key: 'ticketId',
        fixed: 'left',
        width: '10%',
        render: (ticketId) => <div className={styles.ticketIdText}>{ticketId}</div>,
        sorter: (a, b) => a.ticketId - b.ticketId,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Date Range',
        dataIndex: ['fromDate', 'toDate'],
        key: 'dateRange',
        fixed: 'left',
        width: '20%',
        render: (_, row) => {
          const { fromDate, toDate } = row;
          return (
            <div className={styles.dateRangeText}>
              {moment(fromDate).format('DD-MM-YYYY')} to {moment(toDate).format('DD-MM-YYYY')}
            </div>
          );
        },
        sorter: (a, b) => moment(a.fromDate) - moment(b.fromDate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Approved By',
        dataIndex: 'employeeInfo',
        key: 'employeeInfo',
        fixed: 'left',
        width: '15%',
        render: (row) => {
          return (
            <UserProfilePopover placement="rightTop" data={row?.manager}>
              {row?.manager.legalName}
            </UserProfilePopover>
          );
        },
        sorter: (a, b) => a.manager.legalName - b.manager.legalName,
        sortDirections: [],
      },
      {
        title: 'Comments',
        dataIndex: 'comment',
        key: 'comment',
        fixed: 'left',
        width: '25%',
        render: (comment) => {
          return <p className={styles.comment}>{comment?.length > 0 ? comment : '-'}</p>;
        },

        sorter: (a, b) => a.comment - b.comment,
        sortDirections: [],
      },
      {
        title: 'Total Hours',
        dataIndex: 'totalHour',
        key: 'totalHour',
        align: 'left',
        width: '10%',
        render: (totalHours) => `${totalHours} hours`,
        sorter: (a, b) => a.totalHours - b.totalHours,
        sortDirections: [],
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: '10%',
        render: (status) => {
          return (
            <div
              className={
                // eslint-disable-next-line no-nested-ternary
                status.toLowerCase() === 'pending'
                  ? styles.status__Pending
                  : status.toLowerCase() === 'approved'
                  ? styles.status__Approved
                  : styles.status__Rejected
              }
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </div>
          );
        },
        sorter: (a, b) =>
          a.status.length > 0 && b.status.length > 0 && a.status.localeCompare(b.status),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: '10%',
        render: (_, row, index) => {
          return (
            <div className={styles.action}>
              <div className={styles.actionText}>
                <div className={styles.actionButton}>
                  <div
                    className={styles.actionButtonText}
                    onClick={() => {
                      setHandlingWeek(index);
                      setOpenModal(true);
                    }}
                  >
                    <Tooltip title="View">
                      <img src={ViewIcon} alt="View Icon" />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        sorter: (a, b) => a.action - b.action,
        sortDirections: [],
      },
    ];
    return columns;
  };

  const onChangePagination = (pageNumber, pageSizeTemp) => {
    setPageSelected(pageNumber);
    setPageSize(pageSizeTemp);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: myRequest?.length,
    showTotal: (total, range) => (
      <span>
        {' '}
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    defaultPageSize: pageSize,
    showSizeChanger: true,
    pageSize,
    pageSizeOptions: ['10', '25', '50', '100'],
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.MyRequest}>
      <Table
        columns={generateColumns()}
        dataSource={myRequest}
        locale={{
          emptyText: <EmptyComponent />,
        }}
        rowKey={(record) => record.id}
        loading={loadingFetch}
        pagination={pagination}
      />
      <TimesheetDetailModal
        visible={openModal}
        onClose={() => {
          setOpenModal(false);
          fetchList();
        }}
        rowKey={handlingWeek}
        dataSource={myRequest}
      />
    </div>
  );
};

export default connect(
  ({ user: { currentUser: { employee = {} } = {} }, loading, timeSheet: { myRequest = {} } }) => ({
    employee,
    loadingFetch: loading.effects['timeSheet/fetchMyRequest'],
    myRequest,
  }),
)(MyRequest);
