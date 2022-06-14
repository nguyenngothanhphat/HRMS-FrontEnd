import { Avatar, Popover, Tabs, Tooltip } from 'antd';
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
import { getCurrentLocation } from '@/utils/authority';
import { getEmployeeName, OFFBOARDING_STATUS, OFFBOARDING_TABS } from '@/utils/offboarding';
import { addZeroToNumber } from '@/utils/utils';
import styles from './index.less';

const TeamRequest = (props) => {
  const {
    dispatch,
    offboarding: { listTeamRequest = [], totalListTeamRequest = [], selectedLocations = [] } = {},
    loadingFetchListTeamRequest = false,
  } = props;

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(OFFBOARDING_STATUS.ACCEPTED);

  useEffect(() => {
    dispatch({
      type: 'offboarding/fetchListTeamRequest',
      payload: {
        location: [selectedLocations],
        page,
        limit: size,
        status: currentStatus,
      },
    });
  }, [currentStatus, page, size, JSON.stringify(selectedLocations)]);

  const getTabName = (tab) => {
    const find = totalListTeamRequest.find((item) => item._id === tab.id);
    return `${tab.label} (${addZeroToNumber(find?.count || 0)})`;
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
      dataIndex: 'ticketID',
      render: (ticketID, record) => {
        return (
          <Link to={`/offboarding/list/review/${record._id}`} className={styles.title__value}>
            {ticketID}
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
      render: (employee = {}) => {
        return <span>{employee?.employeeId}</span>;
      },
    },
    {
      title: <span className={styles.title}>Requestee Name</span>,
      dataIndex: 'employee',
      ellipsis: true,
      render: (employee = {}, row) => {
        const { generalInfo: { legalName = '', userId = '' } = {} } = employee;
        return (
          <UserProfilePopover
            placement="bottomRight"
            data={{
              ...employee,
              locationInfo: employee.location,
              department: row.department,
              manager: row.manager,
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
      dataIndex: 'manager',
      render: (manager = {}) => {
        const name = getEmployeeName(manager.generalInfo);
        const { generalInfo: { avatar = '' } = {} || {} } = manager;

        return (
          <Tooltip title={name}>
            <Avatar
              src={<img alt="" src={avatar || DefaultAvatar} />}
              style={{ width: 21, height: 21 }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: <span className={styles.title}>HR POC</span>,
      dataIndex: 'assigneeHR',
      render: (assigneeHR = {}) => {
        if (isEmpty(assigneeHR)) {
          return '-';
        }

        return (
          <UserProfilePopover
            placement="bottomRight"
            data={{
              ...assigneeHR,
              locationInfo: assigneeHR.location,
            }}
          >
            <Avatar
              src={<img alt="" src={assigneeHR?.generalInfo?.avatar || DefaultAvatar} />}
              style={{ width: 21, height: 21 }}
            />
          </UserProfilePopover>
        );
      },
    },
    {
      title: <span className={styles.title}>1-on-1 date</span>,
      render: () => {
        return (
          <span
            className={styles.title__value}
            style={{
              textDecoration: 'underline',
            }}
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
        {OFFBOARDING_TABS.map((x) => (
          <Tabs.TabPane tab={getTabName(x)} key={x.id}>
            <CommonTable
              loading={loadingFetchListTeamRequest}
              columns={columns}
              list={listTeamRequest}
              isBackendPaging
              limit={size}
              page={page}
              onChangePage={onChangePagination}
              scrollable
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default connect(
  ({ offboarding = {}, user = {}, loading, location: { companyLocationList = [] } }) => ({
    user,
    offboarding,
    companyLocationList,
    loadingFetchListTeamRequest: loading.effects['offboarding/fetchListTeamRequest'],
  }),
)(TeamRequest);
