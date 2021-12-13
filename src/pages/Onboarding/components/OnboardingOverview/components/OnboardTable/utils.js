import { TABLE_TYPE } from '../utils';

const getActionText = (type, processStatus) => {
  const { DRAFT, ALL } = TABLE_TYPE;
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

const getColumnWidth = (columnName, tableType, arrLength) => {
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
  } = TABLE_TYPE;

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
      tableType === OFFER_WITHDRAWN
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

export { getActionText, getColumnWidth };
