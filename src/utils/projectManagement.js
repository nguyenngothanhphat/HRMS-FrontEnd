const PROJECT_STATUSES = ['Engaging', 'Active', 'On Hold', 'Complete'];

const PM_STATUS = {
  ENGAGING: 'Engaging',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Complete',
};

const TYPE_LIST = [
  {
    id: 'All',
    name: 'All Projects',
  },
  {
    id: PM_STATUS.ENGAGING,
    name: 'Upcoming',
  },
  {
    id: PM_STATUS.ACTIVE,
    name: 'In Progress',
  },
  {
    id: PM_STATUS.COMPLETED,
    name: 'Completed',
  },
];

// export const TAGS_DEFAULT = ['Design', 'Development', 'Frontend', 'Backend', 'DevOps', 'Security', 'Infrastructure', 'ReactJS', 'NodeJS']
// export const DOCUMENT_TYPES = ['NDA', 'MSA', 'SOW', 'PO', 'OTHER']
// export const PROJECT_TYPES = ['T&M', 'Fixed Bid', 'Retainer', 'Staff Augmentation', 'JV', 'Internal']

export { PM_STATUS, TYPE_LIST, PROJECT_STATUSES };
