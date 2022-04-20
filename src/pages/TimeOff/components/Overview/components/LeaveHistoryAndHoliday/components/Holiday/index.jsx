import React, { PureComponent } from 'react';
import HolidayCalendar from './components/HolidayCalendar';
import HolidayList from './components/HolidayList';

class Holiday extends PureComponent {
  render() {
    const { holidaysList = [], activeShowType = 1 } = this.props;
    return (
      <div>
        {activeShowType === 1 && <HolidayList holidaysList={holidaysList} />}
        {activeShowType === 2 && <HolidayCalendar holidaysList={holidaysList} />}
      </div>
    );
  }
}
export default Holiday;
