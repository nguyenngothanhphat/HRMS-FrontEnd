import React, { Component } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import HollidayCalendar from './components/HollidayCalendar';
import WorkShedule from './components/WorkShedule';
import TimeoffType from './components/TimeoffType';
import ManageBalance from './components/ManageBalance';
import AssignPolicies from './components/AssignPolicy';
import TimeOffLayout from './components/TimeOffLayout';
import ScreenBegin from './components/ScreenBegin';

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
        component: <TimeoffType timeOffTypes={timeOffTypes} />,
        progress: 70,
        link: 'types-rules',
      },
      {
        id: 2,
        name: 'Employee Work Schedule',
        key: 'workShedule',
        component: <WorkShedule />,
        progress: 30,
        link: 'work-schedule',
      },
      {
        id: 3,
        name: 'Holiday Calendar',
        key: 'hollidayCalander',
        component: <HollidayCalendar />,
        progress: 10,
        link: 'holiday-calendar',
      },
      {
        id: 4,
        name: 'Manage Balances',
        key: 'manageBalances',
        component: <ManageBalance />,
        progress: 100,
        link: 'manage-balances',
      },
      {
        id: 5,
        name: 'Assign policies',
        key: 'assignPolicies',
        component: <AssignPolicies />,
        progress: 100,
        link: 'assign-policies',
      },
    ];
    return (
      <div>
        {/* {timeOffTypes.length !== 0 ? (
          <ScreenBegin handleChange={this.changePage} />
        ) : ( */}
        <TimeOffLayout listMenu={listMenu} tabName={type} />
        {/* )} */}
      </div>
    );
  }
}

export default SetupTimeoff;
