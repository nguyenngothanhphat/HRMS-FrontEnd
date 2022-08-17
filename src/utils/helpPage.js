export const getHelpUrl = (path) => {
  if (path.includes('/faq/settings')) {
    return '/faq/settings';
  }
  return '/help-center/settings';
};

export const getSettingPageUrl = (path) => {
  return `${path}/settings`;
};

export const convertStr = (str) => {
  return `${(str || '').toLowerCase().replace(/ /g, '-')}`;
};
