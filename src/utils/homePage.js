import { message } from 'antd';

export const TAB_IDS = {
  ANNOUNCEMENTS: 'ANNOUNCEMENTS',
  ANNIVERSARY: 'ANNIVERSARY',
  IMAGES: 'IMAGES',
  BANNER: 'BANNER',
  POLL: 'POLL',
};

export const TAB_IDS_QUICK_LINK = {
  GENERAL: 'GENERAL',
  TIMEOFF: 'TIMEOFF',
  FORTIMEOFF: 'For Timeoff',
  GENERALTABNAME: 'General',
};

export const CELEBRATE_TYPE = {
  ANNIVERSARY: 'ANNIVERSARY',
  BIRTHDAY: 'BIRTHDAY',
  NEWJOINEE: 'NEWJOINEE',
};

export const LIKE_ACTION = {
  LIKE: 'LIKE',
  DISLIKE: 'DISLIKE',
};

export const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}">${url}</a>`;
  });
};

export const getUrlFromString = (text) => {
  const expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  return text.match(expression);
};

export const dateFormat = 'MMMM DD YYYY, HH:mm A';

const identifyImage = (fileName) => {
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
