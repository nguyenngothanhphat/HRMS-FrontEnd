const getFileType = (str) => {
  if (!str) {
    return '';
  }
  if (str.includes('.docx')) {
    return 'word';
  }
  if (str.includes('.pdf')) {
    return 'pdf';
  }
  if (str.includes('.xlsx')) {
    return 'excel';
  }
  return '';
};

const checkValidField = (value) => {
  return value === 'dollar';
};

export { getFileType, checkValidField };
