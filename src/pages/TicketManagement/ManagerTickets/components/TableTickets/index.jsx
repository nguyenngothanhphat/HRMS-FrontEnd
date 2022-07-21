import { Popover, Spin, Table } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { memo, Suspense, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import PersonIcon from '@/assets/assignPerson.svg';
import TeamIcon from '@/assets/assignTeam.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import AssignTeamModal from '@/pages/TicketManagement/components/AssignTeamModal';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import TicketsItem from '../TicketsItem';
import styles from './index.less';

const DropdownSearch = React.lazy(() => import('../DropdownSearch'));

const TableTickets = (props) => {
  const {
    companyLocationList = [],
    data = [],
    dispatch,
    employee: { _id: employeeId = '' },
    employee = {},
    locationsList = [],
    textEmpty = 'No tickets found',
    loading = false,
    pageSelected,
    size,
    getPageAndSize = () => {},
    refreshFetchTicketList = () => {},
    employeeFilterList = [],
    loadingFetchEmployee = false,
    role = '',
    selectedFilterTab = '',
    loadingUpdate = false,
  } = props;
  const [timezoneListState, setTimezoneListState] = useState([]);
  const [ticket, setTicket] = useState({});
  const [currentTimeState, setCurrentTimeState] = useState(moment());
  const [nameSearch, setNameSearch] = useState('');
  const [oldName, setOldName] = useState('');
  const [selected, setSelected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldId, setOldId] = useState();

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

  const handleSelectChange = (value, newName) => {
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
    setSelected(false);
    if (value) {
      dispatch({
        type: 'ticketManagement/updateTicket',
        payload: {
          id,
          employeeRaise,
          employeeAssignee: value,
          action: 'ASSIGN_EMPLOYEE',
          oldEmployeeAssignee: oldId || '',
          status: 'Assigned',
          queryType,
          subject,
          description,
          priority,
          ccList,
          attachments,
          departmentAssign,
          employee: employeeId,
          oldName,
          newName,
          role,
        },
      }).then((res) => {
        const { statusCode = '' } = res;
        if (statusCode === 200) {
          setSelected(true);
          refreshFetchTicketList();
          setNameSearch('');
        }
      });
    }
  };

  const handleAssignTeam = (id) => {
    handleClickSelect(id);
    setModalVisible(true);
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
          employeeFilterList={employeeFilterList}
          handleSelectChange={handleSelectChange}
          loading={loadingFetchEmployee || loadingUpdate}
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

  const dataHover = (values) => {
    const {
      generalInfo: {
        legalName = '',
        avatar: avatar1 = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        skills = [],
      } = {},
      generalInfo = {},
      department = {},
      location: locationInfo = {},
      manager: managerInfo = {},
      title = {},
    } = values;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      locationInfo,
      generalInfo,
      managerInfo,
      title,
      avatar1,
      skills,
    };
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
        sorter: { compare: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix() },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Requester Name',
        dataIndex: 'employeeRaise',
        key: 'requesterName',
        render: (employeeRaise = {}) => {
          const { generalInfo = {}, generalInfo: { legalName = '', userId = '' } = {} } =
            employeeRaise;
          return (
            <UserProfilePopover placement="top" trigger="hover" data={dataHover(employeeRaise)}>
              <span className={styles.userID} onClick={() => viewProfile(userId || '')}>
                {!isEmpty(generalInfo)
                  ? `${
                      legalName.length > 20
                        ? `${legalName.substr(0, 4)}...${legalName.substr(
                            legalName.length - 8,
                            legalName.length,
                          )}`
                        : legalName
                    }`
                  : ''}
              </span>
              <div className={styles.userID}>{`(${userId})`}</div>
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
        align: 'center',
        render: (employeeAssignee, row) => {
          if (employeeAssignee) {
            return (
              <TicketsItem
                employeeAssignee={employeeAssignee}
                renderMenuDropdown={renderMenuDropdown}
                viewProfile={viewProfile}
                handleClickSelect={handleClickSelect}
                refreshFetchTicketList={refreshFetchTicketList}
                row={row}
                selected={selected}
                setOldAssignName={setOldName}
                setOldId={setOldId}
                setModalVisible={setModalVisible}
              />
            );
          }
          return (
            <>
              <Popover
                trigger="click"
                overlayClassName={styles.dropdownPopover}
                content={renderMenuDropdown()}
                placement="bottomRight"
              >
                <img
                  width={35}
                  height={35}
                  src={PersonIcon}
                  alt="assign person icon"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => handleClickSelect(row.id)}
                />
              </Popover>
              <img
                width={35}
                height={35}
                src={TeamIcon}
                alt="assign team icon"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => handleAssignTeam(row.id)}
              />
            </>
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
    setOldId();
    setOldName('');
    setTicket({});
  }, [selectedFilterTab]);
  useEffect(() => {
    fetchTimezone();
  }, [JSON.stringify(companyLocationList)]);

  useEffect(() => {
    const roleEmployee = employee && employee?.title ? employee.title.roles : [];
    const companyInfo = employee ? employee.company : {};
    const payload = {
      status: ['ACTIVE'],
      roles: roleEmployee,
      employee: employeeId,
      company: [companyInfo],
    };
    payload.name = nameSearch;
    dispatch({
      type: 'ticketManagement/searchEmployee',
      payload,
    });
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
    defaultPageSize: size,
    pageSizeOptions: ['10', '25', '50', '100'],
    showSizeChanger: true,
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
      <AssignTeamModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        refreshFetchTicketList={refreshFetchTicketList}
        ticket={ticket}
        role={role}
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
