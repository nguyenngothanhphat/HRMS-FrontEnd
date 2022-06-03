import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import moment from 'moment';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';
import { getTimezoneViaCity } from '@/utils/times';

const EmployeeTag = (props) => {
  const {
    employee: {
      generalInfoInfo: { avatar = '', legalName = '', userId = '', website = '' } = {} || {},
      location: { state = '', countryName = '' } = {},
      locationInfo,
      titleInfo = {} || {},
    } = {} || {},
    createDate,
  } = props;

  const {
    headQuarterAddress: { state: state1 = '', country: { name: countryName1 = '' } = {} } = {},
  } = locationInfo || {};

  const onViewProfileClick = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const Timestamp = () => {
    const getTimezone =
      getTimezoneViaCity(state || state1) || getTimezoneViaCity(countryName || countryName1) || '';
    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = moment(createDate).tz(timezone).locale('en').format('MMMM DD YYYY, HH:mm A');
    return <span className={styles.timestamp}>{date}</span>;
  };

  return (
    <Col className={styles.EmployeeTag} span={12} onClick={onViewProfileClick}>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{legalName}</span>
          <span className={styles.title}>{titleInfo?.name}</span>
          <Timestamp />
        </div>
      </div>
    </Col>
  );
};

export default connect(() => ({}))(EmployeeTag);
