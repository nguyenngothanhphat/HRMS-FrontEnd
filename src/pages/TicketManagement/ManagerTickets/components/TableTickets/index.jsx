import React, { PureComponent } from 'react';
import { Table, Dropdown, Menu, Input, Empty, Popover } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history, connect } from 'umi';
import { isEmpty } from 'lodash';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import empty from '@/assets/timeOffTableEmptyIcon.svg';

import styles from './index.less';

@connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], locationsList = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    listEmployee,
    locationsList,
    employee,
    listLocationsByCompany,
    loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  }),
)
class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      // visible: false,
      search: [],
      currentTime: moment(),
      timezoneList: [],
    };
  }

  componentDidMount = () => {
    this.fetchTimezone();
  };

  componentDidUpdate(prevProps) {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
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
    // const { visible } = this.state;
    this.setState({ ticket });
  };

  handleSelectChange = (value) => {
    const {
      dispatch,
      employee: { _id },
    } = this.props;
    const { ticket } = this.state;
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
          employee: _id,
        },
      });
    }
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
    console.log('🚀 ~ file: index.jsx ~ line 154 ~ TableTickets ~ result', result);
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

  render() {
    const {
      data = [],
      textEmpty = 'No rasie ticket is submitted',
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
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const { listEmployee, locationsList } = this.props;
    const { search } = this.state;
    let filterData;
    if (search.length) {
      const searchPattern = new RegExp(search.map((term) => `(?=.*${term})`).join(''), 'i');
      filterData = listEmployee.filter((option) =>
        option.generalInfo.legalName.match(searchPattern),
      );
    } else {
      filterData = listEmployee;
    }
    const columns = [
      {
        title: 'Ticket ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
          return (
            <span className={styles.ticketID} onClick={() => this.openViewTicket(id)}>
              {id}
            </span>
          );
        },
        fixed: 'left',
      },
      {
        title: 'Request Type',
        dataIndex: 'query_type',
        key: 'query_type',
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
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
      },
      {
        title: 'Request Date',
        dataIndex: 'created_at',
        key: 'requestDate',
        render: (createdAt) => {
          return <span>{moment(createdAt).format('DD-MM-YYYY')}</span>;
        },
      },
      {
        title: 'Requester Name ',
        dataIndex: 'employeeRaise',
        key: 'requesterName',
        render: (employeeRaise = {}, id) => {
          const { generalInfo: { legalName = '', userId = '' } = {} } = employeeRaise || {};
          return (
            <span className={styles.userID} onClick={() => this.openViewTicket(id.id)}>
              {`${legalName} (${userId})`}
            </span>
          );
        },
      },
      // {
      //   title: 'User ID',
      //   dataIndex: 'employeeRaise',
      //   key: 'userID',
      //   render: (employeeRaise = {}, id) => {
      //     const { generalInfo: { userId = '' } = {} } = employeeRaise || {};
      //     return (
      //       <span className={styles.userID} onClick={() => this.openViewTicket(id.id)}>
      //         {userId}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   title: 'Name',
      //   dataIndex: 'employeeRaise',
      //   key: 'name',
      //   render: (employeeRaise = {}) => {
      //     const { generalInfo: { legalName = '' } = {} } = employeeRaise || {};
      //     return <span>{legalName}</span>;
      //   },
      // },

      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location) => {
          const locationNew =
            locationsList.length > 0 ? locationsList.filter((val) => val._id === location) : [];
          const name = locationNew.length > 0 ? locationNew[0].name : '';
          return (
            <Popover content={() => this.locationContent(location)} title={name} trigger="hover">
              <span
                style={{ wordWrap: 'break-word', wordBreak: 'break-word', cursor: 'pointer' }}
                onMouseEnter={this.setCurrentTime}
              >
                {location ? name : '_'}
              </span>
            </Popover>
          );
        },
      },

      {
        title: 'Assigned To',
        dataIndex: ['department_assign', 'employee_assignee', 'id'],
        key: 'assign',
        fixed: 'right',
        render: (departmentAssign, employeeAssignee) => {
          if (employeeAssignee.employee_assignee !== '') {
            const employeeAssigned = listEmployee.find(
              (val) => val._id === employeeAssignee.employee_assignee,
            );
            return (
              <span style={{ color: '#2c6df9' }}>
                {employeeAssigned ? employeeAssigned.generalInfo.legalName : ''}
              </span>
            );
          }
          return (
            <Dropdown
              overlayClassName="dropDown__manager"
              overlay={
                <Menu>
                  <div className="inputSearch">
                    <Input
                      placeholder="Search by name"
                      onChange={(e) => this.setState({ search: [e.target.value] })}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                  <Menu.Divider />
                  <div style={{ overflowY: 'scroll', maxHeight: '200px' }}>
                    {!isEmpty(filterData) ? (
                      filterData.map((val) => {
                        // const departmentID = val.department._id;
                        // if (departmentID === employeeAssignee.department_assign) {
                        return (
                          <Menu.Item
                            onClick={() => this.handleSelectChange(val._id)}
                            key={val._id}
                            value={val._id}
                          >
                            {val.generalInfo.legalName}
                          </Menu.Item>
                        );
                      })
                    ) : (
                      <Menu.Item>
                        <Empty />
                      </Menu.Item>
                    )}
                  </div>
                </Menu>
              }
              trigger={['click']}
            >
              <div onClick={() => this.handleClickSelect(employeeAssignee.id)}>
                Select User &emsp;
                <DownOutlined />
              </div>
            </Dropdown>
          );
        },
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
