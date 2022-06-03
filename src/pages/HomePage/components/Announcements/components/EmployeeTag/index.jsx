import { Col } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const EmployeeTag = (props) => {
  const {
    employee: {
      generalInfoInfo: { avatar = '', legalName = '', userId = '', website = '' } = {} || {},
      titleInfo = {} || {},
    } = {} || {},
    createDate,
  } = props;

  const onViewProfileClick = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (userId) {
      history.push(`/directory/employee-profile/${userId}`);
    }
  };

  const Timestamp = () => {
    const date = moment(createDate).locale('en').format('MMMM DD YYYY, HH:mm A');
    return <span className={styles.timestamp}>{date}</span>;
  };

  return (
    <Col className={styles.EmployeeTag} span={24} onClick={onViewProfileClick}>
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
