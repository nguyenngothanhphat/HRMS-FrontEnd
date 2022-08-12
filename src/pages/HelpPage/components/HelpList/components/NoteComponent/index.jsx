import React from 'react';
import { Typography, Space } from 'antd';
import lightning from './assets/lightning.svg';
import styles from './index.less';

const NoteComponent = ({ note = {} }) => {
  return (
    <div className={styles.NoteComponent}>
      <Space style={{ marginBottom: '24px' }} size="middle">
        <div>
          <img src={note.icon || lightning} alt="lightning icon" />
        </div>
        <Typography.Title level={5} className={styles.titleText}>
          {note.title}
        </Typography.Title>
      </Space>
      <div>{note.data}</div>
    </div>
  );
};

export default NoteComponent;
