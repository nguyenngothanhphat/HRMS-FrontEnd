/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Popover, Divider, Row, Col, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getCurrentTimeOfTimezoneOffboarding } from '@/utils/times';
import styles from './index.less';

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
      history.push(`/offboarding/review/${id}`);
    }
  };

  popupContent = (dataRow) => {
    // console.log(dataRow);
    const { timezoneList } = this.props;
    const { currentTime } = this.state;
    const {
      employee: {
        title: { name: titleName = 'UX Lead' } = {},
        employeeType: { name: typeName = 'Full Time' } = {},
        employeeId = '',
        generalInfo: {
          avatar = '',
          firstName = '',
          lastName = '',
          middleName = '',
          linkedIn = '',
          userId = '',
        } = {},
      } = {},
      department: { name: departmentName = '' } = {},
      location: { _id = '' } = {},
    } = dataRow;
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};
    return (
      <div className={styles.popupContent}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar src={avatar} size={40} icon={<UserOutlined />} />
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
        <Divider />
        <div className={styles.contact}>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Mobile: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>abccc</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Email id: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>abc@gmail.com</div>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <div className={styles.contact__title}>Location: </div>
            </Col>
            <Col span={16}>
              <div className={styles.contact__value}>abccc</div>
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
        <Divider />
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
          total
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
        render: (employee, row) => {
          const { generalInfo: { firstName = '', userId = '' } = {} } = employee;
          return (
            <Popover
              content={() => this.popupContent(row)}
              // title={location.name}
              trigger="hover"
            >
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
      // {
      //   title: <span className={styles.title}>Current Project </span>,
      //   dataIndex: 'currentProject',
      //   width: 200,
      // },
      // {
      //   title: <span className={styles.title}>Project Manager </span>,
      //   dataIndex: 'projectManager',
      //   width: 200,
      // },
      {
        title: <span className={styles.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const {
            hrManager: {
              generalInfo: { firstName = '', lastName = '', middleName = '', userId = '' } = {},
            } = {},
          } = this.props;
          const fullName = `${firstName} ${middleName} ${lastName}`;
          return (
            <Popover
              content={() => this.popupContent(row)}
              // title={location.name}
              trigger="hover"
            >
              <span
                className={styles.title__value}
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
