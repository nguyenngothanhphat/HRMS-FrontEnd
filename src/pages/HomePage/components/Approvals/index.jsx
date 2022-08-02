import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';
import ApprovalIcon from '@/assets/homePage/noteIcon.svg';
import styles from './index.less';

export default function Approvals() {
  return (
    <Button className={styles.Approval} onClick={() => history.push('/dashboard/approvals')}>
      <img style={{ paddingRight: 13 }} src={ApprovalIcon} alt="approval-icon" /> Approval Page
    </Button>
  );
}
