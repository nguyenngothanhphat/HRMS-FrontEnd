const candidateLink = {
  reviewProfile: 'review-profile',
  uploadDocuments: 'upload-documents',
  salaryNegotiation: 'salary-negotiation',
  acceptOffer: 'accept-offer',
};
const taskStatus = {
  IN_PROGRESS: 'IN-PROGRESS', // doing
  DONE: 'DONE', // done
  RE_SUBMIT: 'RE-SUBMIT', // need to submit again
  UPCOMING: 'UPCOMING', // new, no need to do at present
  REJECTED: 'REJECTED', // rejected
  RE_NEGOTIATE: 'RE-NEGOTIATE', // for salary structure
};
export { candidateLink, taskStatus };
