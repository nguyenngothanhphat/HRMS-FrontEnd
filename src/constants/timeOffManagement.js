import { TIMEOFF_STATUS } from './timeOff';

export const TIMEOFF_NAME_BY_ID = [
  { value: TIMEOFF_STATUS.ACCEPTED, label: 'Approved' },
  { value: TIMEOFF_STATUS.IN_PROGRESS, label: 'In Progress' },
  // { value: TIMEOFF_STATUS.IN_PROGRESS_NEXT, label: 'In Progress' },
  { value: TIMEOFF_STATUS.REJECTED, label: 'Rejected' },
  { value: TIMEOFF_STATUS.DRAFTS, label: 'Draft' },
  { value: TIMEOFF_STATUS.ON_HOLD, label: 'On-hold' },
  { value: TIMEOFF_STATUS.DELETED, label: 'Deleted' },
  { value: TIMEOFF_STATUS.WITHDRAWN, label: 'Withdrawn' },
];

export const DATE_FORMAT = 'MM/DD/YYYY';
