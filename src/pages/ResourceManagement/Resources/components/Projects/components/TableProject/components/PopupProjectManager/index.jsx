import React from 'react';
import { Avatar, Col, Divider, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';

import { getCurrentTimeOfTimezoneOption } from '@/utils/times';

import styles from './index.less';

const PopupProjectManager = (props) => {
  const {
    listLocationsByCompany = [],
    propsState: { timezoneList, currentTime } = {},
    dataProjectManager = {},
  } = props;

  const {
    generalInfo: { legalName = '', userId = '', workEmail = '', workNumber = '', avatar = '' } = {},
    title: { name: titleName = '' } = {},
    department: { name: departmentName = '' } = {},
    location: { _id = '' } = {},
    manager: {
      generalInfo: {
        userId: userIdManager = '',
        legalName: legalNameManager = '',
        firstName = '',
        lastName = '',
        middleName = '',
      } = {},
    } = {},
  } = dataProjectManager;

  const findTimezone = timezoneList.find((timezone) => timezone.locationId === _id) || {};
  let filterLocation = listLocationsByCompany.map((item) => (item._id === _id ? item : null));
  filterLocation = filterLocation.filter((item) => item !== null);

  if (filterLocation.length === 0) {
    return null;
  }

  const { headQuarterAddress: { state = '', country: { name: countryName = '' } = {} } = {} } =
    filterLocation[0];
  const locationName = `${state}, ${countryName}`;
  const managerName = legalNameManager || `${firstName} ${middleName} ${lastName}`;

  return (
    <div className={styles.popupContent}>
      <div className={styles.generalInfo}>
        <div className={styles.avatar}>
          <Avatar src={avatar} size={55} icon={<UserOutlined />} />
        </div>
        <div className={styles.employeeInfo}>
          <div className={styles.employeeInfo__name}>{legalName}</div>
          <div className={styles.employeeInfo__department}>{titleName}</div>
          <div className={styles.employeeInfo__emplId}>{departmentName} Dept.</div>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.contact}>
        <Row gutter={[24, 24]}>
          <Col span={9}>
            <div className={styles.contact__title}>Reporting Manager: </div>
          </Col>
          <Col span={15}>
            <div
              onClick={() => history.push(`/directory/employee-profile/${userIdManager}`)}
              className={styles.contact__valueManager}
            >
              {managerName}
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Mobile: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__value}>{workNumber || '-'}</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Email id: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              {workEmail}
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Location: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              {locationName || ''}
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Local Time: </div>
          </Col>
          <Col span={15}>
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
      </div>
    </div>
  );
};

export default PopupProjectManager;
