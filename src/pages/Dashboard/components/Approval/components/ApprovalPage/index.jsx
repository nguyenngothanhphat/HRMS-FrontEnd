import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popover } from 'antd';
import { filter, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import PopoverInfo from '../PopoverInfo';
import { getTimezoneViaCity } from '@/utils/times';
import filterIcon from '@/assets/offboarding-filter.svg';
import rejectIcon from '@/assets/cancel.svg';
import approvalIcon from '@/assets/approve.svg';
import DetailTicket from '../DetailTicket';
import styles from './index.less';

const ApprovalPage = (props) => {
  const {
    dispatch,
    loadingTable,
    listTicket,
    isLoadData,
    loadingReject,
    loadingApproval,
    companyLocationList,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [ticket, setTicket] = useState({});
  const [keySearch, setKeySearch] = useState('');
  const [listData, setListData] = useState([]);
  const [timezoneList, settimezoneList] = useState([]);
  const [currentTime, setcurrentTime] = useState(moment());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  }, []);
  useEffect(() => {
    if (isLoadData)
      dispatch({
        type: 'dashboard/fetchListTicket',
      });
  }, [isLoadData]);

  const fetchTimezone = () => {
    const timeZoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timeZoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    settimezoneList(timeZoneList);
  };

  useEffect(() => {
    fetchTimezone();
  }, [companyLocationList]);

  useEffect(() => {
    const arr = filter(
      listTicket,
      (item) =>
        item.employee.generalInfo.legalName.toLowerCase().indexOf(keySearch.toLowerCase()) >= 0,
    );
    setListData(arr);
    setTotal(arr.length);
  }, [keySearch, listTicket]);
  const viewDetail = (record) => {
    setOpenModal(true);
    setTicket(record);
  };
  const approvalTicket = (record) => {
    const { typeTicket = '', _id = '' } = record;
    dispatch({
      type: 'dashboard/approveRequest',
      payload: {
        typeTicket,
        _id,
      },
    });
  };
  const rejectTicket = (record) => {
    const { typeTicket = '', _id = '' } = record;
    dispatch({
      type: 'dashboard/rejectRequest',
      payload: {
        typeTicket,
        _id,
      },
    });
  };
  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
    setPage(1);
  };
  const pagination = {
    position: ['bottomLeft'],
    total,
    // eslint-disable-next-line no-nested-ternary
    showTotal: (totalData, range) => {
      return (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {' '}
            {range[0]} - {range[1]}{' '}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      );
    },
    defaultPageSize: limit,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (currentPage, pageSize) => {
      setPage(currentPage);
      setLimit(pageSize);
    },
  };
  // const dummyData = [
  //   {
  //     ticketID: 1,
  //     employee: { generalInfo: { userId: '123', legalName: 'test' } },
  //     assignee: { generalInfo: { userId: '123', legalName: 'test' } },
  //   },
  // ];
  const columns = [
    {
      title: <div style={{ paddingLeft: '10px' }}> Ticket ID</div>,
      key: 'ticketID',
      dataIndex: 'ticketID',
      width: 150,
      render: (ticketID) => (
        <span className={styles.blueText} style={{ paddingLeft: '10px' }}>
          #{ticketID}
        </span>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'employee',
      key: 'employee',
      width: 250,
      render: ({ generalInfo: { userId = '' } = {} } = {}) => (
        <span className={styles.blueText}>{userId || ''}</span>
      ),
    },
    // {
    //   title: 'Name',
    //   dataIndex: 'employee',
    //   key: 'employee',
    //   width: 250,
    //   render: ({ generalInfo: { legalName = '' } = {} } = {}) => <span>{legalName || ''}</span>,
    // },
    {
      title: 'Name',
      dataIndex: 'employee',
      key: 'employee',
      width: 250,
      render: (employee) => (
        <Popover
          content={
            <PopoverInfo
              companyLocationList={companyLocationList}
              propsState={{ currentTime, timezoneList }}
              data={employee}
            />
          }
          placement="bottomRight"
          trigger="hover"
        >
          {!isEmpty(employee?.generalInfo) ? (
            <span className={styles.employeeName}>{employee?.generalInfo?.legalName}</span>
          ) : (
            ''
          )}
        </Popover>
      ),
    },
    {
      title: 'Manager',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 250,
      render: ({ generalInfoInfo: { legalName = '' } = {} } = {}) => <span>{legalName || ''}</span>,
      align: 'left',
    },
    {
      title: 'Department',
      dataIndex: 'employee',
      key: 'department',
      width: 200,
      render: ({ departmentInfo: { name } = {} } = {}) => (
        <span className={styles.directoryTable_deparmentText}>{name || ''}</span>
      ),
      align: 'left',
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (createdAt) => <span>{moment(createdAt).locale('en').format('DD-MM-YYYY')}</span>,
      align: 'left',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 250,
      render: ({ name } = {}) => <span>{name || ''}</span>,
      align: 'left',
    },

    {
      title: <div style={{ paddingRight: '40px' }}>Action</div>,
      dataIndex: 'action',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space style={{ paddingRight: '20px' }}>
          <Button type="link" className={styles.btnDetail} onClick={() => viewDetail(record)}>
            View details
          </Button>
          <div className={styles.containerBtn}>
            <Button type="link" className={styles.btnAction} onClick={() => rejectTicket(record)}>
              <img src={rejectIcon} alt="reject" />
            </Button>
            <Button type="link" className={styles.btnAction} onClick={() => approvalTicket(record)}>
              <img src={approvalIcon} alt="approval" />
            </Button>
          </div>
        </Space>
      ),
      align: 'right',
    },
  ];
  return (
    <div className={styles.approvalPage}>
      <div className={styles.approvalPage__table}>
        <div className={styles.searchFilter}>
          <img src={filterIcon} alt="" className={styles.searchFilter__icon} />
          <Input
            size="large"
            placeholder="Search by Name"
            onChange={onChangeKeySearch}
            prefix={<SearchOutlined />}
            // onPressEnter={(e) => console.log('e', e.target.value)}
            className={styles.searchFilter__input}
          />
        </div>
        <div className={styles.tableApproval}>
          <Table
            columns={columns}
            dataSource={listData}
            loading={loadingTable || loadingReject || loadingApproval}
            size="small"
            pagination={pagination}
          />
        </div>
      </div>
      <DetailTicket openModal={openModal} ticket={ticket} onCancel={() => setOpenModal(false)} />
    </div>
  );
};
export default connect(
  ({
    loading,
    location: { companyLocationList = [] },
    dashboard: { listTicket = [], totalTicket, isLoadData },
  }) => ({
    loadingTable: loading.effects['dashboard/fetchListTicket'],
    loadingReject: loading.effects['dashboard/rejectTicket'],
    loadingApproval: loading.effects['dashboard/approvalTicket'],
    companyLocationList,
    listTicket,
    totalTicket,
    isLoadData,
  }),
)(ApprovalPage);
