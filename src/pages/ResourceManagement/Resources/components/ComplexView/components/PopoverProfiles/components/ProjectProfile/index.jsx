import { Col, Popover, Row, Progress } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';

import styles from './index.less';
import CapitalNameIcon from '../../../CapitalNameIcon';

const ProjectProfile = (props) => {
  const { children, placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <CapitalNameIcon text="TTTT" />
        {/* <div className={styles.avatar}>
          <img src={MockAvatar} alt="" />
        </div> */}
        <div className={styles.information}>
          <span className={styles.name}>Jane Cooper (janecopper)</span>
          <span className={styles.position}>Software engineer II</span>
          {/* <span className={styles.department}>Engineering Dept</span> */}
        </div>
      </div>
    );
  };
  const userInfo = () => {
    const company = props.company || {name: 'Project ABCDEF', statusProgress: 40}
    const items = [
      {
        label: 'Customer',
        value: 'ABC Company 1',
        // link: '#',
      },
      {
        label: 'Account Owner',
        value: <span className={styles.managerName}>Brandon Mango</span>,
        link: '#',
      },
      {
        label: 'Engineering Owner',
        value: <span className={styles.managerName}>Omar Donin</span>,
        link: '#',
      },
      {
        label: 'Project ID',
        value: 'ID 1234',
      },
      {
        label: 'Status',
        value: <div><Progress percent={company.statusProgress} showInfo={false} /><div className={styles.rightPosition}><span>{company.statusProgress}%</span></div></div>,
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
        <div className={styles.viewFullProfile}>View more details</div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="click"
        visible={showPopover}
        overlayClassName={styles.ProjectProfile}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} }}) => ({ employee }))(
  ProjectProfile,
);
