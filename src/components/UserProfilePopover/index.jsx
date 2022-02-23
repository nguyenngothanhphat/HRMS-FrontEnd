import { Col, Popover, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CloseX from '@/assets/dashboard/closeX.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

import styles from './index.less';

const UserProfilePopover = (props) => {
  const { children, placement = 'top', data = {} } = props;
  const {
    legalName = '',
    userId = '',
    department = {},
    title = {},
    workEmail = '',
    workNumber = '',
    location: { state = '', countryName = '' } = {},
    location,
    locationInfo,
    generalInfo = {},
    managerInfo = {},
    titleInfo = {},
    departmentInfo = {},
    avatar: avatar1 = '',
  } = data;

  const {
    headQuarterAddress: { state: state1 = '', country: { name: countryName1 = '' } = {} } = {},
  } = locationInfo || {};

  const { avatar = '', personalNumber = '' } = generalInfo || {};

  const [showPopover, setShowPopover] = useState(false);

  const onViewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={avatar || avatar1 || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>
            {legalName} {userId ? `(${userId})` : ''}
          </span>
          <span className={styles.position}>{department?.name || departmentInfo?.name}</span>
          <span className={styles.department}>{title?.name || titleInfo?.name}</span>
        </div>
      </div>
    );
  };
  const userInfo = () => {
    const items = [
      {
        label: 'Reporting Manager',
        value: <span className={styles.managerName}>{managerInfo?.generalInfo?.legalName}</span>,
        link: managerInfo?.generalInfo?.userId,
      },
      {
        label: 'Mobile',
        value: personalNumber || workNumber,
      },
      {
        label: 'Email id',
        value: workEmail,
      },
      {
        label: 'Location',
        value: location || locationInfo ? `${state || state1}, ${countryName || countryName1}` : '',
      },
      {
        label: 'Local Time',
        value:
          `${moment().locale('en').format('DD/MM/YYYY')} | ${moment().format('HH:mm a')}` || '',
      },
    ];

    return (
      <div className={styles.userInfo}>
        {items.map((i) => (
          <Row className={styles.eachRow}>
            <Col className={styles.eachRow__label} span={8}>
              {i.label}:
            </Col>
            <Col
              className={styles.eachRow__value}
              span={16}
              onClick={i.link ? () => onViewProfile(i.link) : null}
            >
              {i.value}
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        {renderHeader()}
        <div className={styles.divider} />
        {userInfo()}
        <div className={styles.divider} />
        <div className={styles.viewFullProfile} onClick={() => onViewProfile(userId)}>
          View full profile
        </div>
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

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  UserProfilePopover,
);
