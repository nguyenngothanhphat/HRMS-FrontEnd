import { Col, Popover, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
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
    generalInfo = {},
    managerInfo = {},
  } = data;

  const { avatar = '' } = generalInfo || {};

  const [showPopover, setShowPopover] = useState(false);

  const onViewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>
            {legalName} ({userId})
          </span>
          <span className={styles.position}>{department?.name}</span>
          <span className={styles.department}>{title?.name}</span>
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
        value: workNumber,
      },
      {
        label: 'Email id',
        value: workEmail,
      },
      {
        label: 'Location',
        value: location ? `${state}, ${countryName}` : '',
      },
      {
        label: 'Local Time',
        value: '',
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
