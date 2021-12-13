import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Divider, Space, Typography } from 'antd';
import React, { useState } from 'react';
import StepsComponent from '@/pages/CandidatePortal/components/Candidate/components/StepsComponent';
import lightning from './assets/lightning.svg';
import styles from './index.less';

const NoteComponent = () => {
  const [visible, setVisible] = useState(true);
  const handleCollapse = () => {
    setVisible(!visible);
  };
  return (
    <div className={styles.NoteComponent}>
      <Space size="middle" className={styles.NoteHeader}>
        <div className={styles.NoteTitle}>
          <div>
            <img src={lightning} alt="lightning icon" />
          </div>
          <div className={styles.title}>Note</div>
        </div>
        <div className={styles.NoteCollapse} onClick={handleCollapse}>
          {visible ? (
            <MinusOutlined className={styles.collapseIcon} />
          ) : (
            <PlusOutlined className={styles.collapseIcon} />
          )}
        </div>
      </Space>
      {visible && (
        <div className={styles.noteData}>
          <div className={styles.noteData__content}>
            <Typography.Text>
              Onboarding is a step-by-step process. It takes anywhere around{' '}
              <span>9-12 standard</span> working days for entire process to complete
            </Typography.Text>
          </div>
          <Divider className={styles.noteData__divider} />
          <StepsComponent />
        </div>
      )}
    </div>
  );
};

export default NoteComponent;
