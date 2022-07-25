import moment from 'moment';
import { ONBOARDING_DATE_FORMAT, ONBOARDING_TABLE_TYPE } from '@/constants/onboarding';

export const compare = (dateTimeA, dateTimeB) => {
  const momentA = moment(dateTimeA, 'DD/MM/YYYY');
  const momentB = moment(dateTimeB, 'DD/MM/YYYY');
  if (momentA > momentB) return 1;
  if (momentA < momentB) return -1;
  return 0;
};

export const formatDate = (date, format = ONBOARDING_DATE_FORMAT) => {
  if (!date) return '';
  return moment(date).format(format);
};

export const dateDiffInDays = (a, b) => {
  if (!a || !b) {
    return 10;
  }
  // a and b are javascript Date objects
  const SECOND_IN_DAY = 1000 * 60 * 60 * 24;
  const firstDate = new Date(a);
  const secondDate = new Date(b);

  const diff = parseFloat((firstDate.getDate() - secondDate.getDate()) / SECOND_IN_DAY);
  return diff;
};

export const getActionText = (type, processStatus) => {
  const { DRAFT, ALL } = ONBOARDING_TABLE_TYPE;
  switch (type) {
    case DRAFT:
      return 'Continue';
    case ALL:
      if (processStatus === DRAFT) return 'Continue';
      return 'View Form';
    default:
      return 'View Form';
  }
};

export const getColumnWidth = (columnName, tableType, arrLength) => {
  const {
    ALL,
    DRAFT,
    PROFILE_VERIFICATION,
    DOCUMENT_VERIFICATION,
    SALARY_NEGOTIATION,
    AWAITING_APPROVALS,
    NEEDS_CHANGES,
    OFFER_RELEASED,
    OFFER_ACCEPTED,
    OFFER_REJECTED,
    OFFER_WITHDRAWN,
    DOCUMENT_CHECKLIST_VERIFICATION,
  } = ONBOARDING_TABLE_TYPE;
  if (arrLength > 0) {
    if (
      tableType === ALL ||
      tableType === PROFILE_VERIFICATION ||
      tableType === DOCUMENT_VERIFICATION ||
      tableType === SALARY_NEGOTIATION ||
      tableType === AWAITING_APPROVALS ||
      tableType === OFFER_RELEASED ||
      tableType === OFFER_ACCEPTED ||
      tableType === OFFER_REJECTED ||
      tableType === OFFER_WITHDRAWN ||
      tableType === DOCUMENT_CHECKLIST_VERIFICATION
    ) {
      switch (columnName) {
        case 'candidateId':
          return '10%';
        case 'candidateName':
          return '16%';
        case 'position':
          return '12%';
        case 'location':
          return '10%';
        case 'dateJoin':
          return '10%';
        case 'actions':
          return '3%';
        case 'assignTo':
          return '10%';
        case 'assigneeManager':
          return '10%';
        case 'processStatus':
          return '13%';
        default:
          return '';
      }
    }

    if (tableType === DRAFT || tableType === NEEDS_CHANGES) {
      switch (columnName) {
        case 'candidateId':
          return '10%';
        case 'candidateName':
          return '16%';
        case 'position':
          return '12%';
        case 'location':
          return '10%';
        case 'dateJoin':
          return '10%';
        case 'actions':
          return '3%';
        case 'assignTo':
          return '10%';
        case 'assigneeManager':
          return '10%';
        case 'processStatus': // change
          return '6%';
        default:
          return '';
      }
    }
  } else {
    switch (columnName) {
      case 'candidateId':
        return '13%';
      case 'candidateName':
        return '16%';
      case 'position':
        return '12%';
      case 'location':
        return '10%';
      case 'dateJoin':
        return '10%';
      case 'actions':
        return '8%';
      case 'assignTo':
        return '10%';
      case 'assigneeManager':
        return '10%';
      case 'processStatus': // change
        return '6%';
      default:
        return '';
    }
  }
  return '';
};
