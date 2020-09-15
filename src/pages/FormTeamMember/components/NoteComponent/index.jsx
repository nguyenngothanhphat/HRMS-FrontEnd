import React, { Component } from 'react';
import styles from './index.less';
import { Typography, Space } from 'antd';
import lightning from './assets/lightning.svg';
const NoteComponent = ({ note = {} }) => {
  // const renderHTMl = () => {
  //   return note.data;
  // };
  return (
    <div className={styles.NoteComponent}>
      <Space size="middle">
        <div>
          <img src={lightning}></img>
        </div>
        <Typography.Title level={5}>{note.title}</Typography.Title>
      </Space>
      <div>{note.data}</div>
    </div>
  );
};

export default NoteComponent;
