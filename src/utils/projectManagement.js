const PM_STATUS = {
  ENGAGING: 'Engaging',
  ACTIVE: 'Active',
  ONGOING: 'Ongoing',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Complete',
};

// show above the main list
const TYPE_LIST = [
  {
    id: 'All',
    name: 'All Projects',
  },
  {
    id: PM_STATUS.ENGAGING,
    name: 'Engaging',
  },
  {
    id: PM_STATUS.ACTIVE,
    name: 'Active',
  },
  {
    id: PM_STATUS.ONGOING,
    name: 'Ongoing',
  },
  {
    id: PM_STATUS.ON_HOLD,
    name: 'On Hold',
  },
  {
    id: PM_STATUS.COMPLETED,
    name: 'Completed',
  },
];

// export const TAGS_DEFAULT = ['Design', 'Development', 'Frontend', 'Backend', 'DevOps', 'Security', 'Infrastructure', 'ReactJS', 'NodeJS']
// export const DOCUMENT_TYPES = ['NDA', 'MSA', 'SOW', 'PO', 'OTHER']
// export const PROJECT_TYPES = ['T&M', 'Fixed Bid', 'Retainer', 'Staff Augmentation', 'JV', 'Internal']

export { PM_STATUS, TYPE_LIST };
