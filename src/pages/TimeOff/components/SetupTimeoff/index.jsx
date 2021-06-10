import React, { Component } from 'react';
import { connect } from 'umi';
import HollidayCalendar from './components/HollidayCalendar';
import WorkShedule from './components/WorkShedule';
import TimeoffType from './components/TimeoffType';
import ManageBalance from './components/ManageBalance';
import AssignPolicies from './components/AssignPolicy';
import TimeOffLayout from './components/TimeOffLayout';
import ScreenBegin from './components/ScreenBegin';
import { getCurrentTenant } from '@/utils/authority';

@connect(({ timeOff: { timeOffTypes = [] } = {} }) => ({
  timeOffTypes,
}))
class SetupTimeoff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStart: true,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/getCountryList',
    });
  };

  changePage = () => {
    const { pageStart } = this.state;
    this.setState({
      pageStart: !pageStart,
    });
  };

  render() {
    const { pageStart } = this.state;
    const { timeOffTypes } = this.props;
    const listMenu = [
      {
        id: 1,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: (
          <TimeoffType
            timeOffTypes={timeOffTypes}
            onGetDataById={this.onGetDataById}
            itemTimeOffType={itemTimeOffType ? itemTimeOffType : {}}
          />
        ),
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
        {pageStart ? (
          <ScreenBegin handleChange={this.changePage} />
        ) : (
          <TimeOffLayout listMenu={listMenu} />
        )}
      </div>
    );
  }
}

export default SetupTimeoff;
