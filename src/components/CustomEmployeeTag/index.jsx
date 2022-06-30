import React from 'react';
import { history } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

const CustomEmployeeTag = ({ name = '', avatar = '', title = '', userId = '' }) => {
  return (
    <div
      className={styles.CustomEmployeeTag}
      onClick={userId ? () => history.push(`/directory/employee-profile/${userId}`) : () => {}}
      style={{
        cursor: userId ? 'pointer' : 'default',
      }}
    >
      <div className={styles.avatar}>
        <img src={avatar || DefaultAvatar} alt="avatar" />
      </div>
      <div className={styles.nameTitle}>
        <span className={styles.name}>{name || 'Name'}</span>
        <span className={styles.title}>{title || 'Title'}</span>
      </div>
    </div>
  );
};

export default CustomEmployeeTag;
