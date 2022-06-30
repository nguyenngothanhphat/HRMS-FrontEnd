import React from 'react';
import { history } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

const CustomEmployeeTag = ({
  name = '',
  avatar = '',
  title = '',
  userId = '',
  isYou = false,
  highlight = false,
  status = '',
}) => {
  const getColor = () => {
    if (status === 'accepted') return '#00C598';
    if (status === 'rejected') return '#E85757';
    return 'transparent';
  };

  return (
    <div
      className={styles.CustomEmployeeTag}
      onClick={userId ? () => history.push(`/directory/employee-profile/${userId}`) : () => {}}
      style={{
        cursor: userId ? 'pointer' : 'default',
      }}
    >
      <div className={styles.avatar}>
        <img
          src={avatar || DefaultAvatar}
          alt="avatar"
          style={highlight ? { borderColor: getColor(), backgroundColor: getColor() } : {}}
        />
        {highlight && (
          <div
            className={styles.dot}
            style={{
              backgroundColor: getColor(),
            }}
          />
        )}
      </div>
      <div className={styles.nameTitle}>
        <span className={styles.name}>
          {name || 'Name'} {isYou ? '(You)' : ''}
        </span>
        <span className={styles.title}>{title || 'Title'}</span>
      </div>
    </div>
  );
};

export default CustomEmployeeTag;
