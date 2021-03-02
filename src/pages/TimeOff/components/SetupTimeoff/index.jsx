import React, { Component } from 'react';
import { connect } from 'umi';
import HollidayCalendar from './components/HollidayCalendar';
import WorkShedule from './components/WorkShedule';
import TimeoffType from './components/TimeoffType';
import ManageBalance from './components/ManageBalance';
import AssignPolicy from './components/AssignPolicy';
import TimeOffLayout from './components/TimeOffLayout';
import ScreenBegin from './components/ScreenBegin';

@connect()
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
    const listMenu = [
      {
        id: 1,
        name: 'Timeoff Type & Rules',
        key: 'timeoffType',
        component: <TimeoffType />,
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
        name: 'Manage Balance',
        key: 'manageBalance',
        component: <ManageBalance />,
        progress: 100,
      },
      {
        id: 5,
        name: 'Assign Policy',
        key: 'assignPolicy',
        component: <AssignPolicy />,
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
