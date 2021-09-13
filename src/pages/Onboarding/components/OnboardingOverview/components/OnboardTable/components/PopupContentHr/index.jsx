import React, { Component } from 'react';
import { Avatar, Col, Divider, Row, Tooltip, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';

import { getCurrentTimeOfTimezoneOption } from '@/utils/times';

import styles from './index.less';

class PopupContentHr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      listLocationsByCompany = [],
      propsState: { timezoneList, currentTime } = {},
      dataHR = {},
    } = this.props;

    const {
      generalInfo: {
        legalName = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        avatar = '',
        linkedIn = '',
      } = {},
      employeeId = '',
      title: { name: titleName = '' } = {},
      employeeType: { name: typeName } = {},
      department: { name: departmentName = '' } = {},
      location: { _id = '' } = {},
    } = dataHR;
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
  }
}

export default PopupContentHr;
