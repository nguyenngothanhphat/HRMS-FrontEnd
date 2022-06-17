import { Avatar, Popover, Tabs, Tag } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import CommonTable from '@/components/CommonTable';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import UserProfilePopover from '@/components/UserProfilePopover';
import { dateFormat, OFFBOARDING, OFFBOARDING_MANAGER_TABS } from '@/utils/offboarding';
import { addZeroToNumber, removeEmptyFields } from '@/utils/utils';
import styles from './index.less';
import SetMeetingModal from '../../../SetMeetingModal';
import FilterContent from './components/FilterContent';

const TeamRequest = (props) => {
  const {
    dispatch,
    offboarding: {
      teamRequests: { list = [], totalStatus = {} } = {},
      selectedLocations = [],
    } = {},
    loadingFetchList = false,
  } = props;

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(OFFBOARDING.STATUS.IN_PROGRESS);
  const [handlingRequest, setHandlingRequest] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [filterForm, setFilterForm] = useState({});

  const fetchData = () => {
    const payload = {
      location: selectedLocations,
      page,
      limit: size,
      status: currentStatus,
      search: searchText,
    };
    if (!isEmpty(filterValues)) {
      const { fromDate = '', toDate = '' } = filterValues;
      if (fromDate) {
        payload.fromDate = moment(fromDate).format('YYYY-MM-DD');
      }
      if (toDate) {
        payload.toDate = moment(toDate).format('YYYY-MM-DD');
      }
    }
    dispatch({
      type: 'offboarding/fetchListEffect',
      payload,
    });
  };

  const onSetOneOnOneMeeting = async (values) => {
    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        id: handlingRequest?._id,
        employeeId: handlingRequest?.employee?._id,
        action: OFFBOARDING.UPDATE_ACTION.MANAGER_RESCHEDULE,
        meeting: {
          managerDate: moment(values.time),
        },
      },
    });
    if (res.statusCode === 200) {
      fetchData();
      setHandlingRequest(null);
    }
  };

  const onSearchDebounce = debounce((value) => {
    setSearchText(value);
  }, 1000);

  const onChangeSearch = (e) => {
    const formatValue = e.target.value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const onFilter = (values) => {
    setFilterValues(values);
  };

  useEffect(() => {
    fetchData();
  }, [
    currentStatus,
    page,
    size,
    searchText,
    JSON.stringify(selectedLocations),
    JSON.stringify(filterValues),
  ]);

  const getTabName = (tab) => {
    return `${tab.label} (${addZeroToNumber(totalStatus.asObject?.[tab.id] || 0)})`;
  };

  const filterPane = () => {
    let applied = Object.keys(removeEmptyFields(filterValues)).length;
    if (filterValues.fromDate && filterValues.toDate) {
      applied -= 1;
    }

    return (
      <div className={styles.filterPane}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              setFilterValues({});
              filterForm.resetFields();
            }}
          >
            {applied} filters applied
          </Tag>
        )}
        <FilterPopover
          placement="bottomRight"
          realTime
          content={<FilterContent onFinish={onFilter} setFilterForm={setFilterForm} />}
        >
          <FilterButton showDot={applied > 0} />
        </FilterPopover>
        <CustomSearchBox
          placeholder="Search for Ticket number, resignee, request ..."
          width={350}
          onSearch={onChangeSearch}
        />
      </div>
    );
  };

  const renderMenuDropdown = (row = {}) => {
    return (
      <div className={styles.containerDropdown}>
        <div className={styles.btn}>
          <span>
            <Link to={`/offboarding/list/review/${row._id}`}>Change assigned</Link>
          </span>
        </div>
        {!row.meeting?.employeeDate && !row.meeting?.managerDate && (
          <div
            className={styles.btn}
            onClick={() => {
              setHandlingRequest(row);
              setShowDropdown(false);
            }}
          >
            <span>Schedule 1 on 1</span>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: <span className={styles.title}>Ticket ID </span>,
      dataIndex: 'ticketId',
      render: (ticketId, record) => {
        return (
          <Link to={`/offboarding/list/review/${record._id}`} className={styles.title__value}>
            {ticketId}
          </Link>
        );
      },
      fixed: 'left',
    },
    {
      title: <span className={styles.title}>Created Date</span>,
      dataIndex: 'createdAt',
      render: (createdAt = '') => {
        return <span>{createdAt ? moment(createdAt).format('MM/DD/YYYY') : ''}</span>;
      },
    },
    {
      title: <span className={styles.title}>Employee ID</span>,
      dataIndex: 'employee',
      render: (obj = {}) => {
        return <span>{obj?.employeeId}</span>;
      },
    },
    {
      title: <span className={styles.title}>Requestee Name</span>,
      dataIndex: 'employee',
      ellipsis: true,
      render: (obj = {}) => {
        const { generalInfoInfo: { legalName = '', userId = '' } = {} } = obj;
        return (
          <UserProfilePopover
            placement="bottomRight"
            data={{
              ...obj,
              generalInfo: obj.generalInfoInfo,
              // locationInfo: obj.location,
              // department: row.department,
              // manager: row.manager,
            }}
          >
            <Link to={`/directory/employee-profile/${userId}`} className={styles.title__value}>
              {legalName}
            </Link>
          </UserProfilePopover>
        );
      },
    },
    {
      title: 'Manager',
      dataIndex: 'assigned',
      render: (assigned = {}) => {
        const { generalInfoInfo: { avatar = '' } = {} || {} } = assigned?.manager || {};

        return (
          <UserProfilePopover
            placement="bottomRight"
            data={{
              ...assigned?.manager,
              generalInfo: assigned?.manager?.generalInfoInfo,
            }}
          >
            <div className={styles.user}>
              <Avatar src={<img alt="" src={avatar || DefaultAvatar} />} />
              <span>{assigned?.manager?.generalInfoInfo?.legalName}</span>
            </div>
          </UserProfilePopover>
        );
      },
    },
    {
      title: <span className={styles.title}>HR POC</span>,
      dataIndex: 'assigned',
      render: (assigned = {}) => {
        if (isEmpty(assigned?.hr)) {
          return '-';
        }

        return (
          <UserProfilePopover
            placement="bottomRight"
            data={{
              ...assigned?.hr,
              generalInfo: assigned?.hr?.generalInfoInfo,
            }}
          >
            <div className={styles.user}>
              <Avatar
                src={<img alt="" src={assigned?.hr?.generalInfoInfo?.avatar || DefaultAvatar} />}
              />
              <span>{assigned?.hr?.generalInfoInfo?.legalName}</span>
            </div>
          </UserProfilePopover>
        );
      },
    },
    {
      title: <span className={styles.title}>1-on-1 date</span>,
      dataIndex: 'meeting',
      render: (meeting = {}, row) => {
        const { employeeDate = '', managerDate = '' } = meeting;
        if (employeeDate || managerDate) {
          return (
            <span
              style={{
                textTransform: 'uppercase',
              }}
            >
              {moment(managerDate || employeeDate).format(`${dateFormat} h:mm a`)}
            </span>
          );
        }
        return (
          <span
            className={styles.title__value}
            style={{
              textDecoration: 'underline',
            }}
            onClick={() => setHandlingRequest(row)}
          >
            Schedule 1 on 1
          </span>
        );
      },
    },
    {
      title: <span className={styles.title}>Action</span>,
      dataIndex: '_id',
      render: (id) => {
        return (
          <div className={styles.rowAction}>
            <Link to={`/offboarding/list/review/${id}`} className={styles.title__value}>
              View Request
            </Link>
          </div>
        );
      },
    },
    {
      title: '',
      align: 'right',
      width: '4%',
      render: (_, row) => {
        return (
          <Popover
            trigger="click"
            overlayClassName={styles.dropdownPopover}
            content={renderMenuDropdown(row)}
            placement="bottomRight"
            visible={showDropdown}
            onVisibleChange={(visible) => setShowDropdown(visible)}
          >
            <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
          </Popover>
        );
      },
    },
  ];

  const onChangePagination = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setSize(pageSize);
  };

  return (
    <div className={styles.TeamRequest}>
      <Tabs
        activeKey={currentStatus}
        destroyInactiveTabPane
        onChange={(key) => setCurrentStatus(key)}
        tabBarExtraContent={filterPane()}
      >
        {OFFBOARDING_MANAGER_TABS.map((x) => (
          <Tabs.TabPane tab={getTabName(x)} key={x.id}>
            <CommonTable
              loading={loadingFetchList}
              columns={columns}
              list={list}
              isBackendPaging
              limit={size}
              page={page}
              onChangePage={onChangePagination}
              // scrollable
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <SetMeetingModal
        visible={!!handlingRequest}
        title={`Set 1-on1 with ${handlingRequest?.employee?.generalInfoInfo?.legalName}`}
        onClose={() => setHandlingRequest(null)}
        partnerRole="Employee"
        employee={handlingRequest?.employee}
        onFinish={onSetOneOnOneMeeting}
        selectedDate={moment()}
      />
    </div>
  );
};

export default connect(
  ({ offboarding = {}, user = {}, loading, location: { companyLocationList = [] } }) => ({
    user,
    offboarding,
    companyLocationList,
    loadingFetchList: loading.effects['offboarding/fetchListEffect'],
  }),
)(TeamRequest);
