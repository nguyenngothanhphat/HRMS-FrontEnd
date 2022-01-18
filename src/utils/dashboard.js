import previewActivity from '@/assets/dashboard/previewActivity.svg';
import previewDailyCalendar from '@/assets/dashboard/previewDailyCalendar.svg';
import previewMyapps from '@/assets/dashboard/previewMyapps.svg';
import previewTeam from '@/assets/dashboard/previewTeam.svg';
import previewTask from '@/assets/dashboard/previewTask.svg';
import previewTimesheet from '@/assets/dashboard/previewTimesheet.svg';

const WIDGET_IDS = {
  CALENDAR: 'CALENDAR',
  TASK: 'TASK',
  ACTIVITY: 'ACTIVITY',
  MYTEAM: 'MYTEAM',
  MYAPP: 'MYAPP',
  TIMESHEET: 'TIMESHEET',
};

const WIDGETS = [
  {
    id: WIDGET_IDS.CALENDAR,
    name: 'Calendar',
    description: 'Use this widget to keep a track of all your daily meetings and work',
    image: previewDailyCalendar,
  },
  {
    id: WIDGET_IDS.TASK,
    name: 'Tasks',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: previewTask,
  },
  {
    id: WIDGET_IDS.ACTIVITY,
    name: 'Activity Log',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: previewActivity,
  },
  {
    id: WIDGET_IDS.MYTEAM,
    name: 'My Team',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: previewTeam,
  },
  {
    id: WIDGET_IDS.MYAPP,
    name: 'My Apps',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: previewMyapps,
  },
  {
    id: WIDGET_IDS.TIMESHEET,
    name: 'Timesheets',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: previewTimesheet,
  },
];

const SUPPORT_TEAM = [
  {
    _id: '6153e2ecb51335302899a36f',
    name: 'HR',
    queryType: ['Policy Query', 'Leave Query', 'Other issues', 'Other Query', 'Paycheck Query'],
    value: 'HR',
  },
  {
    _id: '6155659fe19a81c65dc1b01f',
    name: 'IT',
    queryType: ['Software', 'Hardware', 'Network/Connectivity', 'Account/Permission', 'Printing'],
    value: 'IT',
  },
  {
    _id: '6155659fe19a81c65dc1b020',
    name: 'OPERATION',
    value: 'Operations & Facility management',
    queryType: [
      'Floor Issue',
      'Purchasing',
      'Late Night Transportation',
      'Late Night Food',
      'Customer Visit',
      'Machine Movement',
      'Others',
    ],
  },
];

const PRIORITY = ['Low', 'Normal', 'High', 'Urgent'];
const TIMESHEET_DATE_FORMAT = 'MM/DD/YYYY';

export { WIDGET_IDS, WIDGETS, SUPPORT_TEAM, PRIORITY, TIMESHEET_DATE_FORMAT };
