import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { getTimezoneViaCity, getCurrentTimeOfTimezoneOption } from '@/utils/times';
import styles from './index.less';

const UserProfile = (props) => {
  const renderHeader = (employee) => {
    if (!employee) {
      return null;
    }
    const {
      titleInfo = {},
      generalInfo: { workEmail = '', avatar = '' } = {},
      generalInfo = {},
      departmentInfo = {},
    } = employee;

    const userName = workEmail.substring(0, workEmail.indexOf('@'));
    const employeeName = `${generalInfo.legalName} ${userName ? `(${userName})` : ''}`;
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" onError={`this.src=${MockAvatar}`} />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{employeeName}</span>
          <span className={styles.position}>{titleInfo ? titleInfo.name : '-'}</span>
          <span className={styles.department}>
            {departmentInfo ? `${departmentInfo.name} Dept` : '-'}
          </span>
        </div>
      </div>
    );
  };

  const userInfo = (employee) => {
    const { generalInfo = { workEmail: '' }, managerInfo = {}, locationInfo = {} } = employee || {};
    const { headQuarterAddress = {} } = locationInfo || {};
    const { country = {}, state = '' } = headQuarterAddress || {};
    const getTimezone = getTimezoneViaCity(state) || '';
    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = getCurrentTimeOfTimezoneOption(new Date(), timezone);
    const items = [
      {
        label: 'Reporting Manager',
        value: (
          <span className={styles.managerName}>
            {managerInfo && managerInfo.generalInfo ? managerInfo.generalInfo.legalName : '-'}
          </span>
        ),
        link: '#',
      },
      {
        label: 'Mobile',
        value: `${generalInfo.workNumber || '-'}`,
      },
      {
        label: 'Email id',
        value: `${generalInfo.workEmail}`,
      },
      {
        label: 'Location',
        value: `${state}, ${country.name}`,
      },
      {
        label: 'Local Time',
        value: `${time}`,
      },
    ];

    return (
      <div className={styles.userInfo}>
        {items.map((i) => (
          <Row className={styles.eachRow} key={i.label}>
            <Col className={styles.eachRow__label} span={8}>
              {i.label}:
            </Col>
            <Col className={styles.eachRow__value} span={16}>
              {i.value}
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  const renderPopup = () => {
    const { resourceList, employeeId } = props;
    const employee = resourceList.find((x) => x._id === employeeId);
    const { generalInfo = { workEmail: '' } } = employee || {};
    const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'));
    const profileUrl = `/directory/employee-profile/${userName}/general-info`;
    return (
      <div className={styles.popupContainer}>
        {/* <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        /> */}
        {renderHeader(employee)}
        <div className={styles.divider} />
        {userInfo(employee)}
        <div className={styles.divider} />
        <div className={styles.viewFullProfile}>
          <a href={profileUrl}>View full profile</a>
        </div>
      </div>
    );
  };

  return <>{renderPopup()}</>;
};

export default connect(({ resourceManagement: { resourceList = [] } }) => ({ resourceList }))(
  UserProfile,
);
