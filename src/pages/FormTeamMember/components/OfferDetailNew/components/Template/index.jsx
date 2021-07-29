/* eslint-disable react/no-array-index-key */
import React from 'react';
import { DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DownloadFile from '@/components/DownloadFile';

// import styles from '../index.less';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const Template = (props) => {
  const { type, files, dispatch } = props;

  const editTemplate = (id) => {
    dispatch({
      type: 'candidateInfo/editTemplateEffect',
      payload: {
        id,
        tenantId: getCurrentTenant(),
      },
    });
  };

  const removeTemplate = (id) => {
    dispatch({
      type: 'candidateInfo/removeTemplateEffect',
      payload: {
        id,
        tenantId: getCurrentTenant(),
      },
    });
  };

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
        {files.map((file) => {
          const { title, _id = '123', attachment = {} } = file;

          return (
            <div className={styles.row} key={_id}>
              <span>{title}</span>

              <div className={styles.rowIconContainer}>
                <DownloadFile content={<DownloadOutlined />} url={attachment?.url} />
                <EditOutlined onClick={() => editTemplate(_id)} />
                {type !== 'default' && <DeleteOutlined onClick={() => removeTemplate(_id)} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Template;
