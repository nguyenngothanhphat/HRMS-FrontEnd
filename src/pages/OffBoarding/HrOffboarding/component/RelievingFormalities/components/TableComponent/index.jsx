import React, { PureComponent } from 'react';
import { Avatar, Col, Divider, Popover, Row, Table, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link, history } from 'umi';
import { getCurrentTimeOfTimezoneOffboarding } from '@/utils/times';

import styles from './index.less';

class TableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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

  popupContent = (dataRow) => {
    const { timezoneList } = this.props;
    const { currentTime } = this.state;
    const {
      employee: {
        title: { name: titleName = 'UX Lead' } = {},
        employeeType: { name: typeName = 'Full Time' } = {},
        generalInfo: {
          employeeId = '',
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

  renderAction = (id) => {
    return (
      <div className={styles.rowAction}>
        <Link className={styles.rowAction__link} to={`/offboarding/relieving-detail/${id}`}>
          Start Relieving Formalities
        </Link>
      </div>
    );
  };

  _renderEmployeeId = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return newItem[0].employee.generalInfo.employeeId;
  };

  _renderEmployeeName = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return (
      <Popover
        content={() => this.popupContent(newItem[0])}
        // title={location.name}
        trigger="hover"
      >
        <span
          onClick={() =>
            history.push(`/directory/employee-profile/${newItem[0].employee.generalInfo.userId}`)
          }
          className={styles.requteeName}
        >
          {newItem[0].employee.generalInfo.legalName}
        </span>
      </Popover>
    );
  };

  _renderDepartment = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return newItem[0].department.name;
  };

  _renderLastWorkingDate = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    const formatDate = moment(newItem[0].lastWorkingDate).format('DD.MM.YYYY');
    return formatDate;
  };

  render() {
    const { data = [], isClosedTable = false, loadingSearchList } = this.props;
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
      // pageSize: rowSize,
      // current: pageSelected,
      // onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        fixed: 'left',
        width: 150,
        render: (ticketID) => <span className={styles.ticketId}>{ticketID}</span>,
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: '_id',
        render: (_id) => this._renderEmployeeId(_id),
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: '_id',
        render: (_id) => this._renderEmployeeName(_id),
        width: 180,
      },
      {
        title: <span className={styles.title}>Department </span>,
        dataIndex: '_id',
        render: (_id) => this._renderDepartment(_id),
        width: 150,
      },
      {
        title: <span className={styles.title}>Approved LWD</span>,
        dataIndex: '_id',
        render: (_id) => this._renderLastWorkingDate(_id),
        width: 150,
      },
      {
        title: !isClosedTable ? <span className={styles.title}>Action </span> : null,
        dataIndex: '_id',
        align: 'left',
        render: (_id) => (!isClosedTable ? this.renderAction(_id) : null),
        width: 250,
      },
    ];

    return (
      <div className={styles.tableComponent}>
        <Table
          loading={loadingSearchList}
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableComponent;
