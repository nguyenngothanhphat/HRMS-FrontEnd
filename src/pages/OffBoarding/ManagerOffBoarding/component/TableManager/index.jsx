/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Popover, Divider, Row, Col, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { getCurrentTimeOfTimezoneOption } from '@/utils/times';
import styles from './index.less';

@connect(({ locationSelection: { listLocationsByCompany = [] } = {} }) => ({
  listLocationsByCompany,
}))
class TableManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: '1',
      currentTime: moment(),
    };
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

  openViewTicket = (ticketID) => {
    const { data = [] } = this.props;
    let id = '';

    data.forEach((item) => {
      if (item.ticketID === ticketID) {
        id = item._id;
      }
    });

    if (id) {
      history.push(`/offboarding/list/review/${id}`);
    }
  };

  popupContent = (dataRow) => {
    const { timezoneList, listLocationsByCompany } = this.props;
    const { currentTime } = this.state;
    const {
      employee: {
        title: { name: titleName = 'UX Lead' } = {},
        employeeType: { name: typeName = '...' } = {},
        employeeId = '',
        generalInfo: {
          avatar = '',
          firstName = '',
          lastName = '',
          middleName = '',
          linkedIn = '',
          userId = '',
          workEmail = '',
          workNumber = '',
        } = {},
      } = {},
      department: { name: departmentName = '' } = {},
      location: { _id = '' } = {},
    } = dataRow;
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};
    let filterLocation = listLocationsByCompany.map((item) => (item._id === _id ? item : null));
    filterLocation = filterLocation.filter((item) => item !== null);

    const { headQuarterAddress: { state = '', country: { name: countryName = '' } = {} } = {} } =
      filterLocation[0];
    const locationName = `${state}, ${countryName}`;

    if (filterLocation.length === 0) return null;
    return (
      <div className={styles.popupContent}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar src={avatar} size={55} icon={<UserOutlined />} />
          </div>
          <div className={styles.employeeInfo}>
            <div className={styles.employeeInfo__name}>{fullName}</div>
            <div className={styles.employeeInfo__department}>
              {titleName}, {departmentName} Dept.
            </div>
            <div className={styles.employeeInfo__emplId}>
              {employeeId} | {typeName}
            </div>
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.contact}>
          <Row gutter={[24, 24]}>
            <Col span={7}>
              <div className={styles.contact__title}>Mobile: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{workNumber}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Email id: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{workEmail}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Location: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{locationName || ''}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Local Time: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>
                {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
                  ? getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone)
                  : 'Not enough data in address'}
              </div>
            </Col>
          </Row>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.popupActions}>
          <div
            className={styles.popupActions__link}
            onClick={() => history.push(`/directory/employee-profile/${userId}`)}
          >
            View full profile
          </div>
          <div className={styles.popupActions__actions}>
            <Tooltip title="Message">
              <img
                src="/assets/images/messageIcon.svg"
                alt="img-arrow"
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title="Email">
              <img
                src="/assets/images/iconMail.svg"
                alt="img-arrow"
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title="LinkedIn">
              <a disabled={!linkedIn} href={linkedIn} target="_blank" rel="noopener noreferrer">
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

  popupContentHr = (data) => {
    const { timezoneList, listLocationsByCompany } = this.props;
    const { currentTime } = this.state;
    const {
      generalInfo: {
        legalName = '',
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

    if (filterLocation.length === 0) {
      return null;
    }
    const { headQuarterAddress: { state = '', country: { name: countryName = '' } = {} } = {} } =
      filterLocation[0];
    const locationName = `${state}, ${countryName}`;

    return (
      <div className={styles.popupContent}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar src={avatar} size={55} icon={<UserOutlined />} />
          </div>
          <div className={styles.employeeInfo}>
            <div className={styles.employeeInfo__name}>{legalName}</div>
            <div className={styles.employeeInfo__department}>
              {titleName}, {departmentName} Dept.
            </div>
            <div className={styles.employeeInfo__emplId}>
              {employeeId || hrId} | {typeName}
            </div>
          </div>
        </div>
        <Divider />
        <div className={styles.contact}>
          <Row gutter={[24, 24]}>
            <Col span={7}>
              <div className={styles.contact__title}>Mobile: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{workNumber}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Email id: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{workEmail}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Location: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>{locationName || ''}</div>
            </Col>
            <Col span={7}>
              <div className={styles.contact__title}>Local Time: </div>
            </Col>
            <Col span={17}>
              <div className={styles.contact__value}>
                {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
                  ? getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone)
                  : 'Not enough data in address'}
              </div>
            </Col>
          </Row>
        </div>
        <Divider />
        <div className={styles.popupActions}>
          <div
            className={styles.popupActions__link}
            onClick={() => history.push(`/directory/employee-profile/${userId}`)}
          >
            View full profile
          </div>
          <div className={styles.popupActions__actions}>
            <Tooltip title="Message">
              <img
                src="/assets/images/messageIcon.svg"
                alt="img-arrow"
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title="Email">
              <img
                src="/assets/images/iconMail.svg"
                alt="img-arrow"
                style={{ marginLeft: '5px', cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title="LinkedIn">
              <a disabled={!linkedIn} href={linkedIn} target="_blank" rel="noopener noreferrer">
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
      textEmpty = 'No resignation request is submitted',
      loading,
      pageSelected,
      size,
      total: totalAll,
      getPageAndSize = () => {},
    } = this.props;
    // const { pageNavigation } = this.state;
    // const rowSize = 10;

    const pagination = {
      position: ['bottomLeft'],
      total: totalAll,
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

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return (
            <span onClick={() => this.openViewTicket(ticketID)} className={styles.title__value}>
              {ticketID}
            </span>
          );
        },
        fixed: 'left',
        width: 200,
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <span>{employee.employeeId}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'requestDate',
        render: (requestDate) => {
          return <span>{moment(requestDate).format('YYYY/MM/DD')}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Requestee Name </span>,
        dataIndex: 'employee',
        ellipsis: true,
        render: (employee, row) => {
          const { generalInfo: { firstName = '', userId = '' } = {} } = employee;
          return (
            <Popover content={() => this.popupContent(row)} trigger="hover">
              <span
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
                className={`${styles.title__value} ${styles.title__requteeName}`}
              >
                {firstName}
              </span>
            </Popover>
          );
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Assigned To </span>,
        dataIndex: 'assigneeHR',
        width: 200,
        render: (assigneeHR) => {
          const {
            hrManager: {
              generalInfo: { firstName = '', lastName = '', middleName = '', userId = '' } = {} ||
                {},
            } = {} || {},
            hrManager = {},
          } = this.props;
          const fullName = `${firstName} ${middleName} ${lastName}`;

          if (!isEmpty(assigneeHR)) {
            const {
              generalInfo: {
                firstName: hrFirstName = '',
                lastName: hrLastName = '',
                middleName: hrMiddleName = '',
                userId: hrUserId = '',
              } = {},
            } = assigneeHR;
            const hrFullName = `${hrFirstName} ${hrMiddleName} ${hrLastName}`;
            return (
              <Popover content={() => this.popupContentHr(assigneeHR)} trigger="hover">
                <span
                  className={`${styles.title__value} ${styles.title__assignee}`}
                  onClick={() => history.push(`/directory/employee-profile/${hrUserId}`)}
                >
                  {hrFullName}
                </span>
              </Popover>
            );
          }
          return (
            <Popover content={() => this.popupContentHr(hrManager)} trigger="hover">
              <span
                className={`${styles.title__value} ${styles.title__hrManager}`}
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              >
                {fullName}
              </span>
            </Popover>
          );
        },
      },
      {
        title: <span className={styles.title}>HR Manager </span>,
        dataIndex: 'hr-manager',
        width: 400,
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
              <span
                className={`${styles.title__value} ${styles.title__hrManager}`}
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              >
                {fullName}
              </span>
            </Popover>
          );
        },
      },
      {
        title: <span className={styles.title}>Action</span>,
        // dataIndex: '_id',
        // render: (_id) => (
        //   <div className={styles.rowAction}>
        //     <span onClick={() => this.push(_id)}>View Request</span>
        //   </div>
        // ),
      },
    ];

    return (
      <div className={styles.tableStyles}>
        <Table
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
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
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableManager;
