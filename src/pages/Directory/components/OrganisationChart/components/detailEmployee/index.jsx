import React, { Component } from 'react';
import { Avatar, Row, Col, Typography, Select } from 'antd';
import { LinkedinOutlined, MailOutlined, MessageFilled, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const { Text } = Typography;
const { Option } = Select;
// eslint-disable-next-line react/prefer-stateless-function
class DetailEmployeeChart extends Component {
  handleViewFullProfile = (id) => {
    history.push(`directory/employee-profile/${id}`);
  };

  render() {
    const { chartDetails = {}, listEmployeeAll } = this.props;
    const checkObj = chartDetails.user !== undefined;
    const { user = {} } = chartDetails;
    const {
      _id = '',
      generalInfo: { firstName = '', avatar = '', workEmail = '', employeeId = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
    } = user;
    return (
      <>
        <div className={styles.chartSearch}>
          <p className={styles.chartSearch__name}>Terralogic Software Solution Pvt. Ltd.</p>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Search for employee, department"
            filterOption={(input, option) => {
              return (
                option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          >
            {listEmployeeAll.map((value) => {
              const {
                generalInfo: {
                  avatar: avatarSearch = '',
                  firstName: nameSearch = '',
                  employeeId: employeeIdSearch = '',
                } = {},
              } = value;

              return (
                <Option key={_id} value={_id}>
                  <div style={{ display: 'inline', marginRight: '10px' }}>
                    <Avatar
                      src={avatarSearch || ''}
                      size={30}
                      icon={<UserOutlined />}
                      style={{
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
                    {nameSearch}({employeeIdSearch})
                  </span>
                </Option>
              );
            })}
          </Select>
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
                <div className={styles.chartDetail__Top_psi}>{employeeId || ''}</div>
              </div>
            </div>
            <div className={styles.chartDetail__Bottom}>
              <Row gutter={[24, 24]} style={{ padding: '24px 20px 0 0' }}>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Mobile:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>Number</div>
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
                  <div className={styles.chartDetail__Bottom_value}>{nameLocation || ''}</div>
                </Col>
                <Col span={9}>
                  <div className={styles.chartDetail__Bottom_label}>Local Time:</div>
                </Col>
                <Col span={15}>
                  <div className={styles.chartDetail__Bottom_value}>time</div>
                </Col>
              </Row>
            </div>
            <div className={styles.chartDetail__Bottom_line} />
            <div className={styles.chartDetail__Bottom_flexBottom}>
              <Text
                className={styles.chartDetail__Bottom_ViewProfile}
                underline
                onClick={() => this.handleViewFullProfile(_id)}
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
