import React from 'react';
import { Typography } from 'antd';
import WarningIcon from '@/assets/warning-filled.svg';
import styles from './index.less';

const Warning = () => {
  return (
    <div className={styles.Warning}>
      <img src={WarningIcon} alt="warning" className={styles.warningIcon} />
      <Typography.Text>To be uploaded by candidate only</Typography.Text>
    </div>
  );
};

export default Warning;
