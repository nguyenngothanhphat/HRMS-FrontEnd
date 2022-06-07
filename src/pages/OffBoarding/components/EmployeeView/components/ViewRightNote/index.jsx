import { Divider, Space, Typography } from 'antd';
import React from 'react';
import StepsComponent from '@/pages/CandidatePortal/components/Candidate/components/StepsComponent';
import NoteIcon from './assets/NoteIcon.svg';
import styles from './index.less';

const ViewRightNote = () => {
  return (
    <div className={styles.ViewRightNote}>
      <Space size="middle" className={styles.NoteHeader}>
        <div className={styles.NoteTitle}>
          <div>
            <img src={NoteIcon} alt="note icon" />
          </div>
          <div className={styles.title}>Note</div>
        </div>
      </Space>

      <div className={styles.noteData}>
        <div className={styles.noteData__content}>
          <Typography.Text>
            Your Last Working Day (LWD) will be 90 days from the submission of this request. Check
            our{' '}
            <span styles={{ textDecoration: 'underline', color: '#2c6df9' }}>
              Offboarding policy
            </span>{' '}
            to learn more. The LWD is system generated.
          </Typography.Text>
        </div>
        <Divider className={styles.noteData__divider} />
        <StepsComponent />
      </div>
    </div>
  );
};

export default ViewRightNote;
