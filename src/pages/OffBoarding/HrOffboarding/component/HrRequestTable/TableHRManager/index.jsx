/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  Table,
  notification,
  Popover,
  Divider,
  Row,
  Col,
  Avatar,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import { UserOutlined, MoreOutlined } from '@ant-design/icons';
import moment from 'moment';
import { isEmpty } from 'lodash';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
// import MenuIcon from '@/assets/menuDots.svg';
import { history, connect } from 'umi';
import { getCurrentTimeOfTimezoneOffboarding } from '@/utils/times';
import AssignModal from './AssignModal';
import styles from './index.less';

@connect(({ locationSelection: { listLocationsByCompany = [] } = {} }) => ({
  listLocationsByCompany,
}))
class HrTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
      assignModalVisible: false,
      offBoardingRequest: '',
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

  renderContent = (row) => {
    const { _id = '', nodeStep = 1, relievingStatus = '' } = row;
    return (
      <div
        style={{ textDecoration: 'underline', cursor: 'pointer', color: '#2C6DF9' }}
        onClick={() => this.checkFunction(_id, nodeStep, relievingStatus)}
      >
        Move to relieving formalities
      </div>
    );
  };

  checkFunction = (id, nodeStep, relievingStatus) => {
    const { moveToRelieving = () => {} } = this.props;
    const payload = { id, relievingStatus: 'IN-QUEUES' };
    if (!relievingStatus && nodeStep === 4) {
      moveToRelieving(payload);
    } else {
      this.openNotificationWithIcon(nodeStep);
    }
  };

  openNotificationWithIcon = (nodeStep) => {
    const description =
      nodeStep >= 4 ? 'Moved to relieving formalities' : 'Please submit Last Working Date';
    notification.warning({
      message: 'Notification',
      description,
    });
  };

  // push = (data) => {
  //   history.push(`/offboarding/review/${data}`);
  // };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
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
      history.push(`/offboarding/review/${id}`);
    }
  };

  popupContent = (dataRow) => {
    // console.log(dataRow);
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

    return (
      <div className={styles.popupContent}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar src={avatar} size={60} icon={<UserOutlined />} />
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
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Mobile: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{workNumber}</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Email id: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{workEmail}</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Location: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{`${state}, ${countryName}`}</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Local Time: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>
                {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
                  ? getCurrentTimeOfTimezoneOffboarding(currentTime, findTimezone.timezone)
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
      title: { name: titleName = '' } = {},
      employeeType: { name: typeName } = {},
      department: { name: departmentName = '' } = {},
      location: { _id = '' } = {},
    } = data;
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};
    let filterLocation = listLocationsByCompany.map((item) => (item._id === _id ? item : null));
    filterLocation = filterLocation.filter((item) => item !== null);

    const { headQuarterAddress: { state = '', country: { name: countryName = '' } = {} } = {} } =
      filterLocation[0];

    return (
      <div className={styles.popupContent}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar src={avatar} size={60} icon={<UserOutlined />} />
          </div>
          <div className={styles.employeeInfo}>
            <div className={styles.employeeInfo__name}>{legalName}</div>
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
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Mobile: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{workNumber}</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Email id: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{workEmail}</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Location: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>{`${state}, ${countryName}`}</div>
              <div className={styles.contact__value}>HCM</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Local Time: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>
                {findTimezone && findTimezone.timezone && Object.keys(findTimezone).length > 0
                  ? getCurrentTimeOfTimezoneOffboarding(currentTime, findTimezone.timezone)
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

  actionMenu = (id) => {
    return (
      <Menu>
        <Menu.Item>
          <div onClick={() => this.handleAssignModal(true, id)}>Assign to</div>
        </Menu.Item>
      </Menu>
    );
  };

  handleAssignModal = (value, id) => {
    this.setState({
      assignModalVisible: value,
      offBoardingRequest: id,
    });
  };

  render() {
    const { pageNavigation } = this.state;
    const {
      data = [],
      loading,
      textEmpty = 'No resignation request is submitted',
      isTabAccept = false,
      isTabAll = false,
    } = this.props;

    const { assignModalVisible, offBoardingRequest } = this.state;
    // const dateFormat = 'YYYY/MM/DD';
    const rowSize = 10;
    const newData = data.map((item) => {
      return {
        key: item._id,
        ...item,
      };
    });

    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        fixed: 'left',
        width: 150,
        render: (ticketID) => {
          return (
            <p className={styles.ticketId} onClick={() => this.openViewTicket(ticketID)}>
              {ticketID}
            </p>
          );
        },
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        width: 150,
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'requestDate',
        width: 160,
        render: (requestDate) => {
          return <p>{moment(requestDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={styles.title}>Requestee</span>,
        dataIndex: 'employee',
        width: 200,
        ellipsis: true,
        render: (employee, row) => {
          const { generalInfo = {} } = employee;
          return (
            <Popover content={() => this.popupContent(row)} trigger="hover">
              <p
                className={styles.requteeName}
                onClick={() => history.push(`/directory/employee-profile/${generalInfo.userId}`)}
              >
                {Object.keys(employee).length === 0 ? '' : generalInfo.firstName}
              </p>
            </Popover>
          );
        },
      },
      // {
      //   title: <span className={styles.title}>Current Project</span>,
      //   dataIndex: 'project',
      //   width: 200,
      //   render: (project) => {
      //     const { manager = '' } = project[0];
      //     return <p>{Object.keys(manager).length === 0 ? '' : manager}</p>;
      //   },
      // },
      // {
      //   title: <span className={styles.title}>Project Manager</span>,
      //   dataIndex: 'project',
      //   width: 200,
      //   render: (project) => {
      //     const { manager = '' } = project[0];
      //     return <p>{Object.keys(manager).length === 0 ? '' : manager}</p>;
      //   },
      // },
      {
        title: <span className={styles.title}>Assigned To</span>,
        dataIndex: 'assigneeHR',
        width: 200,
        render: (assigneeHR) => {
          const {
            hrManager: {
              generalInfo: { firstName = '', lastName = '', middleName = '', userId = '' } = {},
            } = {},
            hrManager = {},
          } = this.props;
          if (!isEmpty(assigneeHR)) console.log(assigneeHR);
          const fullName = `${firstName} ${middleName} ${lastName}`;
          return (
            <Popover content={() => this.popupContentHr(hrManager)} trigger="hover">
              <p
                className={styles.assignee}
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              >
                {fullName}
              </p>
            </Popover>
          );
        },
      },
      {
        title: <span className={styles.title}>HR Manager </span>,
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
                className={styles.assignee}
                onClick={() => history.push(`/directory/employee-profile/${userId}`)}
              >
                {fullName}
              </p>
            </Popover>
          );
        },
      },
      {
        title: <span className={styles.title}>Department</span>,
        dataIndex: 'department',
        width: 200,
        render: (department) => {
          return <p>{department?.name}</p>;
        },
      },
      {
        title: <span className={styles.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        width: 200,
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: '_id',
        align: 'left',
        render: (_id) => {
          return (
            <>
              {isTabAll ? (
                <Dropdown
                  className={styles.menuIcon}
                  overlay={this.actionMenu(_id)}
                  placement="topLeft"
                >
                  {/* <img src={MenuIcon} alt="menu" /> */}
                  <MoreOutlined />
                </Dropdown>
              ) : null}
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: '_id',
        align: 'left',
        render: (_id, row) => {
          return (
            <div className={styles.viewAction}>
              {isTabAccept && (
                <div className={styles.viewAction__popOver}>
                  <Popover
                    content={this.renderContent(row)}
                    title={false}
                    trigger="click"
                    placement="bottomRight"
                  >
                    <span className={styles.viewAction__popOver__dots}>&#8285;</span>
                  </Popover>
                </div>
              )}
            </div>
          );
        },
      },
    ];

    return (
      <>
        <div className={styles.HRtableStyles}>
          <Table
            locale={{
              emptyText: (
                <div className={styles.viewEmpty}>
                  <img src={empty} alt="" />
                  <p className={styles.textEmpty}>{textEmpty}</p>
                </div>
              ),
            }}
            columns={columns}
            dataSource={newData}
            hideOnSinglePage
            pagination={{ ...pagination, total: data.length }}
            rowKey={(record) => record._id}
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>
        <AssignModal
          visible={assignModalVisible}
          offBoardingRequest={offBoardingRequest}
          handleAssignModal={this.handleAssignModal}
        />
      </>
    );
  }
}
export default HrTable;
