import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React, { useState } from 'react';
import lightning from './assets/lightning.svg';
import styles from './index.less';

const NoteComponent = ({ note = {} }) => {
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
          <div className={styles.title}>{note.title}</div>
        </div>
        <div className={styles.NoteCollapse} onClick={handleCollapse}>
          {visible ? (
            <MinusOutlined className={styles.collapseIcon} />
          ) : (
            <PlusOutlined className={styles.collapseIcon} />
          )}
        </div>
      </Space>
      {visible && <div className={styles.noteData}>{note.data}</div>}
    </div>
  );
};

export default NoteComponent;
