/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import EventDetailBox from './components/EventDetailBox';

import './index.less';

moment.locale('en');
moment.updateLocale('en', { weekdaysMin: 'U_M_T_W_R_F_S'.split('_') });

const leaveHistoryData = [
  {
    from: '10/4/2020',
    to: '10/5/2020',
    type: 'CL',
    duration: 1,
    description: 'Family Event',
  },
  {
    from: '10/30/2020',
    to: '10/31/2020',
    type: 'CL',
    duration: 1,
    description: 'Family Event',
  },
  {
    from: '10/27/2020',
    to: '10/29/2020',
    type: 'CL',
    duration: 3,
    description: 'Family Event',
  },
  {
    from: '11/6/2020',
    to: '11/7/2020',
    type: 'CL',
    duration: 2,
    description: 'Family Event',
  },
];
export default class LeaveHistory extends PureComponent {
  weekdays = moment.weekdays(); // ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]

  weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  months = moment.months();

  constructor(props) {
    super(props);
    this.width = props.width || '350px';
    this.style = props.style || {};
    this.style.width = this.width; // add this
    this.state = {
      dateContext: moment(),
      currentDay: 0,
      currentMonth: 0,
      currentYear: 0,
    };
  }

  componentDidMount = () => {
    const { dateContext } = this.state;
    this.setState({
      currentDay: dateContext.format('D'),
      currentMonth: dateContext.format('M'),
      currentYear: dateContext.format('Y'),
    });
  };

  year = () => {
    const { dateContext } = this.state;
    return dateContext.format('Y');
  };

  month = () => {
    const { dateContext } = this.state;
    return dateContext.format('MMMM');
  };

  daysInMonth = () => {
    const { dateContext } = this.state;
    return dateContext.daysInMonth();
  };

  currentDate = () => {
    const { dateContext } = this.state;
    return dateContext.get('date');
  };

  selectedMonth = () => {
    const { dateContext } = this.state;
    return dateContext.format('M');
  };

  selectedYear = () => {
    const { dateContext } = this.state;
    return dateContext.format('Y');
  };

  firstDayOfMonth = () => {
    const { dateContext } = this.state;
    const firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
    return firstDay;
  };

  nextMonth = () => {
    const { dateContext } = this.state;
    let dateContext1 = { ...dateContext };
    dateContext1 = moment(dateContext1).add(1, 'month');
    this.setState({
      dateContext: dateContext1,
    });
    const { onNextMonth } = this.props;
    if (onNextMonth) onNextMonth();
  };

  prevMonth = () => {
    const { dateContext } = this.state;
    let dateContext1 = { ...dateContext };
    dateContext1 = moment(dateContext1).subtract(1, 'month');
    this.setState({
      dateContext: dateContext1,
    });
    const { onPrevMonth } = this.props;
    if (onPrevMonth) onPrevMonth();
  };

  // eslint-disable-next-line no-unused-vars
  onChangeMonth = (e, month) => {};

  MonthNav = () => {
    return <span className="label-month">{this.month()}</span>;
  };

  setYear = (year) => {
    const { dateContext } = this.state;
    let dateContext1 = { ...dateContext };
    dateContext1 = moment(dateContext1).set('year', year);
    this.setState({
      dateContext: dateContext1,
    });
  };

  onYearChange = (e) => {
    this.setYear(e.target.value);
    const { onYearChange } = this.props;
    if (onYearChange) onYearChange(e, e.target.value);
  };

  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
    }
  };

  YearNav = () => {
    return <span className="label-year">{this.year()}</span>;
  };

  render() {
    const { currentMonth, currentDay, currentYear } = this.state;

    // Map the weekdays i.e Sun, Mon, Tue etc as <td>
    const weekdays = this.weekdaysShort.map((day) => {
      return (
        <th key={day} className="week-day">
          {day.slice(0, 1)}
          {/* get first letter of weekdays */}
        </th>
      );
    });

    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(<td key={i * 80} className="emptySlot" />);
    }

    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      const className =
        d === currentDay * 1 &&
        currentMonth === this.selectedMonth() &&
        currentYear === this.selectedYear()
          ? 'day current-day'
          : 'day';

      let eventMarkBeginClassName = '';
      let eventMarkEndClassName = '';
      let lineClassName = '';

      leaveHistoryData.forEach((value) => {
        const eventFromDay = moment(value.from).format('D');
        const eventFromMonth = moment(value.from).format('M');
        const eventFromYear = moment(value.from).format('Y');
        const eventToDay = moment(value.to).format('D');
        const eventToMonth = moment(value.to).format('M');
        const eventToYear = moment(value.to).format('Y');

        if (
          d === eventFromDay * 1 &&
          this.selectedMonth() === eventFromMonth &&
          this.selectedYear() === eventFromYear
        )
          eventMarkBeginClassName = ' markEventBegin ';

        if (
          d === eventToDay * 1 &&
          this.selectedMonth() === eventToMonth &&
          this.selectedYear() === eventToYear
        )
          eventMarkEndClassName = ' markEventEnd ';

        if (
          d > eventFromDay * 1 &&
          d < eventToDay &&
          this.selectedYear() === eventFromYear &&
          this.selectedYear() === eventToYear &&
          this.selectedMonth() === eventFromMonth &&
          this.selectedMonth() === eventToMonth
        )
          lineClassName = ' lineClassName ';
      });

      daysInMonth.push(
        <td
          key={d}
          className={className + lineClassName + eventMarkBeginClassName + eventMarkEndClassName}
        >
          <span>{d}</span>
        </td>,
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        const insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        const insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    const trElems = rows.map((d, i) => {
      return <tr key={`${(i + 1) * 100}`}>{d}</tr>;
    });

    return (
      <div className="EventCalendar">
        <div className="headerContainer">
          <div>
            {this.MonthNav()}
            {this.YearNav()}
          </div>
          <div className="changeMonthBtn">
            <span
              onClick={() => {
                this.prevMonth();
              }}
            >
              <LeftOutlined />
            </span>
            <span
              onClick={() => {
                this.nextMonth();
              }}
            >
              <RightOutlined />
            </span>
          </div>
        </div>
        <table className="daysTable">
          <tr className="daysInMonth">{weekdays}</tr>
          {trElems}
        </table>
        <div className="eventDetailContainer">
          <div className="eventDetailPart">
            <span className="title">Upcoming</span>
            {leaveHistoryData.map((value) => {
              const eventFromDay = moment(value.from).format('D');
              const eventFromMonth = moment(value.from).format('M');
              const eventFromYear = moment(value.from).format('Y');
              console.log('currentDay', currentDay, 'eventFromDay', eventFromDay);

              if (
                (currentDay < eventFromDay * 1 &&
                  this.selectedMonth() * 1 === eventFromMonth * 1 &&
                  this.selectedYear() * 1 === eventFromYear * 1 &&
                  currentMonth * 1 === this.selectedMonth() * 1 &&
                  currentYear * 1 === this.selectedYear() * 1) ||
                (currentMonth * 1 < this.selectedMonth() * 1 &&
                  eventFromMonth * 1 >= this.selectedMonth() * 1 &&
                  eventFromYear * 1 >= this.selectedYear() * 1)
              )
                return <EventDetailBox data={value} />;
            })}
          </div>
          <div className="eventDetailPart">
            <div className="title">Leave taken</div>
            {leaveHistoryData.map((value) => {
              const eventFromDay = moment(value.from).format('D');
              const eventFromMonth = moment(value.from).format('M');
              const eventToMonth = moment(value.to).format('M');
              const eventFromYear = moment(value.from).format('Y');
              if (
                ((eventFromDay * 1 <= currentDay * 1 &&
                  eventFromMonth * 1 === this.selectedMonth() * 1 &&
                  currentMonth * 1 === this.selectedMonth() * 1) ||
                  (eventToMonth * 1 < this.selectedMonth() * 1 &&
                    eventFromMonth * 1 === this.selectedMonth() * 1)) &&
                eventFromYear * 1 === this.selectedYear() * 1
              )
                return <EventDetailBox data={value} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}
