/* eslint-disable react/no-array-index-key */
import React from 'react';
import { DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// import styles from '../index.less';
import styles from './index.less';

const Template = (props) => {
  const { type, files } = props;

  return (
    <div className={styles.templateContainer}>
      <div className={styles.templateHeader}>
        {type === 'default' ? (
          <>
            <h3>Template</h3> <span>(System Defaults)</span>
          </>
        ) : (
          <>
            <h3>Template</h3>
            <span>(Custom created)</span>
            <div className={styles.newIcon}>
              <span>+ New</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.defaultContainer}>
        {files.map((fileName, index) => (
          <div className={styles.row} key={index}>
            <span>{fileName}</span>

            <div className={styles.rowIconContainer}>
              <DownloadOutlined />
              <EditOutlined />
              <DeleteOutlined />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template;
