import { Popover, Spin, Tag } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { memo, Suspense, useEffect, useState } from 'react';
import { connect, history, Link } from 'umi';
import PersonIcon from '@/assets/assignPerson.svg';
import TeamIcon from '@/assets/assignTeam.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddressPopover from '@/components/AddressPopover';
import CommonTable from '@/components/CommonTable';
import EmptyComponent from '@/components/Empty';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { PRIORITY_COLOR } from '@/constants/ticketManagement';
import AssignTeamModal from '@/pages/TicketManagement/components/AssignTeamModal';
import { getEmployeeUrl } from '@/utils/utils';
import TicketItem from './components/TicketItem';
import styles from './index.less';

const DropdownSearch = React.lazy(() => import('../DropdownSearch'));

const TableTickets = (props) => {
  const {
    companyLocationList = [],
    data = [],
    dispatch,
    employee: { _id: employeeId = '' },
    employee = {},
    loading = false,
    pageSelected = 1,
    size,
    total = 0,
    getPageAndSize = () => {},
    refreshFetchTicketList = () => {},
    employeeFilterList = [],
    loadingFetchEmployee = false,
    role = '',
    selectedFilterTab = '',
    loadingUpdate = false,
    permissions: { assignTicket, appendTicket, viewTicketByAdmin },
  } = props;
  const [ticket, setTicket] = useState({});
  const [nameSearch, setNameSearch] = useState('');
  const [oldName, setOldName] = useState('');
  const [selected, setSelected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldId, setOldId] = useState();

  const isAssignTicket = assignTicket === 1;
  const isAppendTicket = appendTicket === 1;
  const isViewTicketByAdmin = viewTicketByAdmin === 1;

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

  const handleSelectChange = (value, supportTeam) => {
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
          supportTeam,
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

  const renderTag = (priority) => {
    return <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>;
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
        width: '7%',
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
      ...(isViewTicketByAdmin
        ? [
            {
              title: 'Support Team',
              dataIndex: 'support_team',
              key: 'support_team',
              width: '10%',
              render: (name) => {
                return name;
              },
              fixed: 'left',
              sorter: (a, b) => {
                return a.id && a.id - b.id;
              },
              sortDirections: ['ascend', 'descend'],
            },
          ]
        : []),
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
          return <span>{moment(createdAt).format(DATE_FORMAT_MDY)}</span>;
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
              <Link to={getEmployeeUrl(userId || '')}>
                <span className={styles.userID}>
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
                <span className={styles.userID}>{` (${userId})`}</span>
              </Link>
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
            const locationTemp = companyLocationList.find((val) => val._id === location);
            return (
              <AddressPopover location={locationTemp || {}}>
                <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                  {location ? locationTemp?.name : '-'}
                </span>
              </AddressPopover>
            );
          }
          return '';
        },
        sorter: (a, b) => {
          const locationA = companyLocationList.find((val) => val._id === a.location);
          const locationB = companyLocationList.find((val) => val._id === b.location);
          if (locationA && locationB) {
            return locationA.name.localeCompare(locationB.name);
          }
          return null;
        },
        sortDirections: ['ascend', 'descend'],
      },
      ...(isAssignTicket || isAppendTicket || isViewTicketByAdmin
        ? [
            {
              title: 'Assigned To',
              dataIndex: 'employeeAssignee',
              key: 'employeeAssignee',
              fixed: 'right',
              align: 'center',
              render: (employeeAssignee, row) => {
                if (employeeAssignee) {
                  return (
                    <TicketItem
                      employeeAssignee={employeeAssignee}
                      renderMenuDropdown={renderMenuDropdown}
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
                    {(isAssignTicket || isViewTicketByAdmin) && (
                      <Popover
                        trigger="click"
                        overlayClassName={styles.dropdownPopover}
                        content={renderMenuDropdown()}
                        placement="bottomRight"
                      >
                        <img
                          width={32}
                          height={32}
                          src={PersonIcon}
                          alt="assign person icon"
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() => handleClickSelect(row.id)}
                        />
                      </Popover>
                    )}
                    {(isAppendTicket || isViewTicketByAdmin) && (
                      <img
                        width={32}
                        height={32}
                        src={TeamIcon}
                        alt="assign team icon"
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAssignTeam(row.id)}
                      />
                    )}
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
          ]
        : []),
    ];
  };

  useEffect(() => {
    setOldId();
    setOldName('');
    setTicket({});
  }, [selectedFilterTab]);

  useEffect(() => {
    if (nameSearch) {
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
    }
  }, [nameSearch]);

  return (
    <div className={styles.TableTickets}>
      <CommonTable
        locale={{
          emptyText: <EmptyComponent image={empty} description="No tickets found" />,
        }}
        loading={loading}
        columns={getColumns()}
        list={data}
        rowKey="id"
        // scrollable
        // width="100vw"
        isBackendPaging
        page={pageSelected}
        limit={size}
        total={total}
        onChangPage={getPageAndSize}
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
    ticketManagement: { listEmployee = [], employeeFilterList = [] } = {},
    user: { currentUser: { employee = {} } = {}, permissions = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    listEmployee,
    employeeFilterList,
    employee,
    permissions,
    companyLocationList,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
    loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
  }),
)(memo(TableTickets));
