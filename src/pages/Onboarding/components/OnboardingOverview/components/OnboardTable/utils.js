import { NEW_TABLE_TYPE } from '../utils';

const getActionText = (type) => {
  const { DRAFT } = NEW_TABLE_TYPE;
  switch (type) {
    case DRAFT:
      return 'Continue';
    default:
      return 'View Form';
  }
};

const getColumnWidth = (columnName, tableType) => {
  const { ALL, DRAFT } = NEW_TABLE_TYPE;
  if (tableType === ALL) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
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
        return '14%';
      default:
        return '';
    }
  }

  if (tableType === DRAFT) {
    switch (columnName) {
      case 'rookieId':
        return '13%';
      case 'rookieName':
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
