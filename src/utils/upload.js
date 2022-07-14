import * as axios from 'axios';
import { message } from 'antd';

export default async function uploadFile(files, params) {
  return axios.post('/file/upload', { files, params });
}

const identifyImage = (fileName = '') => {
  if (fileName) {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 1;

      default:
        return 0;
    }
  }
  return 0;
};

export const beforeUpload = (file) => {
  const checkType = identifyImage(file.name) === 1;
  if (!checkType) {
    message.error('You can only upload png, jpg, jpeg image files!');
    return false;
  }
  const isLt3M = file.size / 1024 / 1024 < 3;
  if (!isLt3M) {
    message.error('Image must smaller than 3MB!');
    return false;
  }
  return checkType && isLt3M;
};
