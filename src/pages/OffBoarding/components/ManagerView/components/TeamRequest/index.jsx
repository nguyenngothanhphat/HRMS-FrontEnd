import { Avatar, Popover, Tabs } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import CommonTable from '@/components/CommonTable';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import UserProfilePopover from '@/components/UserProfilePopover';
import { OFFBOARDING, OFFBOARDING_MANAGER_TABS } from '@/utils/offboarding';
import { addZeroToNumber } from '@/utils/utils';
import styles from './index.less';
import SetMeetingModal from '../../../SetMeetingModal';

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

  const onScheduleMeeting = (values) => {
    console.log('🚀  ~ values', values);
  };

  useEffect(() => {
    dispatch({
      type: 'offboarding/fetchListEffect',
      payload: {
        location: selectedLocations,
        page,
        limit: size,
        status: currentStatus,
      },
    });
  }, [currentStatus, page, size, JSON.stringify(selectedLocations)]);

  const getTabName = (tab) => {
    return `${tab.label} (${addZeroToNumber(totalStatus.asObject?.[tab.id] || 0)})`;
  };

  const filterPane = () => {
    return (
      <div className={styles.filterPane}>
        <FilterPopover placement="bottomRight" realTime content={<p>Empty</p>}>
          <FilterButton showDot={false} />
        </FilterPopover>
        <CustomSearchBox
          placeholder="Search for Ticket number, resignee, request ..."
          width={350}
        />
      </div>
    );
  };

  const renderMenuDropdown = () => {
    return (
      <div className={styles.containerDropdown}>
        <div className={styles.btn}>
          <span>Change assigned</span>
        </div>
        <div className={styles.btn}>
          <span>Schedule 1 on 1</span>
        </div>
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
            <Avatar
              src={<img alt="" src={avatar || DefaultAvatar} />}
              style={{ width: 21, height: 21 }}
            />
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
            <Avatar
              src={<img alt="" src={assigned?.hr?.generalInfo?.avatar || DefaultAvatar} />}
              style={{ width: 21, height: 21 }}
            />
          </UserProfilePopover>
        );
      },
    },
    {
      title: <span className={styles.title}>1-on-1 date</span>,
      render: (_, row) => {
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
        onFinish={onScheduleMeeting}
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
