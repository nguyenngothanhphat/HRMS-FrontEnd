import { Avatar, Popover, Tabs } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import {
  DATE_FORMAT,
  OFFBOARDING,
  OFFBOARDING_MANAGER_TABS,
  OFFBOARDING_TABS,
} from '@/constants/offboarding';
import { addZeroToNumber, removeEmptyFields } from '@/utils/utils';
import SetMeetingModal from '../SetMeetingModal';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const RequestTable = (props) => {
  const {
    dispatch,
    offboarding: {
      teamRequests: { list = [], totalStatus = {} } = {},
      selectedLocations = [],
      selectedDivisions = [],
    } = {},
    loadingFetchList = false,
    type = OFFBOARDING_TABS.TEAM,
  } = props;

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(OFFBOARDING.STATUS.IN_PROGRESS);
  const [handlingRequest, setHandlingRequest] = useState(null);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterValues, setFilterValues] = useState({});

  const fetchData = () => {
    const payload = {
      location: selectedLocations,
      selectedDivisions,
      page,
      limit: size,
      status: currentStatus,
      search: searchText,
    };
    if (type === OFFBOARDING_TABS.TEAM) {
      payload.isTeam = true;
    }
    if (!isEmpty(filterValues)) {
      const { fromDate = '', toDate = '' } = filterValues;
      if (fromDate) {
        payload.fromDate = moment(fromDate).format(DATE_FORMAT_YMD);
      }
      if (toDate) {
        payload.toDate = moment(toDate).format(DATE_FORMAT_YMD);
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
        action:
          type === OFFBOARDING_TABS.TEAM
            ? OFFBOARDING.UPDATE_ACTION.MANAGER_RESCHEDULE
            : OFFBOARDING.UPDATE_ACTION.HR_RESCHEDULE,
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
    if (selectedLocations && selectedLocations.length) {
      fetchData();
    }
  }, [
    currentStatus,
    page,
    size,
    searchText,
    JSON.stringify(selectedLocations),
    JSON.stringify(selectedDivisions),
    JSON.stringify(filterValues),
  ]);

  const getTabName = (tab) => {
    return `${tab.label} (${addZeroToNumber(totalStatus.asObject?.[tab.id] || 0)})`;
  };

  const getViewDetailURL = (id) => {
    if (type === OFFBOARDING_TABS.COMPANY_WIDE) {
      return `/offboarding/list/hr-review/${id}`;
    }
    return `/offboarding/list/review/${id}`;
  };

  const filterPane = () => {
    let applied = Object.keys(removeEmptyFields(filterValues)).length;
    if (filterValues.fromDate && filterValues.toDate) {
      applied -= 1;
    }

    return (
      <div className={styles.filterPane}>
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            onFilter({});
          }}
        />

        <FilterPopover
          placement="bottomLeft"
          realTime
          content={<FilterContent onFinish={onFilter} filter={filterValues} />}
        >
          <CustomOrangeButton showDot={applied > 0} />
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
    if (type === OFFBOARDING_TABS.TEAM) {
      return (
        <div className={styles.containerDropdown}>
          <div className={styles.btn}>
            <span>
              <Link to={getViewDetailURL(row._id)}>Change assigned</Link>
            </span>
          </div>

          {!row.meeting?.employeeDate && !row.meeting?.managerDate && (
            <div
              className={styles.btn}
              onClick={() => {
                setHandlingRequest(row);
                setShowDropdownId(null);
              }}
            >
              <span>Schedule 1 on 1</span>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={styles.containerDropdown}>
        <div className={styles.btn}>
          <span>
            <Link to={getViewDetailURL(row._id)}>Re-assign</Link>
          </span>
        </div>

        {row.managerNote?.isHrRequired && !row.meetingHR?.date && (
          <div
            className={styles.btn}
            onClick={() => {
              setHandlingRequest(row);
              setShowDropdownId(null);
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
      title: <span className={styles.title}>Ticket ID</span>,
      dataIndex: 'ticketId',
      width: '12%',
      ellipsis: true,
      fixed: 'left',
      render: (ticketId, record) => {
        return (
          <Link to={getViewDetailURL(record._id)} className={styles.title__value}>
            {ticketId}
          </Link>
        );
      },
    },
    {
      title: <span className={styles.title}>Created Date</span>,
      width: '10%',
      ellipsis: true,
      dataIndex: 'createdAt',
      render: (createdAt = '') => {
        return <span>{createdAt ? moment(createdAt).format(DATE_FORMAT_MDY) : ''}</span>;
      },
    },
    {
      title: <span className={styles.title}>Employee ID</span>,
      dataIndex: 'employee',
      ellipsis: true,
      width: '8%',
      render: (obj = {}) => {
        return <span>{obj?.employeeId}</span>;
      },
    },
    {
      title: <span className={styles.title}>Requestee Name</span>,
      width: '13%',
      dataIndex: 'employee',
      ellipsis: true,
      render: (obj = {}) => {
        const { generalInfoInfo: { legalName = '', userId = '' } = {} } = obj;
        return (
          <UserProfilePopover
            placement="bottomLeft"
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
      ellipsis: true,
      render: (assigned = {}) => {
        const { generalInfoInfo: { avatar = '' } = {} || {} } = assigned?.manager || {};

        return (
          <UserProfilePopover
            placement="bottomLeft"
            data={{
              ...assigned?.manager,
              generalInfo: assigned?.manager?.generalInfoInfo,
            }}
          >
            <div className={styles.user}>
              <Avatar
                src={
                  <img
                    alt=""
                    src={avatar || DefaultAvatar}
                    onError={(e) => {
                      e.target.src = DefaultAvatar;
                    }}
                  />
                }
              />
              <span>{assigned?.manager?.generalInfoInfo?.legalName}</span>
            </div>
          </UserProfilePopover>
        );
      },
    },
    {
      title: <span className={styles.title}>HR POC</span>,
      dataIndex: 'assigned',
      ellipsis: true,
      render: (assigned = {}) => {
        if (isEmpty(assigned?.hr)) {
          return '-';
        }

        return (
          <UserProfilePopover
            placement="bottomLeft"
            data={{
              ...assigned?.hr,
              generalInfo: assigned?.hr?.generalInfoInfo,
            }}
          >
            <div className={styles.user}>
              <Avatar
                src={
                  <img
                    alt=""
                    src={assigned?.hr?.generalInfoInfo?.avatar || DefaultAvatar}
                    onError={(e) => {
                      e.target.src = DefaultAvatar;
                    }}
                  />
                }
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
      ellipsis: true,
      render: (meeting = {}, row) => {
        const { employeeDate = '', managerDate = '' } = meeting;
        if (employeeDate || managerDate) {
          return (
            <span
              style={{
                textTransform: 'uppercase',
              }}
            >
              {moment(managerDate || employeeDate).format(`${DATE_FORMAT} h:mm a`)}
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
      fixed: 'right',
      ellipsis: true,
      width: '10%',
      render: (id) => {
        return (
          <div className={styles.rowAction}>
            <Link to={getViewDetailURL(id)} className={styles.title__value}>
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
      fixed: 'right',
      dataIndex: '_id',
      render: (_id, row) => {
        return (
          <Popover
            trigger="click"
            overlayClassName={styles.dropdownPopover}
            content={renderMenuDropdown(row)}
            placement="bottomLeft"
            visible={_id === showDropdownId}
            onVisibleChange={(visible) => setShowDropdownId(visible ? _id : null)}
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
    <div className={styles.RequestTable}>
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
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <SetMeetingModal
        visible={!!handlingRequest}
        title={`Set 1-on-1 with ${handlingRequest?.employee?.generalInfoInfo?.legalName}`}
        onClose={() => setHandlingRequest(null)}
        partnerRole="Employee"
        employee={handlingRequest?.employee}
        onFinish={onSetOneOnOneMeeting}
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
)(RequestTable);
