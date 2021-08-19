import { TABLE_TYPE } from '../utils';

const getActionText = (type) => {
  const {
    // PENDING_ELIGIBILITY_CHECKS,
    // SENT_ELIGIBILITY_FORMS,
    // RECEIVED_SUBMITTED_DOCUMENTS,
    INELIGIBLE_CANDIDATES,
    ELIGIBLE_CANDIDATES,
    SENT_PROVISIONAL_OFFERS,
    // RECEIVED_PROVISIONAL_OFFERS,
    // DISCARDED_PROVISIONAL_OFFERS,
    // PENDING_APPROVALS,
    // APPROVED_FINAL_OFFERS,
    // REJECTED_FINAL_OFFERS,
    SENT_FINAL_OFFERS,
    ACCEPTED_FINAL_OFFERS,
    // FINAL_OFFERS_DRAFTS,
    // DISCARDED_FINAL_OFFERS,
    // New
    PROVISIONAL_OFFERS_DRAFTS,
    ACCEPTED__PROVISIONAL_OFFERS,
    // RENEGOTIATE_PROVISIONAL_OFFERS,
    PENDING,
    // APPROVED_OFFERS,
    // RENEGOTIATE_FINAL_OFFERS,
    SENT_FOR_APPROVALS,
    PROVISIONAL_OFFERS,
    FINAL_OFFERS,
    ALL,
  } = TABLE_TYPE;

  switch (type) {
    // case PENDING_ELIGIBILITY_CHECKS:
    // case RECEIVED_SUBMITTED_DOCUMENTS:
    //   return formatMessage({ id: 'component.onboardingOverview.review' });
    // case ELIGIBLE_CANDIDATES:
    //   return formatMessage({ id: 'component.onboardingOverview.prepareProvisionalOffer' });
    // case SENT_PROVISIONAL_OFFERS:
    //   return formatMessage({ id: 'component.onboardingOverview.draftFinalOffer' });
    // case SENT_ELIGIBILITY_FORMS:
    // case RECEIVED_PROVISIONAL_OFFERS:
    // case INELIGIBLE_CANDIDATES:
    // case DISCARDED_PROVISIONAL_OFFERS:
    //   return formatMessage({ id: 'component.onboardingOverview.viewForm' });
    // case APPROVED_FINAL_OFFERS:
    //   return formatMessage({ id: 'component.onboardingOverview.sendOffer' });
    // case PENDING_APPROVALS:
    // case REJECTED_FINAL_OFFERS:
    // case DISCARDED_FINAL_OFFERS:
    // case SENT_FINAL_OFFERS:
    //   return formatMessage({ id: 'component.onboardingOverview.viewDraft2' });
    // case FINAL_OFFERS_DRAFTS:
    //   return formatMessage({ id: 'component.onboardingOverview.sendForApproval' });
    // case ACCEPTED_FINAL_OFFERS:
    //   return formatMessage({ id: 'component.onboardingOverview.createProfile' });
    case PROVISIONAL_OFFERS_DRAFTS:
    case PENDING:
      return 'Continue';

    case SENT_PROVISIONAL_OFFERS:
    case ELIGIBLE_CANDIDATES:
    case INELIGIBLE_CANDIDATES:
    case SENT_FOR_APPROVALS:
    case SENT_FINAL_OFFERS:
    case PROVISIONAL_OFFERS:
    case FINAL_OFFERS:
      return 'View Form';

    case ACCEPTED_FINAL_OFFERS:
      return 'Create Profile';
    case ACCEPTED__PROVISIONAL_OFFERS:
      return 'Initiate Background Check';
    // case RENEGOTIATE_PROVISIONAL_OFFERS

    default:
      return 'View Form';
  }
};

const getColumnWidth = (columnName, tableType) => {
  const {
    // SENT_ELIGIBILITY_FORMS,
    // RECEIVED_SUBMITTED_DOCUMENTS,
    ELIGIBLE_CANDIDATES,
    INELIGIBLE_CANDIDATES,
    SENT_PROVISIONAL_OFFERS,
    // RECEIVED_PROVISIONAL_OFFERS,
    // DISCARDED_PROVISIONAL_OFFERS,
    PENDING_APPROVALS,
    APPROVED_FINAL_OFFERS,
    // REJECTED_FINAL_OFFERS,
    SENT_FINAL_OFFERS,
    ACCEPTED_FINAL_OFFERS,
    FINAL_OFFERS_DRAFTS,
    // DISCARDED_FINAL_OFFERS,
    // New
    PROVISIONAL_OFFERS_DRAFTS,
    ACCEPTED__PROVISIONAL_OFFERS,
    RENEGOTIATE_PROVISIONAL_OFFERS,
    APPROVED_OFFERS,
    PENDING,
    RENEGOTIATE_FINAL_OFFERS,
    PROVISIONAL_OFFERS,
    FINAL_OFFERS,
    // SENT_FOR_APPROVALS,
    ALL,
  } = TABLE_TYPE;

  if (tableType === ALL) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '25%';
      case 'position':
        return '16%';
      case 'location':
        return '16%';
      case 'dateJoin':
        return '18%';
      case 'actions':
        return '15%';
      case 'assignTo':
        return '15%';
      case 'assigneeManager':
        return '15%';
      case 'processStatus':
        return '8%';
      default:
        return '';
    }
  }
  // .
  if (tableType === PROVISIONAL_OFFERS_DRAFTS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '25%';
      case 'position':
        return '16%';
      case 'location':
        return '16%';
      case 'dateJoin':
        return '18%';
      case 'actions':
        return '15%';
      case 'assignTo':
        return '15%';
      case 'assigneeManager':
        return '15%';
      case 'processStatus':
        return '8%';

      default:
        return '';
    }
  }

  // .
  if (tableType === ELIGIBLE_CANDIDATES) {
    switch (columnName) {
      case 'rookieId':
        return '15%';
      case 'rookieName':
        return '23%';
      case 'position':
        return '17%';
      case 'location':
        return '10%';
      case 'resubmit':
        return '24%';
      case 'actions':
        return '14%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === INELIGIBLE_CANDIDATES) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '19%';
      case 'position':
        return '16%';
      case 'location':
        return '10%';
      case 'comments':
        return '24%';
      case 'actions':
        return '13%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === SENT_PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '12%';
      case 'rookieName':
        return '19%';
      case 'position':
        return '16%';
      case 'location':
        return '';
      case 'dateSent':
        return '16%';
      case 'expire':
        return '14%';
      case 'actions':
        return '11%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === ACCEPTED__PROVISIONAL_OFFERS || tableType === RENEGOTIATE_PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '24%';
      case 'position':
        return '20%';
      case 'location':
        return '';
      case 'actions':
        return '23%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === PENDING) {
    switch (columnName) {
      case 'rookieId':
        return '14%';
      case 'rookieName':
        return '21%';
      case 'position':
        return '17%';
      case 'location':
        return '10%';
      case 'document':
        return '23%';
      case 'actions':
        return '14%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === APPROVED_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '18%';
      case 'position':
        return '15%';
      case 'location':
        return '';
      case 'dateJoin':
        return '16%';
      case 'actions':
        return '24%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
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
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
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
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === SENT_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '12%';
      case 'rookieName':
        return '21%';
      case 'position':
        return '16%';
      case 'location':
        return '';
      case 'dateSent':
        return '14%';
      case 'expire':
        return '14%';
      case 'actions':
        return '12%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === ACCEPTED_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '10%';
      case 'rookieName':
        return '18%';
      case 'position':
        return '13%';
      case 'location':
        return '';
      case 'dateJoin':
        return '10%';
      case 'changeRequest':
        return '22%';
      case 'actions':
        return '14%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      // case 'processStatus':
      //   return '15%';
      default:
        return '';
    }
  }

  // .
  if (tableType === RENEGOTIATE_FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '12%';
      case 'rookieName':
        return '20%';
      case 'position':
        return '15%';
      case 'location':
        return '10%';
      case 'dateRequest':
        return '15%';
      case 'actions':
        return '25%';
      case 'assignTo':
        return '12%';
      case 'assigneeManager':
        return '12%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === PROVISIONAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '21%';
      case 'position':
        return '15%';
      case 'location':
        return '';
      case 'comments':
        return '26%';
      case 'actions':
        return '13%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === FINAL_OFFERS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '21%';
      case 'position':
        return '15%';
      case 'location':
        return '';
      case 'comments':
        return '26%';
      case 'actions':
        return '13%';
      case 'assignTo':
        return '8%';
      case 'assigneeManager':
        return '8%';
      case 'processStatus':
        return '12%';
      default:
        return '';
    }
  }

  // .
  if (tableType === FINAL_OFFERS_DRAFTS) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
        return '25%';
      case 'position':
        return '16%';
      case 'location':
        return '16%';
      case 'dateJoin':
        return '18%';
      case 'actions':
        return '15%';
      case 'assignTo':
        return '15%';
      case 'assigneeManager':
        return '15%';
      case 'processStatus':
        return '8%';
      default:
        return '';
    }
  }

  return '';
};

export { getActionText, getColumnWidth };
