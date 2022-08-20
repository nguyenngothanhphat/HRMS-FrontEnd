import { Col, Popover, Row, Spin, Tag, Tooltip } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { connect, history, Link } from 'umi';
import PersonIcon from '@/assets/assignPerson.svg';
import TeamIcon from '@/assets/assignTeam.svg';
import EditTicketIcon from '@/assets/ticketManagement/Edit.svg';
import ArrowDownIcon from '@/assets/ticketManagement/ic_arrowDown.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddressPopover from '@/components/AddressPopover';
import CommonTable from '@/components/CommonTable';
import EmptyComponent from '@/components/Empty';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { PRIORITY_COLOR } from '@/constants/ticketManagement';
import EditTicketModal from '@/pages/TicketManagement/components/EditTicketModal';
import { getEmployeeUrl } from '@/utils/utils';
import AssignTeamModal from '../../../AssignTeamModal';
import TicketItem from './components/TicketItem';
import styles from './index.less';

const DropdownSearch = React.lazy(() =>
  import('../../../ManagerTickets/components/DropdownSearch'),
);

const TableTickets = (props) => {
  const {
    dispatch,
    data = [],
    textEmpty = 'No raise ticket is submitted',
    loading,
    employee: { _id: employeeId = '', legalName: oldName = '' },
    employee = {},
    companyLocationList = [],
    employeeFilterList = [],
    refreshFetchTotalList = () => {},
    refreshFetchData = () => {},
    role = '',
    total = 0,
    page = 1,
    size = 10,
    onChangePage = () => {},
    loadingFetchEmployee = false,
    loadingUpdate = false,
    permissions: { viewTicketByAdmin },
  } = props;

  const [ticket, setTicket] = useState({});
  const [nameSearch, setNameSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

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
    const ticketTemp = data.find((val) => val.id === value);
    setTicket(ticketTemp);
  };

  const handleSelectChange = (value, newName, status) => {
    const { employee: { generalInfo: { legalName = '' } = {} } = {} } = props;
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
    let payload = {
      id,
      employeeRaise,
      status: 'Assigned',
      queryType,
      subject,
      description,
      priority,
      ccList,
      attachments,
      departmentAssign,
      employee: employeeId,
      role,
    };
    if (isViewTicketByAdmin && value) {
      payload = {
        ...payload,
        employeeAssignee: value,
        action: 'ASSIGN_EMPLOYEE',
        oldEmployeeAssignee: status === 'New' ? '' : employeeId,
        oldName: status === 'New' ? '' : oldName,
        newName,
        permissions: ['M_ADMIN_VIEW_TICKETS'],
      };
    } else {
      payload = {
        ...payload,
        employeeAssignee: employeeId,
        newName: legalName,
      };
    }
    dispatch({
      type: 'ticketManagement/updateTicket',
      payload,
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        refreshFetchData();
        refreshFetchTotalList();
      }
    });
  };

  const viewProfile = (userId) => {
    history.push(`/directory/employee-profile/${userId}`);
  };

  const renderMenuDropdown = () => {
    return (
      <Row>
        <Col span={24}>
          <div className={styles.employee} onClick={handleSelectChange}>
            <span>Assign to self</span>
          </div>
        </Col>
      </Row>
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

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 500);

  const onChangeSearch = (e) => {
    const formatValue = e.target.value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const renderMenuAssignTo = () => {
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
  const handleAssignTeam = (id) => {
    handleClickSelect(id);
    setModalVisible(true);
  };

  const handleEditTicket = (id) => {
    handleClickSelect(id);
    setEditVisible(true);
  };

  const renderTag = (priority) => {
    return <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>;
  };

  const columns = [
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
        return renderTag(priority);
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
        const { generalInfo = {}, generalInfo: { legalName = '', userId = '' } = {} } =
          employeeRaise;
        return (
          <UserProfilePopover placement="top" data={dataHover(employeeRaise)}>
            <Link to={getEmployeeUrl(employeeRaise?.generalInfo?.userId)}>
              <span>
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
        const locationTemp = companyLocationList.find((val) => val._id === location);
        return (
          <AddressPopover location={locationTemp || {}}>
            <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {location ? locationTemp?.name : '-'}
            </span>
          </AddressPopover>
        );
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
    {
      title: 'Actions',
      dataIndex: 'employeeAssignee',
      key: 'employeeAssignee',
      fixed: 'right',
      render: (employeeAssignee, row) => {
        const { employee: { _id = '' } = {} } = props;
        if (employeeAssignee) {
          return (
            <TicketItem
              employeeAssignee={employeeAssignee}
              row={row}
              viewProfile={viewProfile}
              refreshFetchData={refreshFetchData}
              refreshFetchTotalList={refreshFetchTotalList}
              handleClickSelect={handleClickSelect}
              ticket={ticket}
              role={role}
              _id={_id}
            />
          );
        }
        if (isViewTicketByAdmin) {
          return (
            <>
              <Tooltip title="Edit">
                <img
                  width={32}
                  height={32}
                  src={EditTicketIcon}
                  alt="edit ticket icon"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => handleEditTicket(row.id)}
                />
              </Tooltip>
              <Popover
                trigger="click"
                overlayClassName={styles.dropdownPopover}
                content={renderMenuAssignTo()}
                placement="bottomRight"
              >
                <Tooltip title="Assign to">
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
                </Tooltip>
              </Popover>
              <Tooltip title="Move to Team">
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
              </Tooltip>
            </>
          );
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
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
                  fontWeight: 500,
                }}
              >
                Select User &emsp;
                <img src={ArrowDownIcon} alt="" />
              </div>
            </Popover>
            <Tooltip title="Edit">
              <img
                width={32}
                height={32}
                src={EditTicketIcon}
                alt="edit ticket icon"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => handleEditTicket(row.id)}
              />
            </Tooltip>
          </div>
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
          emptyText: <EmptyComponent image={empty} description={textEmpty} />,
        }}
        loading={loading}
        columns={columns}
        list={data}
        rowKey="id"
        total={total}
        isBackendPaging
        limit={size}
        page={page}
        onChangePage={onChangePage}
      />
      <AssignTeamModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        refreshFetchTicketList={refreshFetchData}
        ticket={ticket}
        role={role}
      />
      <EditTicketModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        refreshFetchTicketList={refreshFetchData}
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
    employee,
    employeeFilterList,
    permissions,
    companyLocationList,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
    loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
  }),
)(TableTickets);
