import { Divider, Space, Typography } from 'antd';
import React from 'react';
import StepsOfViewRight from '../StepsOfViewRight';
import NoteIcon from './assets/NoteIcon.svg';
import NoteIcon2 from './assets/noteIcon2.svg';
import styles from './index.less';

const ViewRightNote = (props) => {
  const { status = '' } = props;

  return (
    <div className={styles.ViewRightNote}>
      <Space size="middle" className={styles.NoteHeader}>
        <div className={styles.NoteTitle}>
          <div>
            {status === 'In Progress' ? (
              <img src={NoteIcon2} alt="note icon" />
            ) : (
              <img src={NoteIcon} alt="note icon" />
            )}
          </div>
          <div className={styles.title}>Note</div>
        </div>
      </Space>

      <div className={styles.noteData}>
        <div className={styles.noteData__content}>
          {status === 'In Progress' ? (
            <Typography.Text>
              Offboarding is a step-by-step process. It takes anywhere around{' '}
              <span styles={{ textDecoration: 'underline', color: '#FFA100' }}>9-12 standard</span>{' '}
              working days for the entire process to complete.
            </Typography.Text>
          ) : (
            <Typography.Text>
              Your Last Working Day (LWD) will be 90 days from the submission of this request. Check
              our{' '}
              <span styles={{ textDecoration: 'underline', color: '#2c6df9' }}>
                Offboarding policy
              </span>{' '}
              to learn more. The LWD is system generated. Any change request has to be approved by
              the HR manager to come into effect.
            </Typography.Text>
          )}
        </div>
        <Divider className={styles.noteData__divider} />
        <StepsOfViewRight />
      </div>
    </div>
  );
};

export default ViewRightNote;
