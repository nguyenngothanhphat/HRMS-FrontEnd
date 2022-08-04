import { Button, Card } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import approvalIcon from '@/assets/approve.svg';
import rejectIcon from '@/assets/cancel.svg';
import ViewIcon from '@/assets/dashboard/open.svg';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import UserProfilePopover from '@/components/UserProfilePopover';
import { TYPE_TICKET_APPROVAL } from '@/constants/dashboard';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { getEmployeeUrl } from '@/utils/directory';
import RejectCommentModal from '../../../ActivityLog/components/PendingApprovalTag/components/RejectCommentModal';
import DetailTicket from '../DetailTicket';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const ApprovalPage = (props) => {
  const {
    dispatch,
    loadingTable,
    allTicket,
    isLoadData,
    loadingReject,
    loadingApproval,
    loadingApprovalTimeSheet,
    employee: { _id: idEmployee = '' } = {},
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [ticket, setTicket] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [listData, setListData] = useState([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [recordDetail, setRecordDetail] = useState({});
  const [viewedDetail, setViewedDetail] = useState(false);
  const [filter, setFilter] = useState({});

  const fetchListTicket = () => {
    dispatch({
      type: 'dashboard/fetchAllListTicket',
      payload: {
        employeeId: idEmployee,
        search: searchValue,
        ...filter,
      },
    });
  };

  useEffect(() => {
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
    fetchListTicket();
  }, [searchValue, JSON.stringify(filter)]);

  useEffect(() => {
    if (isLoadData) {
      fetchListTicket();
    }
  }, [isLoadData]);

  useEffect(() => {
    setListData(allTicket);
  }, [searchValue, allTicket]);

  const viewDetail = (record) => {
    setOpenModal(true);
    setViewedDetail(true);
    setTicket(record);
  };

  const approvalTicket = async (record) => {
    const { typeReport = '', leaveId = '', ticketId = '' } = record;
    let response = {};
    if (typeReport === TYPE_TICKET_APPROVAL.TIMEOFF) {
      response = await dispatch({
        type: 'dashboard/approveRequest',
        payload: {
          typeTicket: TYPE_TICKET_APPROVAL.LEAVE_REQUEST,
          _id: leaveId,
        },
        statusTimeoff: 'approval',
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        fetchListTicket();
      }
    } else {
      response = await dispatch({
        type: 'dashboard/approveTimeSheetRequest',
        payload: {
          status: TYPE_TICKET_APPROVAL.APPROVED,
          ticketId,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        fetchListTicket();
      }
    }
  };

  const rejectTicket = async (comment) => {
    const { typeReport = '', leaveId = '', ticketId = '' } = recordDetail;
    let response = {};
    if (typeReport === TYPE_TICKET_APPROVAL.TIMEOFF) {
      response = await dispatch({
        type: 'dashboard/rejectRequest',
        payload: {
          typeTicket: TYPE_TICKET_APPROVAL.LEAVE_REQUEST,
          _id: leaveId,
          comment,
        },
      });
      const { statusCode = '' } = response;
      if (statusCode === 200) {
        setCommentModalVisible(false);
        fetchListTicket();
      }
    } else {
      response = await dispatch({
        type: 'dashboard/rejectTimeSheetRequest',
        payload: {
          status: TYPE_TICKET_APPROVAL.REJECTED,
          ticketId,
          comment,
        },
      });
      const { code = '' } = response;
      if (code === 200) {
        setCommentModalVisible(false);
        fetchListTicket();
      }
    }
  };

  const handleReject = (record) => {
    setRecordDetail(record);
    setCommentModalVisible(true);
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onChangeKeySearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const columns = [
    {
      title: <div style={{ paddingLeft: '10px' }}> Ticket ID</div>,
      key: 'ticketID',
      dataIndex: 'ticketID',
      width: 150,
      render: (ticketID, { ticketId = '' }) => (
        <span className={styles.blueText} style={{ paddingLeft: '10px' }}>
          #{ticketID || ticketId || ''}
        </span>
      ),
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeInfo',
      key: 'employeeID',
      width: 250,
      render: ({ employeeCode = '' } = {}) => <span>{employeeCode || ''}</span>,
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
      dataIndex: 'employeeInfo',
      key: 'name',
      width: 250,
      render: (employee) => {
        return (
          <UserProfilePopover data={employee}>
            {!isEmpty(employee) ? (
              <Link
                to={getEmployeeUrl(employee?.generalInfo?.userId)}
                className={styles.employeeName}
              >
                {employee?.legalName}
              </Link>
            ) : (
              ''
            )}
          </UserProfilePopover>
        );
      },
    },
    {
      title: 'Manager',
      dataIndex: 'employeeInfo',
      key: 'manager',
      width: 250,
      render: ({ manager = {} }) => (
        <UserProfilePopover data={manager}>
          {!isEmpty(manager) ? (
            <Link to={getEmployeeUrl(manager?.userId)} className={styles.employeeName}>
              {manager?.legalName}
            </Link>
          ) : (
            ''
          )}
        </UserProfilePopover>
      ),
      align: 'left',
    },
    {
      title: 'Department',
      dataIndex: 'employeeInfo',
      key: 'department',
      width: 200,
      render: ({ department: { name = '' } = {} } = {}) => (
        <span className={styles.directoryTable_departmentText}>{name || ''}</span>
      ),
      align: 'left',
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
          <span>
            {moment(fromDate).format(DATE_FORMAT_MDY)} to {moment(toDate).format(DATE_FORMAT_MDY)}
          </span>
        );
      },
      // sorter: (a, b) => moment(a.fromDate) - moment(b.fromDate),
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Type',
      dataIndex: 'typeReport',
      key: 'typeReport',
      width: 250,
      render: (typeReport = '') => (
        <span
          className={
            typeReport === TYPE_TICKET_APPROVAL.TIMEOFF ? styles.yellowText : styles.blueText
          }
        >
          {typeReport === TYPE_TICKET_APPROVAL.TIMEOFF ? 'Timeoff' : 'Timesheet'}
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

  const onFilter = (values) => {
    setFilter(values);
  };

  const renderOption = () => {
    const applied = Object.values(filter).filter((v) => v).length;
    const content = (
      <FilterContent onFilter={onFilter} filter={filter} fetchListTicket={fetchListTicket} />
    );
    return (
      <div className={styles.searchFilter}>
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            onFilter({});
          }}
        />
        <FilterPopover placement="bottomRight" content={content}>
          <CustomOrangeButton showDot={applied > 0} />
        </FilterPopover>
        <CustomSearchBox onSearch={onChangeKeySearch} placeholder="Search by Name" />
      </div>
    );
  };

  return (
    <div className={styles.approvalPage}>
      <Card className={styles.approvalPage__table} extra={renderOption()}>
        <div className={styles.tableApproval}>
          <CommonTable
            columns={columns}
            list={listData}
            loading={loadingTable || loadingReject || loadingApproval || loadingApprovalTimeSheet}
            size="small"
          />
        </div>
      </Card>
      <DetailTicket
        openModal={openModal}
        viewedDetail={viewedDetail}
        ticket={ticket}
        onCancel={() => setOpenModal(false)}
        setViewedDetail={setViewedDetail}
        refreshData={fetchListTicket}
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
    dashboard: { allTicket = [], totalTicket, isLoadData },
    user: { currentUser: { employee = {} } = {} },
  }) => ({
    loadingTable: loading.effects['dashboard/fetchAllListTicket'],
    loadingReject: loading.effects['dashboard/rejectTicket'],
    loadingApproval: loading.effects['dashboard/approvalTicket'],
    loadingApprovalTimeSheet: loading.effects['dashboard/approveTimeSheetRequest'],
    companyLocationList,
    allTicket,
    employee,
    totalTicket,
    isLoadData,
  }),
)(ApprovalPage);
