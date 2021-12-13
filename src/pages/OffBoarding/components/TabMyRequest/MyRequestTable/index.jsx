/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Popover, Divider, Row, Col, Avatar, Tooltip, message } from 'antd';
import moment from 'moment';
import { history, connect } from 'umi';
import { getCurrentTimeOfTimezoneOption } from '@/utils/times';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import t from './index.less';

@connect(({ locationSelection: { listLocationsByCompany = [] } = {} }) => ({
  listLocationsByCompany,
}))
class TableManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.setCurrentTime();
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

  push = (data) => {
    history.push(`/offboarding/my-request/${data}`);
  };

  // onChangePagination = (pageNumber) => {
  //   this.setState({
  //     pageNavigation: pageNumber,
  //   });
  // };

  openViewTicket = (ticketID) => {
    const { data = [], dataAll = [], isTabAll } = this.props;
    let id = '';

    if (isTabAll) {
      dataAll.forEach((item) => {
        if (item.ticketID === ticketID) {
          id = item._id;
        }
      });
    } else {
      data.forEach((item) => {
        if (item.ticketID === ticketID) {
          id = item._id;
        }
      });
    }
    if (id) {
      history.push(`/offboarding/list/review/${id}`);
    }
  };

  popupContentHr = (data) => {
    const { timezoneList, listLocationsByCompany } = this.props;
    const { currentTime } = this.state;
    const {
      generalInfo: {
        firstName = '',
        middleName = '',
        lastName = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        avatar = '',
        linkedIn = '',
      } = {},
      employee: { employeeId = '' } = {},
      employeeId: hrId = '',
      title: { name: titleName = '' } = {},
      employeeType: { name: typeName } = {},
      department: { name: departmentName = '' } = {},
      location: { _id = '' } = {},
    } = data;
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};
    let filterLocation = listLocationsByCompany.map((item) => (item._id === _id ? item : null));
    filterLocation = filterLocation.filter((item) => item !== null);

    const legalName = `${firstName} ${middleName} ${lastName}`;

    if (filterLocation.length === 0) {
      return null;
    }

    const { headQuarterAddress: { state = '', country: { name: countryName = '' } = {} } = {} } =
      filterLocation[0];
    const locationName = `${state}, ${countryName}`;

    return (
      <div className={t.popupContent}>
        <div className={t.generalInfo}>
          <div className={t.avatar}>
            <Avatar src={avatar} size={55} icon={<UserOutlined />} />
          </div>
          <div className={t.employeeInfo}>
            <div className={t.employeeInfo__name}>{legalName}</div>
            <div className={t.employeeInfo__department}>
              {titleName}, {departmentName} Dept.
            </div>
            <div className={t.employeeInfo__emplId}>
              {employeeId || hrId} | {typeName}
            </div>
          </div>
        </div>
        <Divider className={t.divider} />
        <div className={t.contact}>
          <Row gutter={[24, 24]}>
            <Col span={7}>
              <div className={t.contact__title}>Mobile: </div>
            </Col>
            <Col span={17}>
              <div className={t.contact__value}>{workNumber}</div>
            </Col>
            <Col span={7}>
              <div className={t.contact__title}>Email id: </div>
            </Col>
            <Col span={17}>
              <div className={t.contact__value}>{workEmail}</div>
            </Col>
            <Col span={7}>
              <div className={t.contact__title}>Location: </div>
            </Col>
            <Col span={17}>
              <div className={t.contact__value}>{locationName || ''}</div>
            </Col>
            <Col span={7}>
              <div className={t.contact__title}>Local Time: </div>
            </Col>
            <Col span={17}>
              <div className={t.contact__value}>
                {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
                  ? getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone)
                  : 'Not enough data in address'}
              </div>
            </Col>
          </Row>
        </div>
        <Divider className={t.divider} />
        <div className={t.popupActions}>
          <div
            className={t.popupActions__link}
            onClick={() => history.push(`/directory/employee-profile/${userId}`)}
          >
            View full profile
          </div>
          <div className={t.popupActions__actions}>
            <Tooltip title="Message">
              {/* <a href={linkedIn === '' ? null : linkedIn} target="_blank" rel="noopener noreferrer"> */}
              <img
                src="/assets/images/messageIcon.svg"
                alt="img-arrow"
                style={{ cursor: 'pointer' }}
              />
              {/* </a> */}
            </Tooltip>
            <Tooltip title="Email">
              <a
                disabled={!workEmail}
                href={`mailto:${workEmail}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/images/iconMail.svg"
                  alt="img-arrow"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <a
                onClick={() => {
                  if (linkedIn === '') message.warning('LinkedIn is empty');
                }}
                href={linkedIn === '' ? null : linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/images/iconLinkedin.svg"
                  alt="img-arrow"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      data = [],
      loading,
      textEmpty = 'No resignation request is submitted',
      pageSelected,
      size,
      total: totalData,
      getPageAndSize = () => {},
    } = this.props;
    // const { pageNavigation } = this.state;
    // const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: totalData,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of
          <b>{total}</b>
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const columns = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return (
            <p className={t.ticketId} onClick={() => this.openViewTicket(ticketID)}>
              {ticketID}
            </p>
          );
        },
      },
      {
        title: <span className={t.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={t.title}>Requested on</span>,
        dataIndex: 'createdAt',
        render: (createdAt) => {
          return <p>{moment(createdAt).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={t.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={t.title}>Assigned </span>,
        dataIndex: 'hr-manager',
        width: 200,
        render: () => {
          const {
            hrManager: {
              generalInfo: { firstName = '', lastName = '', middleName = '', userId = '' } = {},
            } = {},
            hrManager = {},
          } = this.props;
          const fullName = `${firstName} ${middleName} ${lastName}`;
          return (
            <Popover content={() => this.popupContentHr(hrManager)} trigger="hover">
              <p
                className={t.assignee}
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              >
                {fullName}
              </p>
            </Popover>
          );
        },
      },
      {
        title: <span className={t.title}>Reason of leaving</span>,
        dataIndex: 'reasonForLeaving',
        render: (reasonForLeaving) => <p className={t.reason}>{reasonForLeaving}</p>,
      },
      {
        title: <span className={t.title}>Action</span>,
        // dataIndex: '_id',
        // render: (_id) => (
        //   <div className={t.rowAction}>
        //     <span onClick={() => this.push(_id)}>View Request</span>
        //   </div>
        // ),
      },
    ];

    return (
      <div className={t.employeeTable}>
        <Table
          locale={{
            emptyText: (
              <div className={t.viewEmpty}>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}
export default TableManager;
