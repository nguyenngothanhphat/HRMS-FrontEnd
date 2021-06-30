const TYPE_QUESTION = {
  TEXT_ANSWER: {
    key: 'FIELD',
    value: 'Free form text',
  },
  SINGLE_CHOICE: {
    key: 'CHOICE',
    value: 'Single choice',
  },
  MULTIPLE_CHOICE: {
    key: 'MULTI-CHOICE',
    value: 'Multiple choice',
  },
  // SELECT_OPTION: {
  //   key: 'SELECT',
  //   value: 'Dropdown',
  // },
  RATING_CHOICE: {
    key: 'RATING',
    value: 'Single rating choice',
  },
  // MULTI_RATING_CHOICE: {
  //   key: 'MULTI-RATING',
  //   value: 'Multiple rating choice',
  // },
};

const SPECIFY = {
  AT_LEAST: {
    key: 'AT-LEAST',
    value: 'At least',
  },
  AT_MOST: {
    key: 'AT-MOST',
    value: 'At most',
  },
  EXACTLY: {
    key: 'EXACTLY',
    value: 'Exactly',
  },
};

export { TYPE_QUESTION, SPECIFY };
