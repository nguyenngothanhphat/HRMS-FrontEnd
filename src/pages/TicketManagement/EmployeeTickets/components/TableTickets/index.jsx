import React, { PureComponent } from 'react';
import { Table, Popover, Col, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history, connect } from 'umi';
import { isEmpty } from 'lodash';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import UserProfilePopover from '@/pages/TicketManagement/components/UserProfilePopover';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import TicketsItem from '../TicketsItem';
import styles from './index.less';

@connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], locationsList = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    listEmployee,
    locationsList,
    employee,
    companyLocationList,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  }),
)
class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      currentTime: moment(),
      timezoneList: [],
    };
  }

  componentDidMount = () => {
    this.fetchTimezone();
  };

  componentDidUpdate(prevProps) {
    const { companyLocationList = [] } = this.props;
    if (JSON.stringify(prevProps.companyLocationList) !== JSON.stringify(companyLocationList)) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { companyLocationList = [] } = this.props;
    const timezoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  openViewTicket = (ticketID) => {
    const { data = [] } = this.props;
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

  handleClickSelect = (value) => {
    const { data = [] } = this.props;
    const ticket = data.find((val) => val.id === value);
    this.setState({ ticket });
  };

  handleSelectChange = () => {
    const { ticket } = this.state;
    const {
      dispatch,
      employee: { _id = '' } = {},
      refreshFetchData = () => {},
      refreshFetchTotalList = () => {},
      role = '',
    } = this.props;
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
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        refreshFetchData();
        refreshFetchTotalList();
      }
    });
  };

  handleSelect = (e) => {
    e.preventDefault();
  };

  setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const { currentTime } = this.state;
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTime).format(timeFormat)),
    );

    if (check) {
      this.setState({
        currentTime: moment(),
      });
    }
  };

  locationContent = (location) => {
    const { locationsList = [] } = this.props;
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

    const { timezoneList, currentTime } = this.state;

    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};

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
            ? getCurrentTimeOfTimezone(currentTime, findTimezone.timezone)
            : 'Not enough data in address'}
        </span>
      </div>
    );
  };

  viewProfile = (userId) => {
    history.push(`/directory/employee-profile/${userId}`);
  };

  renderMenuDropdown = () => {
    return (
      <Row>
        <Col span={24}>
          <div className={styles.employee} onClick={this.handleSelectChange}>
            <span>Assign to self</span>
          </div>
        </Col>
      </Row>
    );
  };

  render() {
    const {
      data = [],
      textEmpty = 'No rasie ticket  is submitted',
      loading,
      pageSelected,
      size,
      getPageAndSize = () => {},
    } = this.props;

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
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const { locationsList } = this.props;

    const columns = [
      {
        title: 'Ticket ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
        render: (id) => {
          return (
            <span className={styles.ticketID} onClick={() => this.openViewTicket(id)}>
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
        title: 'Requester Name ',
        dataIndex: 'employeeRaise',
        key: 'requesterName',
        render: (employeeRaise = {}) => {
          const { generalInfo = {}, generalInfo: { legalName = '', userId = '' } = {} } =
            employeeRaise;
          return (
            <UserProfilePopover
              placement="top"
              trigger="hover"
              data={{ ...employeeRaise, ...employeeRaise.generalInfo }}
            >
              <div
                className={styles.userID}
                onClick={() => this.viewProfile(employeeRaise?.generalInfo?.userId || '')}
              >
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
              </div>
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
          const locationNew =
            locationsList.length > 0 ? locationsList.filter((val) => val._id === location) : [];
          const name = locationNew.length > 0 ? locationNew[0].name : '';
          return (
            <Popover content={this.locationContent(location)} title={name} trigger="hover">
              <span
                style={{ wordWrap: 'break-word', wordBreak: 'break-word', cursor: 'pointer' }}
                onMouseEnter={this.setCurrentTime}
              >
                {location ? name : '_'}
              </span>
            </Popover>
          );
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
          const { ticket = {} } = this.state;
          const {
            role = '',
            employee: { _id = '' } = {},
            refreshFetchData = () => {},
            refreshFetchTotalList = () => {},
          } = this.props;
          if (employeeAssignee) {
            return (
              <TicketsItem
                employeeAssignee={employeeAssignee}
                row={row}
                viewProfile={this.viewProfile}
                refreshFetchData={refreshFetchData}
                refreshFetchTotalList={refreshFetchTotalList}
                handleClickSelect={this.handleClickSelect}
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
              content={this.renderMenuDropdown()}
              placement="bottomRight"
            >
              <div
                onClick={() => this.handleClickSelect(row.id)}
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

    return (
      <div className={styles.TableTickets}>
        <Table
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="emty" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.handleChangeTable}
          rowKey="id"
          scroll={{ x: 1500, y: 487 }}
        />
      </div>
    );
  }
}

export default TableTickets;
