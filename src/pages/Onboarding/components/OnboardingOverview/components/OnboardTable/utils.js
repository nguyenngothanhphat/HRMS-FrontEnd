import { TABLE_TYPE } from '../utils';

const getActionText = (type) => {
  const { DRAFT } = TABLE_TYPE;
  switch (type) {
    case DRAFT:
      return 'Continue';
    default:
      return 'View Form';
  }
};

const getColumnWidth = (columnName, tableType) => {
  const {
    ALL,
    DRAFT,
    PROFILE_VERIFICATION,
    DOCUMENT_VERIFICATION,
    SALARY_NEGOTIATION,
    AWAITING_APPROVALS,
    OFFER_RELEASED,
    OFFER_ACCEPTED,
  } = TABLE_TYPE;
  if (
    tableType === ALL ||
    tableType === PROFILE_VERIFICATION ||
    tableType === DOCUMENT_VERIFICATION ||
    tableType === SALARY_NEGOTIATION ||
    tableType === AWAITING_APPROVALS ||
    tableType === OFFER_RELEASED ||
    tableType === OFFER_ACCEPTED
  ) {
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
        return '2%';
      case 'assignTo':
        return '10%';
      case 'assigneeManager':
        return '10%';
      case 'processStatus':
        return '10%';
      default:
        return '';
    }
  }

  if (tableType === DRAFT) {
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
        return '2%';
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
