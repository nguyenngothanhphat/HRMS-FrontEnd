export const HELP_TYPE = {
  FAQ: 'FAQ',
  HRMS_HELP_CENTER: 'HELP-CENTER',
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

export const HELP_TYPO = {
  [HELP_TYPE.FAQ]: {
    SETTINGS: {
      CATEGORY: {
        TAB_NAME: 'FAQ Categories',
        TABLE_NAME: 'Categories',
        NAME: 'Category',
        SEARCH_PLACEHOLDER: '',
      },
      QUESTION_TOPIC: {
        TAB_NAME: 'FAQ List',
        TABLE_NAME: 'Frequently Asked Questions',
        NAME: 'Question',
        SEARCH_PLACEHOLDER: 'Search by question or answer',
        CATEGORY_ADD_LABEL: 'FAQ Category',
        DESC_LABEL: 'Answer',
      },
    },
  },
  [HELP_TYPE.HRMS_HELP_CENTER]: {
    SETTINGS: {
      CATEGORY: {
        TAB_NAME: 'Help Center Categories',
        TABLE_NAME: 'Categories',
        NAME: 'Category',
        SEARCH_PLACEHOLDER: '',
      },
      QUESTION_TOPIC: {
        TAB_NAME: 'Help Center Topics',
        TABLE_NAME: 'Topics',
        NAME: 'Topic',
        SEARCH_PLACEHOLDER: 'Search by topic or description',
        CATEGORY_ADD_LABEL: 'Help Category',
        DESC_LABEL: 'Description',
      },
    },
  },
};
