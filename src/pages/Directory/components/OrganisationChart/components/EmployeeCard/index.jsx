import React, { Component } from 'react';
import { Avatar, Row, Col, Typography, Select, Spin } from 'antd';
import {
  LinkedinOutlined,
  MailOutlined,
  MessageFilled,
  UpCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { isEmpty } from 'lodash';

import SearchIcon from '@/assets/searchOrgChart.svg';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

const { Text } = Typography;
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

  handleViewFullProfile = (id) => {
    history.push(`directory/employee-profile/${id}`);
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
      } = {},
      department: { name = '' } = {},
      employeeType: { name: emplTypeName = 'Full Time' } = {} || {},
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
        <div className={styles.chartSearch}>
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
              suffixIcon={<img alt="search" src={SearchIcon} />}
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
          {checkObj ? (
            <UpCircleOutlined className={styles.iconUp} onClick={this.handleClick} />
          ) : null}
        </div>
        {checkObj ? (
          <div className={styles.chartDetail}>
            <div className={styles.chartDetail__Top}>
              <div className={styles.chartDetail__Top_Avt}>
                <Avatar src={avatar || ''} size={64} icon={<UserOutlined />} />
              </div>
              <div className={styles.chartDetail__Top_name}>
                <p className={styles.chartDetail__Top_firstName}>{firstName || ''}</p>
                <div className={styles.chartDetail__Top_department}>{name || ''}</div>
                <div className={styles.chartDetail__Top_psi}>
                  {`${employeeId} | ${emplTypeName}`}
                  {/* {employeeId} */}
                </div>
              </div>
            </div>
            <div className={styles.chartDetail__Bottom}>
              <Row gutter={[24, 24]} style={{ padding: '24px 20px 0 0' }}>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Mobile:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>{workNumber || ''}</div>
                </Col>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Email id:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>{workEmail || ''}</div>
                </Col>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Location:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>{locationName || ''}</div>
                </Col>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Local Time:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>{localTime || ''}</div>
                </Col>
              </Row>
            </div>
            <div className={styles.chartDetail__Bottom_line} />
            <div className={styles.chartDetail__Bottom_flexBottom}>
              <Text
                className={styles.chartDetail__Bottom_ViewProfile}
                underline
                onClick={() => this.handleViewFullProfile(userId)}
              >
                View full profile
              </Text>
              <div>
                <MessageFilled className={styles.chartDetail__Bottom_Icon} />
                <MailOutlined className={styles.chartDetail__Bottom_Icon} />
                <LinkedinOutlined className={styles.chartDetail__Bottom_Icon} />
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
