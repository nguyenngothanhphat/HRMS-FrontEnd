import React, { Component } from 'react';
import { Avatar, Row, Col, Select, Spin, Divider, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { isEmpty } from 'lodash';

import SearchIcon from '@/assets/searchOrgChart.svg';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;
class DetailEmployeeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueInput: undefined,
    };
    this.inputRef = React.createRef();
  }

  componentDidUpdate = (prevProp) => {
    const { chartDetails = {} } = this.props;
    const { _id = undefined } = chartDetails;
    if (JSON.stringify(prevProp.chartDetails) !== JSON.stringify(chartDetails)) {
      this.updateValueSelect(_id);
    }
  };

  updateValueSelect = (valueInput) => {
    this.setState({ valueInput });
  };

  handleSelect = (value) => {
    const { handleSelectSearch } = this.props;
    handleSelectSearch(value);
    this.inputRef.current.blur();
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

  render() {
    const { chartDetails = {}, listEmployeeAll, loadingFetchListAll } = this.props;
    const { valueInput } = this.state;
    const checkObj = !isEmpty(chartDetails);

    const {
      generalInfo: {
        firstName = '',
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
      location: {
        headQuarterAddress: { country: { name: countryName = '' } = {} || {}, state = '' } = {} ||
          {},
      } = {},
      localTime = '',
    } = chartDetails;

    const locationName = `${state}, ${countryName}`;

    const getCurrentCompanyName = this.getCurrentFirm();
    return (
      <>
        <div className={styles.chartSearch} onClick={checkObj ? this.handleClick : null}>
          <div className={styles.chartSearch__name}>{getCurrentCompanyName}</div>
          {loadingFetchListAll ? (
            <div className={styles.viewLoading}>
              <Spin size="large" />
            </div>
          ) : (
            <Select
              ref={this.inputRef}
              showSearch
              placeholder="Search for employee, department"
              filterOption={(input, option) => {
                return (
                  option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              onSelect={this.handleSelect}
              suffixIcon={valueInput ? null : <img alt="search" src={SearchIcon} />}
              value={valueInput}
            >
              {listEmployeeAll.map((value) => {
                const {
                  _id: idSearch = '',
                  generalInfo: {
                    avatar: avatarSearch = '',
                    firstName: nameSearch = '',
                    employeeId: employeeIdSearch = '',
                    userId: userIdSearch = '',
                  } = {},
                } = value;
                const emplName = `${nameSearch} (${employeeIdSearch}) (${userIdSearch})`;
                return (
                  <Option key={idSearch} value={idSearch}>
                    <div style={{ display: 'inline', marginRight: '10px' }}>
                      <Avatar
                        src={avatarSearch || ''}
                        size={30}
                        icon={<UserOutlined />}
                        style={{
                          fontSize: 'initial',
                          width: '25px',
                          height: '25px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
                      {emplName}
                    </span>
                  </Option>
                );
              })}
            </Select>
          )}
        </div>
        {checkObj ? (
          <div className={styles.chartDetail}>
            <div className={styles.chartDetail__Top}>
              <Avatar src={avatar || ''} size={55} icon={<UserOutlined />} />
              <div className={styles.chartDetail__Top_name}>
                <p className={styles.chartDetail__Top_firstName}>{firstName || ''}</p>
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
                  <div className={styles.chartDetail__Bottom_value}>{locationName || ''}</div>
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
                  <a href="https://chat.google.com" target="_blank" rel="noreferrer">
                    <img
                      src="/assets/images/messageIcon.svg"
                      alt="img-arrow"
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </Tooltip>
                <Tooltip title="Email">
                  <a href={`mailto:${workEmail}`}>
                    <img
                      src="/assets/images/iconMail.svg"
                      alt="img-mail"
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </Tooltip>
                <Tooltip title="LinkedIn">
                  <a href={linkedIn} target="_blank" rel="noopener noreferrer">
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
        ) : (
          ''
        )}
      </>
    );
  }
}

export default DetailEmployeeChart;
