import { Col, Popover, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { getCurrentTimeOfTimezoneOption, getTimezoneViaCity } from '@/utils/times';
import styles from './index.less';

const AddressPopover = (props) => {
  const { children, placement = 'top', location = {} } = props;
  const {
    headQuarterAddress: {
      addressLine1 = '',
      addressLine2 = '',
      state = '',
      city = '',
      country = {},
      zipCode = '',
    } = {},
    name = '',
  } = location || {};

  const [showPopover, setShowPopover] = useState(false);

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span>{name || state}</span>
      </div>
    );
  };

  const userInfo = () => {
    const getTimezone = getTimezoneViaCity(state) || getTimezoneViaCity(city) || '';

    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = getCurrentTimeOfTimezoneOption(new Date(), timezone);

    const address = [addressLine1, addressLine2, state, country?.name || null, zipCode]
      .filter(Boolean)
      .join(', ');

    const items = [
      {
        label: 'Address',
        value: address,
      },
      {
        label: 'Local Time',
        value: time,
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
        {renderHeader()}
        <div className={styles.divider} />
        {userInfo()}
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
        overlayClassName={styles.AddressPopover}
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
  AddressPopover,
);
