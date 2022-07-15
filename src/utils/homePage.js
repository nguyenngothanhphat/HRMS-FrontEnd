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

export const POST_OR_CMT = {
  POST: 'POST',
  COMMENT: 'COMMENT',
};

export const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}">${url}</a>`;
  });
};

export const hashtagify = (text) => {
  const urlRegex = /(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="#">${url}</a>`;
  });
};

export const getUrlFromString = (text) => {
  const expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  return text.match(expression);
};

export const dateFormat = 'MMMM DD YYYY, HH:mm A';

export const roundNumber = (x) => Math.round(x * 10) / 10;
export const roundNumber2 = (x) => Math.round(x * 100) / 100;
