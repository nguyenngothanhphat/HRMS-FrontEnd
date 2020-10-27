/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.less';

export default class EventCalendar extends PureComponent {
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
      selectedDay: null,
    };
  }

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
    // eslint-disable-next-line no-console
    console.log('currentDate: ', dateContext.get('date'));
    return dateContext.get('date');
  };

  currentDay = () => {
    const { dateContext } = this.state;
    return dateContext.format('D');
  };

  firstDayOfMonth = () => {
    const { dateContext } = this.state;
    const firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
    return firstDay;
  };

  setMonth = (month) => {
    const { dateContext } = this.state;
    const monthNo = this.months.indexOf(month);
    let dateContext1 = { ...dateContext };
    dateContext1 = moment(dateContext1).set('month', monthNo);
    this.setState({
      dateContext: dateContext1,
    });
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

  onSelectChange = (e, data) => {
    this.setMonth(data);
    const { onMonthChange } = this.props;
    if (onMonthChange) onMonthChange();
  };

  SelectList = (props) => {
    const popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a
            href="#"
            onClick={(e) => {
              this.onSelectChange(e, data);
            }}
          >
            {data}
          </a>
        </div>
      );
    });

    return <div className="month-popup">{popup}</div>;
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
    // Map the weekdays i.e Sun, Mon, Tue etc as <td>
    const weekdays = this.weekdaysShort.map((day) => {
      return (
        <th key={day} className="week-day">
          {day}
        </th>
      );
    });

    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(<td key={i * 80} className="emptySlot" />);
    }

    console.log('blanks: ', blanks);

    const { selectedDay } = this.state;

    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      const className = d === this.currentDay() ? 'day current-day' : 'day';
      const selectedClass = d === selectedDay ? ' selected-day ' : '';
      daysInMonth.push(
        <td key={d} className={className + selectedClass}>
          <span>{d}</span>
        </td>,
      );
    }

    console.log('days: ', daysInMonth);

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
      </div>
    );
  }
}
