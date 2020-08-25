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
    case 'paid'.toUpperCase():
      return styles.paidStatus;
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
    case 'paid'.toUpperCase():
      return <Icon type="exclamation-circle" theme="filled" />;
    default:
      return <Icon type="exclamation-circle" theme="filled" />;
  }
};

const getStatusMapping = (status = '') => {
  switch (status.toUpperCase()) {
    case 'complete'.toUpperCase():
      return 'approved'.toUpperCase();
    case 'pending'.toUpperCase():
      return 'reported'.toUpperCase();
    default:
      return status.toUpperCase();
  }
};

const StatusIcon = props => {
  const { status } = props;
  const statusMapping = getStatusMapping(status);
  return (
    <div className={`${getStatusStyle(status)} ${styles.wrapStatus}`}>
      <span className={styles.icon}>{getStatusIcon(status)}</span>
      <span className={styles.text}>{statusMapping}</span>
    </div>
  );
};

export default StatusIcon;
