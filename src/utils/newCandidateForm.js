export const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const mapType = {
  A: 'documentTypeA',
  B: 'documentTypeB',
  C: 'documentTypeC',
  D: 'documentTypeD',
  E: 'documentTypeE',
};

export const DOCUMENTS_CHECKLIST_TYPE = {
  S: 'Scan & Upload',
  E: 'Electronically Sign',
  H: 'Hard Copy',
};
