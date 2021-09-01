import React from 'react';
import { Typography, Space } from 'antd';
import lightning from './assets/lightning.svg';
import styles from './index.less';

const NoteComponent = ({ note = {} }) => {
  // const renderHTMl = () => {
  //   return note.data;
  // };
  return (
    <div className={styles.NoteComponent}>
      <Space size="middle">
        <div>
          <img src={lightning} alt="lightning icon" />
        </div>
        <div className={styles.noteTitle}>{note.title}</div>
      </Space>
      <div className={styles.noteData}>{note.data}</div>
    </div>
  );
};

export default NoteComponent;
