import { Avatar, Button, Col, Divider, Form, Popover, Row, Select, Spin, Tooltip } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import { getCurrentCompany } from '@/utils/authority';
import SearchIcon from '@/assets/searchOrgChart.svg';
import avtDefault from '@/assets/avtDefault.jpg';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    employee: { listEmployeeAll = [] } = {},
    user: { companiesOfUser = [] } = {},
    location: { companyLocationList = [] } = {},
    loading,
  }) => ({
    listEmployeeAll,
    companiesOfUser,
    companyLocationList,
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
  }),
)
class DetailEmployeeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueInput: undefined,
      valueSearch: '',
      timezoneList: [],
      currentTime: moment(),
    };

    this.setDebounce = debounce((valueSearch) => {
      this.setState({
        valueSearch,
      });
    }, 1000);

    this.inputRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount = () => {
    this.fetchTimezone();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { companyLocationList = [] } = this.props;
    const { chartDetails = {}, fetchAllListUser = () => {} } = this.props;
    const { valueSearch } = this.state;
    const { _id = undefined } = chartDetails;
    // if (JSON.stringify(prevProp.chartDetails) !== JSON.stringify(chartDetails)) {
    //   this.updateValueSelect(_id);
    // }

    if (prevState.valueSearch !== valueSearch) {
      fetchAllListUser(valueSearch);
    }
    if (JSON.stringify(prevProps.companyLocationList) !== JSON.stringify(companyLocationList)) {
      this.fetchTimezone();
    }
  };

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

  updateValueSelect = (valueInput) => {
    this.setState({ valueInput });
  };

  handleSelect = (value) => {
    const { handleSelectSearch, closeDetailEmployee = () => {} } = this.props;
    // this.setState({ valueInput: value });
    this.inputRef.current.blur();
    this.formRef.current.resetFields(['search']);
    handleSelectSearch(value);
    // closeDetailEmployee();
  };

  onSearch = (value) => {
    if (value) {
      const formatValue = value.toLowerCase();
      this.setDebounce(formatValue);
    }
  };

  handleClick = () => {
    const { closeDetailEmployee = () => {} } = this.props;
    closeDetailEmployee();
  };

  getCurrentFirm = () => {
    const { companiesOfUser = [] } = this.props;
    const idFirm = getCurrentCompany();
    const currentFirm = companiesOfUser.filter((item) => item._id === idFirm);
    return currentFirm[0]?.name;
  };

  popupImage = (ava) => {
    return (
      <div className={styles.avatarPopup}>
        <img src={ava || avtDefault} alt="avatar" />
      </div>
    );
  };

  locationContent = (location) => {
    const {
      headQuarterAddress: {
        addressLine1 = '',
        addressLine2 = '',
        state = '',
        country = {},
        zipCode = '',
      } = {},
      _id = '',
    } = location;

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
    const { chartDetails = {}, listEmployeeAll, loadingFetchListAll } = this.props;
    const { valueInput } = this.state;
    const checkObj = !isEmpty(chartDetails);

    const {
      generalInfo: {
        firstName = '',
        middleName = '',
        lastName = '',
        avatar = '',
        workEmail = '',
        employeeId = '',
        workNumber = '',
        userId = '',
        linkedIn = '',
      } = {},
      department: { name: deptName = '' } = {},
      title: { name: titleName = '' } = {},
      employeeType: { name: emplTypeName = '' } = {} || {},
      location: { name: countryName = '' } = {},
      localTime = '',
      location = {},
    } = chartDetails;
    const fullName = `${firstName} ${middleName} ${lastName}`;
    const locationName = ` ${countryName}`;

    const getCurrentCompanyName = this.getCurrentFirm();

    return (
      <>
        <div className={styles.chartSearch}>
          <div className={styles.chartSearch__name} onClick={checkObj ? this.handleClick : null}>
            {getCurrentCompanyName}
          </div>
          <Form ref={this.formRef}>
            <Form.Item name="search">
              <Select
                ref={this.inputRef}
                showSearch
                placeholder="Search by Employee Name or ID"
                filterOption={false}
                notFoundContent={null}
                defaultActiveFirstOption={false}
                suffixIcon={valueInput ? null : <img alt="search" src={SearchIcon} />}
                onSelect={this.handleSelect}
                onSearch={this.onSearch}
                onChange={() => this.setState({ valueInput: undefined })}
              >
                {loadingFetchListAll ? (
                  <Option className={styles.viewLoading}>
                    <Spin
                      size="large"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                      }}
                    />
                  </Option>
                ) : (
                  <>
                    {listEmployeeAll.map((value) => {
                      const {
                        _id: idSearch = '',
                        generalInfo: {
                          avatar: avatarSearch = '',
                          firstName: firstNameSearch = '',
                          middleName: middleNameSearch = '',
                          lastName: lastNameSearch = '',
                          employeeId: employeeIdSearch = '',
                          userId: userIdSearch = '',
                        } = {},
                      } = value;
                      const fullNameSearch = `${firstNameSearch} ${middleNameSearch} ${lastNameSearch}`;

                      const emplName = `${fullNameSearch} (${employeeIdSearch}) (${userIdSearch})`;
                      return (
                        <Option key={idSearch} value={idSearch}>
                          <div style={{ display: 'inline', marginRight: '10px' }}>
                            <Avatar
                              src={avatarSearch || avtDefault}
                              size={30}
                              style={{
                                fontSize: 'initial',
                                width: '25px',
                                height: '25px',
                              }}
                            />
                          </div>
                          <span
                            style={{ fontSize: '13px', color: '#161C29' }}
                            className={styles.ccEmail}
                          >
                            {emplName}
                          </span>
                        </Option>
                      );
                    })}
                  </>
                )}
              </Select>
            </Form.Item>
          </Form>
        </div>
        {checkObj ? (
          <div className={styles.chartDetail}>
            <div className={styles.chartDetail__Top}>
              <Popover
                placement="rightTop"
                content={() => this.popupImage(avatar || avtDefault)}
                trigger="hover"
              >
                <Avatar
                  style={{ cursor: 'pointer' }}
                  src={avatar || avtDefault}
                  size={55}
                  // icon={<UserOutlined />}
                />
              </Popover>
              <div className={styles.chartDetail__Top_name}>
                <p className={styles.chartDetail__Top_firstName}>{fullName || ''}</p>
                <div className={styles.chartDetail__Top_department}>
                  {`${titleName}, ${deptName} Dept.`}
                </div>
                <div className={styles.chartDetail__Top_psi}>
                  {`${employeeId} | ${emplTypeName}`}
                  {/* {employeeId} */}
                </div>
              </div>
            </div>
            <Divider />
            <div className={styles.chartDetail__Bottom}>
              <Row gutter={[0, 24]}>
                <Col span={7}>
                  <div className={styles.chartDetail__Bottom_label}>Mobile:</div>
                </Col>
                <Col span={17}>
                  <div className={styles.chartDetail__Bottom_value}>{workNumber || ''}</div>
                </Col>
                <Col span={7}>
                  <div className={styles.chartDetail__Bottom_label}>Email id:</div>
                </Col>
                <Col span={17}>
                  <div className={styles.chartDetail__Bottom_value}>{workEmail || ''}</div>
                </Col>
                <Col span={7}>
                  <div className={styles.chartDetail__Bottom_label}>Location:</div>
                </Col>
                <Col span={17}>
                  <div className={styles.chartDetail__Bottom_value}>
                    <Popover
                      content={() => this.locationContent(location)}
                      title={locationName}
                      trigger="hover"
                      placement="right"
                    >
                      <span
                        style={{
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={this.setCurrentTime}
                      >
                        {locationName || ''}
                      </span>
                    </Popover>
                  </div>
                </Col>
                <Col span={7}>
                  <div className={styles.chartDetail__Bottom_label}>Local Time:</div>
                </Col>
                <Col span={17}>
                  <div className={styles.chartDetail__Bottom_value}>{localTime || ''}</div>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.chartDetail__Bottom_flexBottom}>
              <Link
                className={styles.chartDetail__Bottom_ViewProfile}
                to={`employee-profile/${userId}`}
              >
                View full profile
              </Link>
              <div className={styles.chartDetail__Bottom_actions}>
                <Tooltip title="Message">
                  <Button style={{ width: '40px', background: 'white', border: '1px solid white' }}>
                    <a href="https://chat.google.com" target="_blank" rel="noreferrer">
                      <img
                        src="/assets/images/messageIcon.svg"
                        alt="img-arrow"
                        style={{ cursor: 'pointer' }}
                      />
                    </a>
                  </Button>
                </Tooltip>
                <Tooltip title="Email">
                  <Button style={{ width: '40px', background: 'white', border: '1px solid white' }}>
                    <a href={`mailto:${workEmail}`}>
                      <img
                        src="/assets/images/iconMail.svg"
                        alt="img-mail"
                        style={{ cursor: 'pointer' }}
                      />
                    </a>
                  </Button>
                </Tooltip>
                <Tooltip
                  title={
                    linkedIn
                      ? 'LinkedIn'
                      : 'Please update the Linkedin Profile in the Employee profile page'
                  }
                  // color={linkedIn ? '' : 'gold'}
                >
                  <Button
                    disabled={linkedIn ? '' : 'true'}
                    style={{ width: '40px', background: 'white', border: '1px solid white' }}
                  >
                    <a
                      href={linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      // style={linkedIn ? {} : {pointerEvents: 'none', opacity: '0.6'}}
                    >
                      <img
                        src="/assets/images/iconLinkedin.svg"
                        alt="img-arrow"
                        style={linkedIn ? { cursor: 'pointer' } : { cursor: 'default' }}
                      />
                    </a>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}

export default DetailEmployeeChart;
