import React from 'react';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

const CustomEmployeeTag = ({ name = '', avatar = '', title = '' }) => {
  return (
    <div className={styles.CustomEmployeeTag}>
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
