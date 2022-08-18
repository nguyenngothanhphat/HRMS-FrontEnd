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

export const roundNumber = (x) => Math.round(x * 10) / 10;
export const roundNumber2 = (x) => Math.round(x * 100) / 100;

export function setSocialMode(value) {
  localStorage.setItem('homePageSocialMode', value);
}

export function getSocialMode() {
  const val = localStorage.getItem('homePageSocialMode');
  return val === 'true';
}
