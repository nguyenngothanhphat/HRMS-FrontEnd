const getFileType = (str) => {
  if (str.includes('.docx')) {
    return 'word';
  }
  if (str.includes('.pdf')) {
    return 'pdf';
  }
  if (str.includes('.xlsx')) {
    return 'excel';
  }
};

export default getFileType;
