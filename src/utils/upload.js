import * as axios from 'axios';
import { message } from 'antd';
import imageCompression from 'browser-image-compression';

export default async function uploadFile(files, params) {
  return axios.post('/file/upload', { files, params });
}

export const FILE_TYPE = {
  IMAGE: 0,
  PDF: 1,
  OTHER: -1,
};

export const identifyFile = (fileName = '') => {
  if (fileName) {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return FILE_TYPE.IMAGE;
      case 'pdf':
        return FILE_TYPE.PDF;
      default:
        return FILE_TYPE.OTHER;
    }
  }
  return FILE_TYPE.OTHER;
};

const getTypeText = (arr) => {
  const res = [];
  if (arr.includes(FILE_TYPE.IMAGE)) {
    res.push('png');
    res.push('jpg');
    res.push('jpeg');
  }
  if (arr.includes(FILE_TYPE.PDF)) {
    res.push('pdf');
  }
  return res.join(',');
};

export const beforeUpload = (file, types = [FILE_TYPE.IMAGE, FILE_TYPE.PDF], size = 3) => {
  const checkType = types.includes(identifyFile(file.name));
  if (!checkType) {
    message.error(`You can only upload ${getTypeText(types)} image files!`);
    return false;
  }
  const isLtSize = file.size / 1024 / 1024 < size;
  if (!isLtSize) {
    message.error(`File must smaller than ${size}MB!`);
    return false;
  }
  return checkType && isLtSize;
};

export async function compressImage(file) {
  let res = file;
  if (identifyFile(file.name) === FILE_TYPE.IMAGE) {
    const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      alwaysKeepResolution: true,
    };
    try {
      res = await imageCompression(file, options);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
  return res;
}
