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
  constructor(props) {
    super(props);
    this.state = {
      start: false,
    };
  }

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

  changePage = (start) => {
    this.setState({
      start,
    });
  };

  render() {
    const { timeOffTypes, pageStart } = this.props;
    const { start } = this.state;
    const listMenu = [
      {
        id: 1,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: <TimeoffType timeOffTypes={timeOffTypes} />,
        progress: 70,
      },
      {
        id: 2,
        name: 'Employee Work Schedule',
        key: 'workShedule',
        component: <WorkShedule />,
        progress: 30,
      },
      {
        id: 3,
        name: 'Holliday Calendar',
        key: 'hollidayCalander',
        component: <HollidayCalendar />,
        progress: 10,
      },
      {
        id: 4,
        name: 'Manage Balances',
        key: 'manageBalances',
        component: <ManageBalance />,
        progress: 100,
      },
      {
        id: 5,
        name: 'Assign policies',
        key: 'assignPolicies',
        component: <AssignPolicies />,
        progress: 100,
      },
    ];
    return (
      <div>
        {/* {timeOffTypes.length !== 0 ? (
          <ScreenBegin handleChange={this.changePage} />
        ) : ( */}
        <TimeOffLayout listMenu={listMenu} />
        {/* )} */}
      </div>
    );
  }
}

export default SetupTimeoff;
