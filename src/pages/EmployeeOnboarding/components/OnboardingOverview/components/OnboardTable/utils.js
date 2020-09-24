import { TABLE_TYPE } from '../utils';

const getActionText = (type) => {
  const {
    PENDING_ELIGIBILITY_CHECKS,
    SENT_ELIGIBILITY_FORMS,
    RECEIVED_SUBMITTED_DOCUMENTS,
    INELIGIBLE_CANDIDATES,
    ELIGIBLE_CANDIDATES,
    SENT_PROVISIONAL_OFFERS,
    RECEIVED_PROVISIONAL_OFFERS,
    DISCARDED_PROVISIONAL_OFFERS,
    PENDING_APPROVALS,
    APPROVED_FINAL_OFFERS,
    REJECTED_FINAL_OFFERS,
    SENT_FINAL_OFFERS,
    ACCEPTED_FINAL_OFFERS,
    FINAL_OFFERS_DRAFTS,
    DISCARDED_FINAL_OFFERS,
  } = TABLE_TYPE;

  switch (type) {
    case PENDING_ELIGIBILITY_CHECKS:
    case RECEIVED_SUBMITTED_DOCUMENTS:
      return 'review';
    case ELIGIBLE_CANDIDATES:
      return 'prepare provisial offer';
    case SENT_PROVISIONAL_OFFERS:
      return 'draft final offer';
    case SENT_ELIGIBILITY_FORMS:
    case RECEIVED_PROVISIONAL_OFFERS:
    case INELIGIBLE_CANDIDATES:
    case DISCARDED_PROVISIONAL_OFFERS:
      return 'view form';
    case APPROVED_FINAL_OFFERS:
      return 'send offer';
    case PENDING_APPROVALS:
    case REJECTED_FINAL_OFFERS:
    case DISCARDED_FINAL_OFFERS:
      return 'view draft';
    case FINAL_OFFERS_DRAFTS:
      return 'send for approval';
    case SENT_FINAL_OFFERS:
    case ACCEPTED_FINAL_OFFERS:
      return 'create profile';
    default:
      return '';
  }
};

const getColumnWidth = (columnName, tableType) => {
  const {
    SENT_ELIGIBILITY_FORMS,
    RECEIVED_SUBMITTED_DOCUMENTS,
    ELIGIBLE_CANDIDATES,
    INELIGIBLE_CANDIDATES,
    SENT_PROVISIONAL_OFFERS,
    RECEIVED_PROVISIONAL_OFFERS,
    DISCARDED_PROVISIONAL_OFFERS,
    PENDING_APPROVALS,
    APPROVED_FINAL_OFFERS,
    REJECTED_FINAL_OFFERS,
    SENT_FINAL_OFFERS,
    ACCEPTED_FINAL_OFFERS,
    FINAL_OFFERS_DRAFTS,
    DISCARDED_FINAL_OFFERS,
  } = TABLE_TYPE;

  if (tableType === SENT_ELIGIBILITY_FORMS) {
    switch (columnName) {
      case 'rookieId':
        return '15%';
      case 'rookieName':
        return '22%';
      case 'position':
        return '15%';
      case 'location':
        return '';
      case 'date_sent':
        return '16%';
      case 'actions':
        return '12%';
      default:
        return '';
    }
  }

  if (tableType === RECEIVED_SUBMITTED_DOCUMENTS) {
    switch (columnName) {
      case 'rookieId':
        return '15%';
      case 'rookieName':
        return '22%';
      case 'position':
        return '15%';
      case 'location':
        return '';
      case 'date_received':
        return '16%';
      case 'actions':
        return '12%';
      default:
        return '';
    }
  }

  if (tableType === ELIGIBLE_CANDIDATES) {
    switch (columnName) {
      case 'rookieId':
        return '';
      case 'rookieName':
        return '17%';
      case 'position':
        return '14%';
      case 'location':
        return '10%';
      case 'comments':
        return '24%';
      case 'actions':
        return '22%';
      default:
        return '';
    }
  }

  if (tableType === INELIGIBLE_CANDIDATES) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '19%';
      case 'position':
        return '16%';
      case 'location':
        return '';
      case 'comments':
        return '24%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === SENT_PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '20%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'dateSent':
        return '18%';
      case 'actions':
        return '17%';
      default:
        return '';
    }
  }

  if (tableType === RECEIVED_PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '15%';
      case 'rookieName':
        return '20%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'dateReceived':
        return '20%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === DISCARDED_PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '18%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'comments':
        return '24%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === PENDING_APPROVALS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '15%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'dateJoin':
        return '20%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === APPROVED_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '15%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'dateJoin':
        return '20%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === REJECTED_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '17%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'comments':
        return '25%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === SENT_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '15%';
      case 'rookieName':
        return '20%';
      case 'position':
        return '18%';
      case 'location':
        return '';
      case 'dateJoin':
        return '20%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  if (tableType === ACCEPTED_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '12%';
      case 'rookieName':
        return '17%';
      case 'position':
        return '17%';
      case 'location':
        return '';
      case 'dateJoin':
        return '17%';
      case 'comments':
        return '24%';
      case 'actions':
        return '12%';
      default:
        return '';
    }
  }

  if (tableType === FINAL_OFFERS_DRAFTS) {
    switch (columnName) {
      case 'rookieId':
        return '12%';
      case 'rookieName':
        return '17%';
      case 'position':
        return '16%';
      case 'location':
        return '';
      case 'dateJoin':
        return '16%';
      case 'actions':
        return '19%';
      default:
        return '';
    }
  }

  if (tableType === DISCARDED_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '18%';
      case 'position':
        return '14%';
      case 'location':
        return '10%';
      case 'comments':
        return '24%';
      case 'actions':
        return '13%';
      default:
        return '';
    }
  }

  return '';
};

export { getActionText, getColumnWidth };
