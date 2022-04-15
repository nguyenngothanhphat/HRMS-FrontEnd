import React, { Component } from 'react';
import { connect } from 'umi';
import LayoutTimeoffSetup from '@/components/LayoutTimeoffSetup';
import AssignPolicies from './components/AssignPolicy';
import HolidayCalendar from './components/HolidayCalendar';
import ManageBalance from './components/ManageBalance';
import TimeOffType from './components/TimeOffType';
import WorkSchedule from './components/WorkSchedule';

@connect(() => ({}))
class SetupTimeoff extends Component {
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        type: {},
        selectedCountry: '',
      },
    });
  };

  render() {
    const { type = '' } = this.props;

    const listMenu = [
      {
        id: 1,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: <TimeOffType />,
        link: 'types-rules',
      },
      {
        id: 2,
        name: 'Employee Work Schedule',
        key: 'workSchedule',
        component: <WorkSchedule />,
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
    return <LayoutTimeoffSetup listMenu={listMenu} tabName={type} />;
  }
}

export default SetupTimeoff;
