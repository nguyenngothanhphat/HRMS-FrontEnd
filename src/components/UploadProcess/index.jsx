import React from 'react';
import { notification } from 'antd';
import UploadProcess from './components/UploadProcess';

const UploadFirebase = ({ file = {}, typeFile = 'IMAGE' }) => {
  const info = {
    message: `Upload ${file?.name}`,
    description: 'Uploading ...',
  };
  const openNotificationWithIcon = () => {
    notification.open({
      message: info.message,
      description: info.description,
      icon: <UploadProcess file={file} typeFile={typeFile} info={info} />,
      duration: 0,
    });
  };
  return <>{openNotificationWithIcon()}</>;
};

export default UploadFirebase;
