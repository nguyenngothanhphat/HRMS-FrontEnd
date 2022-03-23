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
    name: 'HR',
    queryType: ['Policy Query', 'Leave Query', 'Other issues', 'Other Query', 'Paycheck Query'],
    value: 'HR',
  },
  {
    name: 'IT',
    queryType: ['Software', 'Hardware', 'Network/Connectivity', 'Account/Permission', 'Printing'],
    value: 'IT',
  },
  {
    name: 'Operations & Facility management',
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

const EMP_ROW_HEIGHT = 72;
const DEFAULT_MARGIN_CALENDAR = 8;

const CALENDAR_COLORS = {
  GREEN: {
    color: '#1ab88f',
    backgroundColor: '#f9fffe',
    borderColor: '#1ab88f',
  },
  RED: {
    color: '#fd4546',
    backgroundColor: '#fff9f9',
    borderColor: '#fd4546',
  },
  ORANGE: {
    color: '#ffa100',
    backgroundColor: '#fffdf9',
    borderColor: '#ffa100',
  },
  GRAY: {
    color: '#707177',
    backgroundColor: '#fff',
    borderColor: '#eaecef',
  },
};

export {
  WIDGET_IDS,
  WIDGETS,
  SUPPORT_TEAM,
  PRIORITY,
  TIMESHEET_DATE_FORMAT,
  EMP_ROW_HEIGHT,
  DEFAULT_MARGIN_CALENDAR,
  CALENDAR_COLORS,
};
