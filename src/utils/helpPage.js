export const HELP_TYPE = {
  FAQ: 'faq',
  HRMS_HELP_CENTER: 'help-center',
};

export const HELP_NAME = {
  [HELP_TYPE.FAQ]: 'FAQ',
  [HELP_TYPE.HRMS_HELP_CENTER]: 'Help Center',
};

export const HELP_STR = {
  BASE_URL: {
    [HELP_TYPE.FAQ]: '/faq',
    [HELP_TYPE.HRMS_HELP_CENTER]: '/help-center',
  },
  SETTINGS: {
    [HELP_TYPE.FAQ]: '/faq/settings',
    [HELP_TYPE.HRMS_HELP_CENTER]: '/help-center/settings',
  },
};

export const getTypeByPath = (pathname) => {
  if (pathname.includes('/faq')) {
    return HELP_TYPE.FAQ;
  }
  return HELP_TYPE.HRMS_HELP_CENTER;
};

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
