import React, { Component } from 'react';
import { connect } from 'umi';
import AssignPolicies from './components/AssignPolicy';
import HolidayCalendar from './components/HolidayCalendar';
import ManageBalance from './components/ManageBalance';
import TimeOffLayout from './components/TimeOffLayout';
import TimeOffType from './components/TimeOffType';
import WorkSchedule from './components/WorkSchedule';

@connect(({ timeOff: { timeOffTypes = [], pageStart } = {} }) => ({
  timeOffTypes,
  pageStart,
}))
class SetupTimeoff extends Component {
  componentDidMount = () => {};

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        type: {},
        countrySelected: '',
      },
    });
  };

  render() {
    const { timeOffTypes, type = '' } = this.props;

    const listMenu = [
      {
        id: 1,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: <TimeOffType timeOffTypes={timeOffTypes} />,
        progress: 70,
        link: 'types-rules',
      },
      {
        id: 2,
        name: 'Employee Work Schedule',
        key: 'workSchedule',
        component: <WorkSchedule />,
        progress: 30,
        link: 'work-schedule',
      },
      {
        id: 3,
        name: 'Holiday Calendar',
        key: 'holidayCalendar',
        component: <HolidayCalendar />,
        link: 'holiday-calendar',
      },
      {
        id: 4,
        name: 'Manage Balances',
        key: 'manageBalances',
        component: <ManageBalance />,
        link: 'manage-balances',
      },
      {
        id: 5,
        name: 'Assign policies',
        key: 'assignPolicies',
        component: <AssignPolicies />,
        link: 'assign-policies',
      },
    ];
    return <TimeOffLayout listMenu={listMenu} tabName={type} />;
  }
}

export default SetupTimeoff;
