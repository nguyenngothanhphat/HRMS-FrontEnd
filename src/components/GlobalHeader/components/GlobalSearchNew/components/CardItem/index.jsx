import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import profileIcon from '../icon/profile.svg';
import phoneIcon from '../icon/phone.svg';
import jobIcon from '../icon/job.svg';
import styles from './index.less';

const CardItem = (props) => {
  const { avatar = '', fullName = '', userId = '', workNumber = '', title = '', onClick } = props;
  return (
    <div className={styles.card}>
      <div
        className={styles.card__top}
        onClick={() => {
          onClick();
          history.push(`/directory/employee-profile/${userId}/general-info`);
        }}
      >
        <Avatar src={avatar} size={32} icon={<UserOutlined />} />
        <div className={styles.title}>{fullName}</div>
      </div>
      <div className={styles.card__content}>
        {fullName && (
          <div className={styles.row}>
            <img className={styles.row__icon} src={profileIcon} alt="profile" />
            <div className={styles.row__text}>{userId}</div>
          </div>
        )}
        {workNumber && (
          <div className={styles.row}>
            <img className={styles.row__icon} src={phoneIcon} alt="phone" />
            <div className={styles.row__text}>{workNumber}</div>
          </div>
        )}
        {title && (
          <div className={styles.row}>
            <img className={styles.row__icon} src={jobIcon} alt="job" />
            <div className={styles.row__text}>{title}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CardItem;
