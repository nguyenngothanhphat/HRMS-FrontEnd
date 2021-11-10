import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';

import styles from './index.less';

const UserProfilePopover = (props) => {
  const { children, dispatch, placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>Jane Cooper (janecopper)</span>
          <span className={styles.position}>Software engineer II</span>
          <span className={styles.department}>Engineering Dept</span>
        </div>
      </div>
    );
  };
  const userInfo = () => {
    const items = [
      {
        label: 'Reporting Manager',
        value: <span className={styles.managerName}>Annette Black</span>,
        link: '#',
      },
      {
        label: 'Mobile',
        value: '+91 9876543211',
      },
      {
        label: 'Email id',
        value: 'bessiecooper@gmail.com',
      },
      {
        label: 'Location',
        value: 'Thanh Pho Ho Chi Minh, Viet Nam',
      },
      {
        label: 'Local Time',
        value: '-',
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
        <div className={styles.viewFullProfile}>View full profile</div>
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
