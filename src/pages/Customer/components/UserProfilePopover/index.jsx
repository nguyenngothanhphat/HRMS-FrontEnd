import { Col, Popover, Row } from 'antd';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import CloseX from '@/assets/dashboard/closeX.svg';
import styles from './index.less';

const UserProfilePopover = (props) => {
  const {
    children,
    data: {
      generalInfo: {
        avatar = '',
        legalName = '',
        userId = '',
        workNumber = '',
        workEmail = '',
      } = {} || {},
      title: { name: titleName = '' } = {},
      department: { name: departmentName = '' } = {},
      manager: {
        generalInfo: {
          legalName: managerName = '',
          // userId = ''
        } = {} || {},
      } = {},
      location = {},
    } = {},
    placement = 'top',
  } = props;
  const [showPopover, setShowPopover] = useState(false);

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
          <span className={styles.position}>{titleName}</span>
          <span className={styles.department}>{departmentName}</span>
        </div>
      </div>
    );
  };
  const userInfo = () => {
    const items = [
      {
        label: 'Reporting Manager',
        value: <span className={styles.managerName}>{managerName || '-'}</span>,
        link: '#',
      },
      {
        label: 'Mobile',
        value: workNumber || '-',
      },
      {
        label: 'Email id',
        value: workEmail || '-',
      },
      {
        label: 'Location',
        value: location?.headQuarterAddress?.addressLine1 || '-',
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
        <div className={styles.viewFullProfile}>
          <Link to={`/employees/employee-profile/${userId}`}>View full profile</Link>
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
