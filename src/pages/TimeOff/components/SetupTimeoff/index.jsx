import React, { Component } from 'react';
import HollidayCalendar from './components/HollidayCalendar';
import WorkShedule from './components/WorkShedule';
import TimeoffType from './components/TimeoffType';
import ManageBalance from './components/ManageBalance';
import AssignPolicy from './components/AssignPolicy';
import TimeOffLayout from './components/TimeOffLayout';

class SetupTimeoff extends Component {
  onChange = () => {};

  render() {
    const listMenu = [
      {
        id: 1,
        name: 'Holliday Calendar',
        key: 'hollidayCalander',
        component: <HollidayCalendar />,
      },
      {
        id: 2,
        name: 'Employee Work Schedule',
        key: 'workShedule',
        component: <WorkShedule />,
      },
      {
        id: 3,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: <TimeoffType />,
      },
      {
        id: 4,
        name: 'Manage Balance',
        key: 'manageBalance',
        component: <ManageBalance />,
      },
      {
        id: 5,
        name: 'Assign Policy',
        key: 'assignPolicy',
        component: <AssignPolicy />,
      },
    ];
    return (
      <div>
        <TimeOffLayout listMenu={listMenu} />
      </div>
    );
  }
}

export default SetupTimeoff;
