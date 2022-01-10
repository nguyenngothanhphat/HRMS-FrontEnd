import calendar from  '@/assets/dashboard/calendar-preview.svg'
import tasks from  '@/assets/dashboard/tasks-preview.svg'
import activitylog from  '@/assets/dashboard/activity-log-preview.svg'
import myteam from  '@/assets/dashboard/myteam-preview.svg'
import myapps from  '@/assets/dashboard/myapps-preview.svg'
import timesheetpreview from  '@/assets/dashboard/timesheet-preview.svg'

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
    image: calendar
  },
  {
    id: WIDGET_IDS.TASK,
    name: 'Tasks',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: tasks
  },
  {
    id: WIDGET_IDS.ACTIVITY,
    name: 'Activity Log',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image:activitylog
  },
  {
    id: WIDGET_IDS.MYTEAM,
    name: 'My Team',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: myteam
  },
  {
    id: WIDGET_IDS.MYAPP,
    name: 'My Apps',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: myapps
  },
  {
    id: WIDGET_IDS.TIMESHEET,
    name: 'Timesheets',
    description: 'Use this widget to keep a track of all your daily tasks and projects',
    image: timesheetpreview
  },
];

const SUPPORT_TEAM = [
  {
    _id: '6153e2ecb51335302899a36f',
    name: 'HR',
    queryType: ['Policy Query', 'Leave Query', 'Other issues', 'Other Query', 'Paycheck Query'],
  },
  {
    _id: '6155659fe19a81c65dc1b01f',
    name: 'IT',
    queryType: ['Software', 'Hardware', 'Network/Connectivity', 'Account/Permission', 'Printing'],
  },
  {
    _id: '6155659fe19a81c65dc1b020',
    name: 'OPERATION',
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
