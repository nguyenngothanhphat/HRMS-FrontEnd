import { Col, Popover, Row, Tag } from 'antd';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import CloseX from '@/assets/dashboard/closeX.svg';
import { getEmployeeUrl } from '@/utils/utils';
import { getCurrentTimeOfTimezoneOption, getTimezoneViaCity } from '@/utils/times';
import styles from './index.less';

const listColors = [
  {
    bg: '#E0F4F0',
    colorText: '#00c598',
  },
  {
    bg: '#ffefef',
    colorText: '#fd4546',
  },
  {
    bg: '#f1edff',
    colorText: '#6236ff',
  },
  {
    bg: '#f1f8ff',
    colorText: '#006bec',
  },
  {
    bg: '#fff7fa',
    colorText: '#ff6ca1',
  },
];

const UserProfilePopover = (props) => {
  const { children, placement = 'top', data = {} } = props;
  const {
    legalName = '',
    userId = '',
    department = {},
    title = {},
    workEmail = '',
    workNumber = '',
    location = {},
    locationInfo,
    generalInfo = {},
    manager = {},
    managerInfo = {},
    titleInfo = {},
    departmentInfo = {},
    avatar: avatar1 = '',
    skills = [],
  } = data;

  const { state = '', countryName = '' } = location || {};
  const {
    headQuarterAddress: {
      state: state1 = '',
      country = {},
      country: { name: countryName1 = '' } = {},
    } = {},
  } = locationInfo || {};

  const { avatar = '' } = generalInfo || {};

  const [showPopover, setShowPopover] = useState(false);

  const onViewProfile = (id) => {
    const url = getEmployeeUrl(id);
    window.open(url, '_blank');
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img
            src={avatar || avatar1 || DefaultAvatar}
            alt=""
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>
            {legalName || generalInfo?.legalName}{' '}
            {userId || generalInfo?.userId ? `(${userId || generalInfo?.userId})` : ''}
          </span>
          <span className={styles.position}>{department?.name || departmentInfo?.name}</span>
          <span className={styles.department}>{title?.name || titleInfo?.name}</span>
        </div>
      </div>
    );
  };

  const getLocation = () => {
    const getCountry = () => {
      let result = '';
      if (typeof country === 'string') result = country;
      result = countryName || countryName1 || '';
      return result;
    };
    const arr = [];
    if (location || locationInfo) {
      arr.push(state || state1 || '');
    }
    arr.push(getCountry());
    return arr.filter(Boolean).join(', ');
  };

  const formatListSkill = (skillsProps, colors) => {
    let temp = 0;
    const listFormat = skillsProps.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });
    return [...listFormat];
  };

  const userInfo = () => {
    const getTimezone =
      getTimezoneViaCity(state || state1) ||
      getTimezoneViaCity(
        countryName || countryName1 || typeof country === 'string' ? country : '',
      ) ||
      '';
    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = getCurrentTimeOfTimezoneOption(new Date(), timezone);

    const skillList =
      skills !== null && skills !== undefined ? formatListSkill(skills, listColors) || [] : [];

    let items = [
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
        value: generalInfo?.workNumber || workNumber,
      },
      {
        label: 'Email id',
        value: generalInfo?.workEmail || workEmail,
      },
      {
        label: 'Location',
        value: getLocation(),
      },
      {
        label: 'Local Time',
        value: time,
      },
    ];
    const listSkills = {
      label: !isEmpty(skillList) ? 'Skill' : '',
      value: !isEmpty(skillList)
        ? skillList.map((item) => (
          <Tag
            style={{
                color: `${item?.color?.colorText}`,
                fontWeight: 500,
              }}
            key={item?.id}
            color={item?.color?.bg}
          >
            {item?.name}
          </Tag>
          ))
        : '',
    };

    if (!isEmpty(skills)) {
      items = [...items, listSkills];
    }

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
        <div className={styles.viewFullProfile}>
          <Link to={`/directory/employee-profile/${userId || generalInfo?.userId}`}>
            View full profile
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={showPopover ? renderPopup() : null}
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
