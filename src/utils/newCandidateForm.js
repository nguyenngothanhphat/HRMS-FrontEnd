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
  SCAN_UPLOAD: 'Scan & Upload',
  ELECTRONICALLY: 'Electronically Sign',
  HARD_COPY: 'Hard Copy',
};

export const listNoteSalary = (joiningBonus = '', midtermHike = '', noteSalary = '') => {
  const arr = [];
  if (joiningBonus) {
    arr.push(`As a part of this offer the candidate shall be entitled to a Joining Bonus of INR
    ${joiningBonus}. Post Joining 50% of this amount shall be paid
     along with the second month&apos;s salary (or the applicable first payroll). And on
     completion of three months of service the balance 50% shall be paid along with the
     immediate next payroll.`);
  }
  if (midtermHike) {
    arr.push(`As a part of this offer the candidate shall be entitled to a one time Mid Term
    Hike of INR ${midtermHike}. Upon completion of 6 months duration
    of employment with full standing and meeting the Project and Management
    expectations.`);
  }
  if (noteSalary) {
    arr.push(noteSalary);
  }
  return arr;
};
