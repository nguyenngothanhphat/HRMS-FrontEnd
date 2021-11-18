import { Button, Col, Popover, Row } from 'antd';
// import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';

import {getTimezoneViaCity, getCurrentTimeOfTimezoneOption} from '@/utils/times'

import styles from './index.less';

const moment = require('moment-timezone')

const UserProfile = (props) => {
  const { children, placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);

  const renderHeader = (employee) => {
    if(!employee) {
      return null
    }
    const {titleInfo,  generalInfo, departmentInfo} = employee
    const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'))
      const employeeName = `${ generalInfo.legalName } ${ userName ? (`(${  userName  })`) : ''}`;
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{employeeName}</span>
          <span className={styles.position}>{titleInfo ? titleInfo.name : '-'}</span>
          <span className={styles.department}>{departmentInfo ? (`${departmentInfo.name} Dept`) : '-' }</span>
        </div>
      </div>
    );
  };
  const userInfo = (employee) => {
    const {generalInfo, managerInfo, locationInfo = {}} = employee
    const {headQuarterAddress} = locationInfo
    const {country, state} = headQuarterAddress
    const timezone = getTimezoneViaCity(state)
    const time = getCurrentTimeOfTimezoneOption(new Date(),timezone)
    const items = [
      {
        label: 'Reporting Manager',
        value: <span className={styles.managerName}>{managerInfo ? managerInfo.generalInfo.legalName : '-'}</span>,
        link: '#',
      },
      {
        label: 'Mobile',
        value: `${generalInfo.workNumber || '-'}`,
      },
      {
        label: 'Email id',
        value: `${generalInfo.workEmail}`
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
          <Row className={styles.eachRow}>
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
    const {resourceList, employeeId} = props;
    const employee = resourceList.find(x => x._id === employeeId)
    const {generalInfo} = employee
    const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'));
    const profileUrl = `/directory/employee-profile/${userName}/general-info` 
    return (
      <div className={styles.popupContainer}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        {renderHeader(employee)}
        <div className={styles.divider} />
        {userInfo(employee)}
        <div className={styles.divider} />
        <div className={styles.viewFullProfile}><a href={profileUrl}>View full profile</a></div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="hover"
        visible={showPopover}
        overlayClassName={styles.UserProfilePopover}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default connect(({ resourceManagement: { resourceList = [] }}) => ({ resourceList }))(
  UserProfile,
);
