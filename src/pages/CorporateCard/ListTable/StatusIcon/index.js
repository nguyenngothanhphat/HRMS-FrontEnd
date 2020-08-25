import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

const getStatusStyle = (status = '') => {
  switch (status.toUpperCase()) {
    case 'complete'.toUpperCase():
      return styles.completeStatus;
    case 'pending'.toUpperCase():
      return styles.pendingStatus;
    case 'inquiry'.toUpperCase():
      return styles.inquiryStatus;
    case 'reject'.toUpperCase():
      return styles.rejectStatus;
    case 'draft'.toUpperCase():
      return styles.draftStatus;
    default:
      return styles.pendingStatus;
  }
};

const getStatusIcon = (status = '') => {
  switch (status.toUpperCase()) {
    case 'complete'.toUpperCase():
      return <Icon type="check-circle" theme="filled" />;
    case 'pending'.toUpperCase():
      return <Icon type="clock-circle" theme="filled" />;
    case 'inquiry'.toUpperCase():
      return <Icon type="exclamation-circle" theme="filled" />;
    case 'reject'.toUpperCase():
      return <Icon type="exclamation-circle" theme="filled" />;
    case 'draft'.toUpperCase():
      return <Icon type="exclamation-circle" theme="filled" />;
    default:
      return <Icon type="exclamation-circle" theme="filled" />;
  }
};
const StatusIcon = props => {
  const { status } = props;
  return (
    <div className={`${getStatusStyle(status)} ${styles.wrapStatus}`}>
      <span className={styles.icon}>{getStatusIcon(status)}</span>
      <span className={styles.text}>{status}</span>
    </div>
  );
};

export default StatusIcon;
