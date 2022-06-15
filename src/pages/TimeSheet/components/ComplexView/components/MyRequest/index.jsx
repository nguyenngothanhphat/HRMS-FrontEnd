import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import ViewIcon from '@/assets/dashboard/open.svg';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';
import { getTimezoneViaCity } from '@/utils/times';
import TimesheetDetailModal from './components/TimesheetDetailModal';
import UserProfilePopover from '@/components/UserProfilePopover';
import img from '@/assets/dashboard/sampleAvatar2.png';

const MyRequest = (props) => {
  const timezoneList = [];
  const { companyLocationList = [] } = props;
  const [currentTime, setCurrentTime] = useState(moment());
  const fetchTimezone = () => {
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    // setTimezoneList({
    //   timezoneList,
    // });
  };
  useEffect(() => {
    fetchTimezone();
  });

  const {
    dispatch,
    data = [
      {
        key: 0,
        ticketId: 100,
        dateRange: {
          startDate: '2022-05-30',
          endDate: '2022-06-05',
        },
        manager: {
          legalName: 'John Doe',
          userId: '12345',
          avatar: img,
          workEmail: '',
          workNumber: '',
          skills: [
            { name: 'gold digger', id: 1 },
            { name: 'eating', id: 2 },
            { name: 'drinking', id: 3 },
          ],
        },
        comments: 'hihi',
        totalHours: '8.00',
        status: 'pending',
      },
      {
        key: 1,
        ticketId: 200,
        dateRange: {
          startDate: '2022-06-06',
          endDate: '2022-06-12',
        },
        manager: {
          legalName: 'John Doe',
          userId: '12345',
          avatar: img,
          workEmail: '',
          workNumber: '',
          skills: [
            { name: 'gold digger', id: 1 },
            { name: 'eating', id: 2 },
            { name: 'drinking', id: 3 },
          ],
        },
        comments: '',
        totalHours: '8.00',
        status: 'approved',
      },
      {
        key: 2,
        ticketId: 300,
        dateRange: {
          startDate: '2022-06-13',
          endDate: '2022-06-19',
        },
        manager: {
          legalName: 'John Doe',
          userId: '12345',
          avatar: img,
          workEmail: '',
          workNumber: '',
          skills: [
            { name: 'gold digger', id: 1 },
            { name: 'eating', id: 2 },
            { name: 'drinking', id: 3 },
          ],
        },
        comments:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, adipisci. Eaque eum, temporibus quisquam excepturi debitis explicabo perferendis? In repellendus odit rerum quos sit. Id vero rerum veniam facere quisquam \n Perspiciatis, labore tempora ipsam odit veritatis quaerat commodi quasi esse modi quod beatae repellendus accusantium velit officiis fuga id eos nobis excepturi corporis quibusdam qui optio accusamus porro deleniti Doloremque \n  Ab dicta cumque temporibus corrupti deleniti placeat alias deserunt omnis, consectetur hic, rem a error, vel cum perferendis debitis sapiente fuga delectus ad Veritatis cumque voluptate ex, aliquid est quia.',
        totalHours: '8.00',
        status: 'rejected',
      },
    ],
    selectedEmployees = [],
    loadingFetch = false,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [handlingWeek, setHandlingWeek] = useState(0);
  const [openModal, setOpenModal] = useState(false);

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
        dataIndex: 'dateRange',
        key: 'dateRange',
        fixed: 'left',
        width: '20%',
        render: (row) => {
          const { startDate = '', endDate = '' } = row;
          return (
            <div className={styles.dateRangeText}>
              {startDate} to {endDate}
            </div>
          );
        },
        sorter: (a, b) => moment(a.dateRange.startDate) - moment(b.dateRange.startDate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Approved By',
        dataIndex: 'manager',
        key: 'manager',
        fixed: 'left',
        width: '15%',
        render: (manager) => {
          return (
            <UserProfilePopover placement="rightTop" data={manager}>
              {manager.legalName}
            </UserProfilePopover>
          );
        },
        sorter: (a, b) => a.manager - b.manager,
        sortDirections: [],
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        fixed: 'left',
        width: '25%',
        render: (comment) => {
          return <div className={styles.comment}>{comment?.length > 0 ? comment : '-'}</div>;
        },

        sorter: (a, b) => a.comment - b.comment,
        sortDirections: [],
      },
      {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
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
                status === 'pending'
                  ? styles.status__Pending
                  : status === 'approved'
                  ? styles.status__Approved
                  : styles.status__Rejected
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
        render: (_, row) => {
          return (
            <div className={styles.action}>
              <div className={styles.actionText}>
                <div className={styles.actionButton}>
                  <div
                    className={styles.actionButtonText}
                    onClick={() => {
                      setHandlingWeek(row.key);
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
    total: data.length,
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
        dataSource={data}
        locale={{
          emptyText: <EmptyComponent />,
        }}
        rowKey={(record) => record.id}
        scroll={selectedEmployees.length > 0 ? { y: 600, x: 1100 } : { x: 1100 }}
        loading={loadingFetch}
        pagination={pagination}
      />
      <TimesheetDetailModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        rowKey={handlingWeek}
        dataSource={data}
      />
    </div>
  );
};

export default connect(() => ({}))(MyRequest);
