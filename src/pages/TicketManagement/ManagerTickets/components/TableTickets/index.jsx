import { DownOutlined } from '@ant-design/icons';
import { Popover, Spin, Table } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { memo, Suspense, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import UserProfilePopover from '@/pages/TicketManagement/components/UserProfilePopover';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

const DropdownSearch = React.lazy(() => import('../DropdownSearch'));

const TableTickets = (props) => {
  const {
    companyLocationList = [],
    data = [],
    dispatch,
    employee: { _id: employeeId = '' },
    locationsList = [],
    textEmpty = 'No tickets found',
    loading = false,
    pageSelected,
    size,
    getPageAndSize = () => {},
    refreshFetchTicketList = () => {},
    refreshFetchTotalList = () => {},
    employeeFilterList = [],
    loadingFetchEmployee = false,
  } = props;

  const [timezoneListState, setTimezoneListState] = useState([]);
  const [ticket, setTicket] = useState({});
  const [currentTimeState, setCurrentTimeState] = useState(moment());
  const [nameSearch, setNameSearch] = useState('');

  const openViewTicket = (ticketID) => {
    let id = '';

    data.forEach((item) => {
      if (item.id === ticketID) {
        id = item.id;
      }
    });

    if (id) {
      history.push(`/ticket-management/detail/${id}`);
    }
  };

  const handleClickSelect = (value) => {
    const result = data.find((val) => val.id === value);
    setTicket(result);
  };

  const handleSelectChange = (value) => {
    const {
      id = '',
      employee_raise: employeeRaise = '',
      query_type: queryType = '',
      subject = '',
      description = '',
      priority = '',
      cc_list: ccList = [],
      attachments = [],
      department_assign: departmentAssign = '',
    } = ticket;
    if (value !== undefined) {
      dispatch({
        type: 'ticketManagement/updateTicket',
        payload: {
          id,
          employeeRaise,
          employeeAssignee: value,
          status: 'Assigned',
          queryType,
          subject,
          description,
          priority,
          ccList,
          attachments,
          departmentAssign,
          employee: employeeId,
        },
      }).then((res) => {
        const { statusCode = '' } = res;
        if (statusCode === 200) {
          refreshFetchTicketList();
          refreshFetchTotalList();
        }
      });
    }
  };

  const viewProfile = (userId) => {
    history.push(`/directory/employee-profile/${userId}`);
  };

  const renderTag = (priority) => {
    if (priority === 'High') {
      return <div className={styles.priorityHigh}>{priority}</div>;
    }
    if (priority === 'Normal') {
      return <div className={styles.priorityMedium}>{priority}</div>;
    }
    if (priority === 'Urgent') {
      return <div className={styles.priorityUrgent}>{priority}</div>;
    }
    return <div className={styles.priorityLow}>{priority}</div>;
  };

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const onChangeSearch = (e) => {
    const formatValue = e.target.value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const renderMenuDropdown = () => {
    return (
      <Suspense fallback={<Spin />}>
        <DropdownSearch
          onChangeSearch={onChangeSearch}
          employeeFilterList={nameSearch ? employeeFilterList : []}
          handleSelectChange={handleSelectChange}
          loading={loadingFetchEmployee}
        />
      </Suspense>
    );
  };

  const fetchTimezone = () => {
    const timezoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id: locationId = '',
      } = location;
      timezoneList.push({
        locationId,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    setTimezoneListState(timezoneList);
  };

  const setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTimeState).format(timeFormat)),
    );

    if (check) {
      setCurrentTimeState(moment());
    }
  };

  const locationContent = (location) => {
    const result =
      locationsList.length > 0 ? locationsList.filter((val) => val._id === location)[0] : [] || [];
    const {
      headQuarterAddress: {
        addressLine1 = '',
        addressLine2 = '',
        state = '',
        country = {},
        zipCode = '',
      } = {},
      _id = '',
    } = result;

    const findTimezone = timezoneListState.find((timezone) => timezone.locationId === _id) || {};

    return (
      <div className={styles.locationContent}>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Address:
        </span>
        <span style={{ display: 'block', fontSize: '13px', marginBottom: '10px' }}>
          {addressLine1}
          {addressLine2 && ', '}
          {addressLine2}
          {state && ', '}
          {state}
          {country ? ', ' : ''}
          {country?.name || country || ''}
          {zipCode && ', '}
          {zipCode}
        </span>
        <span
          style={{ display: 'block', fontSize: '13px', color: '#0000006e', marginBottom: '5px' }}
        >
          Local time{state && ` in  ${state}`}:
        </span>
        <span style={{ display: 'block', fontSize: '13px' }}>
          {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
            ? getCurrentTimeOfTimezone(currentTimeState, findTimezone.timezone)
            : 'Not enough data in address'}
        </span>
      </div>
    );
  };

  const getColumns = () => {
    return [
      {
        title: 'Ticket ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
        render: (id) => {
          return (
            <span className={styles.ticketID} onClick={() => openViewTicket(id)}>
              {id}
            </span>
          );
        },
        fixed: 'left',
        sorter: (a, b) => {
          return a.id && a.id - b.id;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Request Type',
        dataIndex: 'query_type',
        key: 'query_type',
        sorter: (a, b) => {
          return a.query_type && a.query_type.localeCompare(`${b.query_type}`);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        sorter: (a, b) => {
          return a.subject && a.subject.localeCompare(`${b.subject}`);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority) => {
          return <div className={styles.priority}>{renderTag(priority)}</div>;
        },
        sorter: (a, b) => {
          return a.priority && a.priority.localeCompare(`${b.priority}`);
        },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: 'Request Date',
        dataIndex: 'created_at',
        key: 'requestDate',
        render: (createdAt) => {
          return <span>{moment(createdAt).format('DD-MM-YYYY')}</span>;
        },
        sorter: (a, b) => {
          return a.priority && a.priority.localeCompare(`${b.priority}`);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Requester Name',
        dataIndex: 'employeeRaise',
        key: 'requesterName',
        render: (employeeRaise = {}) => {
          return (
            <UserProfilePopover
              placement="top"
              trigger="hover"
              data={{ ...employeeRaise, ...employeeRaise?.generalInfo }}
            >
              <span
                className={styles.userID}
                onClick={() => viewProfile(employeeRaise?.generalInfo?.userId || '')}
              >
                {!isEmpty(employeeRaise?.generalInfo)
                  ? `${employeeRaise?.generalInfo?.legalName} (${employeeRaise?.generalInfo?.userId})`
                  : ''}
              </span>
            </UserProfilePopover>
          );
        },
        sorter: (a, b) => {
          return a.employeeRaise.generalInfo && a.employeeRaise.generalInfo?.legalName
            ? a.employeeRaise.generalInfo?.legalName.localeCompare(
                `${b.employeeRaise.generalInfo?.legalName}`,
              )
            : null;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location) => {
          if (location) {
            const locationNew = locationsList.find((val) => val._id === location);
            return (
              <Popover
                content={locationContent(location)}
                title={locationNew?.name}
                trigger="hover"
              >
                <span
                  style={{ wordWrap: 'break-word', wordBreak: 'break-word', cursor: 'pointer' }}
                  onMouseEnter={setCurrentTime}
                >
                  {locationNew?.name}
                </span>
              </Popover>
            );
          }
          return '';
        },
        sorter: (a, b) => {
          const locationA = locationsList.find((val) => val._id === a.location);
          const locationB = locationsList.find((val) => val._id === b.location);
          if (locationA && locationB) {
            return locationA.name.localeCompare(locationB.name);
          }
          return null;
        },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: 'Assigned To',
        dataIndex: 'employeeAssignee',
        key: 'employeeAssignee',
        fixed: 'right',
        render: (employeeAssignee, row) => {
          if (employeeAssignee) {
            return (
              <UserProfilePopover
                placement="top"
                trigger="hover"
                data={{ ...employeeAssignee, ...employeeAssignee?.generalInfo }}
              >
                <span
                  className={styles.userID}
                  style={{ color: '#2c6df9' }}
                  onClick={() => viewProfile(employeeAssignee?.generalInfo?.userId || '')}
                >
                  {employeeAssignee?.generalInfo?.legalName}
                </span>
              </UserProfilePopover>
            );
          }
          return (
            <Popover
              trigger="click"
              overlayClassName={styles.dropdownPopover}
              content={renderMenuDropdown()}
              placement="bottomRight"
            >
              <div
                onClick={() => handleClickSelect(row.id)}
                style={{
                  width: 'fit-content',
                  cursor: 'pointer',
                  color: '#2c6df9',
                }}
              >
                Select User &emsp;
                <DownOutlined />
              </div>
            </Popover>
          );
        },
        sorter: (a, b) => {
          if (
            a.employeeAssignee?.generalInfo?.legalName &&
            b.employeeAssignee?.generalInfo?.legalName
          )
            return a.employeeAssignee.generalInfo && a.employeeAssignee.generalInfo?.legalName
              ? a.employeeAssignee.generalInfo?.legalName.localeCompare(
                  `${b.employeeAssignee.generalInfo?.legalName}`,
                )
              : null;
          return null;
        },
        sortDirections: ['ascend', 'descend'],
      },
    ];
  };

  useEffect(() => {
    fetchTimezone();
  }, [JSON.stringify(companyLocationList)]);

  useEffect(() => {
    const payload = {
      status: 'ACTIVE',
    };
    if (nameSearch) {
      payload.name = nameSearch;
      dispatch({
        type: 'ticketManagement/searchEmployee',
        payload,
      });
    } else {
      dispatch({
        type: 'ticketManagement/save',
        payload: {
          employeeFilterList: [],
        },
      });
    }
  }, [nameSearch]);

  const pagination = {
    position: ['bottomLeft'],
    total: data.length,
    showTotal: (total, range) => (
      <span>
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {data.length}
      </span>
    ),
    pageSize: size,
    current: pageSelected,
    onChange: (page, pageSize) => {
      getPageAndSize(page, pageSize);
    },
  };

  return (
    <div className={styles.TableTickets}>
      <Table
        locale={{
          emptyText: (
            <div className={styles.viewEmpty}>
              <img src={empty} alt="empty" />
              <p className={styles.textEmpty}>{textEmpty}</p>
            </div>
          ),
        }}
        loading={loading}
        columns={getColumns()}
        dataSource={data}
        hideOnSinglePage
        pagination={pagination}
        rowKey="id"
        scroll={{ x: 1500, y: 487 }}
      />
    </div>
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], locationsList = [], employeeFilterList = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    listEmployee,
    locationsList,
    employeeFilterList,
    employee,
    companyLocationList,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
    loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
  }),
)(memo(TableTickets));
