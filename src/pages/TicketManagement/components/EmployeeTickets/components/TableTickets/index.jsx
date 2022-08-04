import { Col, Popover, Row, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, history, Link } from 'umi';
import ArrowDownIcon from '@/assets/ticketManagement/ic_arrowDown.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddressPopover from '@/components/AddressPopover';
import CommonTable from '@/components/CommonTable';
import EmptyComponent from '@/components/Empty';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { PRIORITY_COLOR } from '@/constants/ticketManagement';
import { getEmployeeUrl } from '@/utils/directory';
import TicketItem from './components/TicketItem';
import styles from './index.less';

const TableTickets = (props) => {
  const {
    data = [],
    textEmpty = 'No raise ticket is submitted',
    loading,
    companyLocationList = [],
  } = props;

  const [ticket, setTicket] = useState({});

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

  const handleSelectChange = () => {
    const {
      dispatch,
      employee: { _id = '', generalInfo: { legalName = '' } = {} } = {},
      refreshFetchData = () => {},
      refreshFetchTotalList = () => {},
      role = '',
    } = props;
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
    dispatch({
      type: 'ticketManagement/updateTicket',
      payload: {
        id,
        employeeRaise,
        employeeAssignee: _id,
        status: 'Assigned',
        queryType,
        subject,
        description,
        priority,
        ccList,
        attachments,
        departmentAssign,
        employee: _id,
        role,
        newName: legalName,
      },
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

  const renderTag = (priority) => {
    return <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>;
  };

  const columns = [
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
      title: 'Assigned To',
      dataIndex: 'employeeAssignee',
      key: 'employeeAssignee',
      fixed: 'right',
      render: (employeeAssignee, row) => {
        const {
          role = '',
          employee: { _id = '' } = {},
          refreshFetchData = () => {},
          refreshFetchTotalList = () => {},
        } = props;
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
                fontWeight: 500,
              }}
            >
              Select User &emsp;
              <img src={ArrowDownIcon} alt="" />
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
      />
    </div>
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { listEmployee = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    listEmployee,
    employee,
    companyLocationList,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  }),
)(TableTickets);
