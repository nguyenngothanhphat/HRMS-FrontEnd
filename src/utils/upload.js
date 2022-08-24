import { message } from 'antd';
import * as axios from 'axios';
import imageCompression from 'browser-image-compression';
import { isEmpty } from 'lodash';
import { YOUTUBE_REGEX } from '@/constants/youtube';
import { ATTACHMENT_TYPES, FILE_TYPE } from '@/constants/upload';

export default async function uploadFile(files, params) {
  return axios.post('/file/upload', { files, params });
}

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
      case 'mp4':
      case 'mov':
        return FILE_TYPE.VIDEO;
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
  if (arr.includes(FILE_TYPE.VIDEO)) {
    res.push('mp4');
    res.push('mov');
  }
  return res.join(', ');
};

export const beforeUpload = (
  file,
  types = [FILE_TYPE.IMAGE, FILE_TYPE.PDF, FILE_TYPE.VIDEO],
  size = 3,
) => {
  const checkType = types.includes(identifyFile(file.name));
  if (!checkType) {
    message.error(`You can only upload ${getTypeText(types)} files format!`);
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

export const getAttachmentType = (attachment = {}) => {
  if (!attachment || isEmpty(attachment)) return null;
  if (attachment?.type?.match(/video[/]/gim)) {
    return ATTACHMENT_TYPES.VIDEO;
  }
  if (YOUTUBE_REGEX.test(attachment?.url)) {
    return ATTACHMENT_TYPES.YOUTUBE;
  }
  if (attachment?.type?.match(/image[/]/gim)) {
    return ATTACHMENT_TYPES.IMAGE;
  }
  return ATTACHMENT_TYPES.IMAGE;
};
