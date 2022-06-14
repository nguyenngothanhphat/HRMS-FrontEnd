import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Popover, Table, Tag } from 'antd';
import { debounce, filter, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import approvalIcon from '@/assets/approve.svg';
import rejectIcon from '@/assets/cancel.svg';
import ViewIcon from '@/assets/dashboard/open.svg';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { TYPE_TICKET_APPROVAL } from '@/utils/dashboard';
import { getTimezoneViaCity } from '@/utils/times';
import RejectCommentModal from '../../../ActivityLog/components/PendingApprovalTag/components/RejectCommentModal';
import DetailTicket from '../DetailTicket';
import PopoverInfo from '../PopoverInfo';
import FilterContent from './components/FilterContent';
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
  const [applied, setApplied] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [recordDetail, setRecordDetail] = useState({});
  const [viewedDetail, setViewedDetail] = useState(false);
  const [form, setForm] = useState(null);

  const fetchListTicket = () => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  };

  useEffect(() => {
    fetchListTicket();
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'employee/fetchFilterList',
      payload: {
        id: company,
        tenantId,
      },
    });
  }, []);
  useEffect(() => {
    if (isLoadData) fetchListTicket();
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
    setViewedDetail(true);
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

  const rejectTicket = async (comment) => {
    const { typeTicket = '', _id = '' } = recordDetail;
    const res = await dispatch({
      type: 'dashboard/rejectRequest',
      payload: {
        typeTicket,
        _id,
        comment,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      setCommentModalVisible(false);
      dispatch({
        type: 'dashboard/fetchListTicket',
      });
    }
  };

  const handleReject = (record) => {
    setRecordDetail(record);
    setCommentModalVisible(true);
  };

  const onSearchDebounce = debounce((value) => {
    setKeySearch(value);
  }, 1000);

  const onChangeKeySearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
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
      title: 'Employee ID',
      dataIndex: 'employee',
      key: 'employee',
      width: 250,
      render: ({ employeeId = '' } = {}) => <span>{employeeId || ''}</span>,
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
      title: 'Date Range',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 300,
      render: (createdAt) => <span>{moment(createdAt).locale('en').format('DD-MM-YYYY')}</span>,
      align: 'left',
    },
    {
      title: 'Type',
      dataIndex: 'typeTicket',
      key: 'typeTicket',
      width: 250,
      render: (typeTicket = '') => (
        <span
          className={
            typeTicket === TYPE_TICKET_APPROVAL.TIMEOFF ? styles.yellowText : styles.blueText
          }
        >
          {typeTicket === TYPE_TICKET_APPROVAL.TIMEOFF ? 'TimeOff' : 'TimeSheet'}
        </span>
      ),
      align: 'left',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <div className={styles.containerBtn}>
          <Button type="link" className={styles.btnAction} onClick={() => viewDetail(record)}>
            <img src={ViewIcon} alt="View Icon" />
          </Button>
          <Button
            type="link"
            className={styles.btnAction}
            onClick={() => {
              handleReject(record);
            }}
          >
            <img src={rejectIcon} alt="reject" />
          </Button>
          <Button type="link" className={styles.btnAction} onClick={() => approvalTicket(record)}>
            <img src={approvalIcon} alt="approval" />
          </Button>
        </div>
      ),
      align: 'center',
    },
  ];

  const onFilter = (filterPayload) => {
    if (Object.keys(filterPayload).length > 0) {
      setIsFiltering(true);
      setApplied(Object.keys(filterPayload).length);
    } else {
      setIsFiltering(false);
      setApplied(0);
    }
  };

  const clearFilter = () => {
    onFilter({});
    form?.resetFields();
  };

  const renderOption = () => {
    const content = (
      <FilterContent
        onFilter={onFilter}
        setForm={setForm}
        // needResetFilterForm={needResetFilterForm}
        // setNeedResetFilterForm={setNeedResetFilterForm}
        setApplied={setApplied}
        setIsFiltering={setIsFiltering}
      />
    );
    return (
      <div className={styles.searchFilter}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              clearFilter();
            }}
          >
            {applied} filters applied
          </Tag>
        )}
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton showDot={isFiltering} />
        </FilterPopover>
        <CustomSearchBox onSearch={onChangeKeySearch} placeholder="Search by Name" />
      </div>
    );
  };

  return (
    <div className={styles.approvalPage}>
      <Card className={styles.approvalPage__table} extra={renderOption()}>
        <div className={styles.tableApproval}>
          <Table
            columns={columns}
            dataSource={listData}
            loading={loadingTable || loadingReject || loadingApproval}
            size="small"
            pagination={pagination}
          />
        </div>
      </Card>
      <DetailTicket
        openModal={openModal}
        viewedDetail={viewedDetail}
        ticket={ticket}
        onCancel={() => setOpenModal(false)}
      />
      <RejectCommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        onReject={rejectTicket}
        ticketID={recordDetail.ticketID}
        loading={loadingReject}
      />
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
