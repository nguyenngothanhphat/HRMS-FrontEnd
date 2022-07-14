import { Space, Typography } from 'antd';
import React from 'react';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import NoteIcon from './assets/NoteIcon.svg';
import styles from './index.less';

const DidYouKnow = () => {
  const handleSchedule = () => {
    window.open('https://calendar.google.com/', '_blank');
  };
  return (
    <div className={styles.DidYouKnow}>
      <Space size="middle" className={styles.NoteHeader}>
        <div className={styles.NoteTitle}>
          <div>
            <img src={NoteIcon} alt="note icon" />
          </div>
          <div className={styles.title}>Did You Know?</div>
        </div>
      </Space>

      <div className={styles.noteData}>
        <div className={styles.noteData__content}>
          <Typography.Text>
            Your Manager,{' '}
            <span style={{ textDecoration: 'underline', color: '#2c6df9' }}>Sandeep</span>, usually
            conducts 1-on-1s and you can speak to him about anything
            <span style={{ fontWeight: 500, color: '#000000' }}>
              . 8/10 employees have changed their mind after talking to their manager
            </span>
            . Schedule a meeting now!
          </Typography.Text>
        </div>
        <div className={styles.btn}>
          <CustomPrimaryButton onClick={handleSchedule}>Schedule 1-on-1</CustomPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnow;
