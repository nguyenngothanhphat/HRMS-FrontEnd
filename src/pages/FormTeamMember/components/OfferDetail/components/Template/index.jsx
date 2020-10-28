/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DownloadFile from '@/components/DownloadFile';

// import styles from '../index.less';
import styles from './index.less';

const Template = (props) => {
  const { type, files } = props;
  const [urlToDownload, setUrlToDownload] = useState(
    'http://www.africau.edu/images/default/sample.pdf',
  );
  const downloadRef = null;
  console.log(files);

  const handleDownload = () => {
    if (urlToDownload) {
      // downloadRef.click();
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.setAttribute('download', 'file.pdf');
      // link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
    }
  };
  // useEffect(() => {
  //   // handleDownload();
  // }, [urlToDownload]);

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
        {files.map((file, index) => {
          const { title, _id = '123', attachment: { url = '' } = {} } = file;
          // const { url = '' } = attachment;
          console.log(url);
          return (
            <div className={styles.row} key={_id}>
              <span>{title}</span>

              <div className={styles.rowIconContainer}>
                <DownloadFile content={<DownloadOutlined />} url={url} />
                {/* <DownloadOutlined/> */}
                <EditOutlined />
                <DeleteOutlined />
              </div>
            </div>
          );
        })}
      </div>

      {/* <Link download */}
      {/* <a
        href={urlToDownload}
        styles={{ display: 'none' }}
        ref={(ref) => {
          downloadRef = ref;
        }}
        download
        target="_blank"
      /> */}
    </div>
  );
};

export default Template;
