import { Col, Popover, Row, Tag } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

import styles from './index.less';
import { getCurrentTimeOfTimezoneOption, getTimezoneViaCity } from '@/utils/times';

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
    manager = {},
    managerInfo = {},
    titleInfo = {},
    departmentInfo = {},
    avatar: avatar1 = '',
    // skills = [],
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

  // const formatListSkill = (skill, colors) => {
  //   let temp = 0;
  //   const listFormat = skill.map((item) => {
  //     if (temp >= 5) {
  //       temp -= 5;
  //     }
  //     temp += 1;
  //     return {
  //       color: colors[temp - 1],
  //       name: item.name,
  //       id: item._id || item.id,
  //     };
  //   });
  //   return [...listFormat];
  // };

  // const listColors = [
  //   {
  //     bg: '#E0F4F0',
  //     colorText: '#00c598',
  //   },
  //   {
  //     bg: '#ffefef',
  //     colorText: '#fd4546',
  //   },
  //   {
  //     bg: '#f1edff',
  //     colorText: '#6236ff',
  //   },
  //   {
  //     bg: '#f1f8ff',
  //     colorText: '#006bec',
  //   },
  //   {
  //     bg: '#fff7fa',
  //     colorText: '#ff6ca1',
  //   },
  // ];

  // const formatedListSkill = formatListSkill(skills, listColors) || [];

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
    const getTimezone =
      getTimezoneViaCity(state || state1) || getTimezoneViaCity(countryName || countryName1) || '';
    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = getCurrentTimeOfTimezoneOption(new Date(), timezone);

    const items = [
      {
        label: 'Reporting Manager',
        value: (
          <span className={styles.managerName}>
            {managerInfo?.generalInfo?.legalName || manager?.legalName}
          </span>
        ),
        link: managerInfo?.generalInfo?.userId || manager?.userId,
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
        value: time,
      },
      // {
      //   label: 'Skills',
      //   value: formatedListSkill.map((item) => (
      //     <Tag
      //       style={{
      //         color: `${item.color.colorText}`,
      //         fontWeight: 500,
      //       }}
      //       key={item.id}
      //       color={item.color.bg}
      //     >
      //       {item.name}
      //     </Tag>
      //   )),
      // },
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
