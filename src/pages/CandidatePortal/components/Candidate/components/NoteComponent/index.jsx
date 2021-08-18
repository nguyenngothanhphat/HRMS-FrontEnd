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
      <Space style={{ marginBottom: '24px' }} size="middle">
        <div>
          <img src={lightning} alt="lightning icon" />
        </div>
        <Typography.Title level={5}>{note.title}</Typography.Title>
      </Space>
      <div>{note.data}</div>
    </div>
  );
};

export default NoteComponent;
