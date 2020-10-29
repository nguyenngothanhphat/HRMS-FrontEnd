/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import EventDetailBox from './components/EventDetailBox';

import styles from './index.less';

moment.locale('en');

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
  {
    from: '11/26/2020',
    to: '11/29/2020',
    type: 'CL',
    duration: 4,
    description: 'Family Event',
  },
  {
    from: '12/8/2020',
    to: '12/10/2020',
    type: 'CL',
    duration: 3,
    description: 'Family Event',
  },
];
export default class HolidayCalendar extends PureComponent {
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
    return <span className={styles.labelMonth}>{this.month()}</span>;
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
    return <span className={styles.labelYear}>{this.year()}</span>;
  };

  renderCalendar = () => {
    const { currentMonth, currentDay, currentYear } = this.state;
    const { holidaysList = [] } = this.props;
    const daysInMonth = [];

    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      const className =
        d === currentDay * 1 &&
        currentMonth === this.selectedMonth() &&
        currentYear === this.selectedYear()
          ? `${styles.day} ${styles.currentDay}`
          : styles.day;

      let eventMarkBeginClassName = '';
      let eventMarkEndClassName = '';
      let lineClassName = '';
      let colorClassName = '';

      holidaysList.forEach((value) => {
        const { fromDate: from = '', toDate: to = '' } = value; // parse

        const eventFromDay = moment(from).format('D');
        const eventFromMonth = moment(from).format('M');
        const eventFromYear = moment(from).format('Y');
        const eventToDay = moment(to).format('D');
        const eventToMonth = moment(to).format('M');
        const eventToYear = moment(to).format('Y');
        if (
          d === eventFromDay * 1 &&
          this.selectedMonth() * 1 === eventFromMonth * 1 &&
          this.selectedYear() * 1 === eventFromYear * 1
        ) {
          if (this.checkASingleDay(d, this.selectedMonth(), this.selectedYear()) === 1) {
            colorClassName = styles.upcomingColor;
          } else colorClassName = styles.leaveTakenColor;
          eventMarkBeginClassName = styles.markEventBegin;
        }

        if (
          d === eventToDay * 1 &&
          this.selectedMonth() * 1 === eventToMonth * 1 &&
          this.selectedYear() * 1 === eventToYear * 1
        ) {
          if (this.checkASingleDay(d, this.selectedMonth(), this.selectedYear()) === 1) {
            colorClassName = styles.upcomingColor;
          } else colorClassName = styles.leaveTakenColor;
          eventMarkEndClassName = styles.markEventEnd;
        }

        if (
          d > eventFromDay * 1 &&
          d < eventToDay * 1 &&
          this.selectedYear() * 1 === eventFromYear * 1 &&
          this.selectedYear() * 1 === eventToYear * 1 &&
          this.selectedMonth() * 1 === eventFromMonth * 1 &&
          this.selectedMonth() * 1 === eventToMonth * 1
        )
          lineClassName = styles.lineClassName;
      });

      daysInMonth.push(
        <td
          key={d}
          className={`${className} ${lineClassName} ${eventMarkBeginClassName} ${eventMarkEndClassName} ${colorClassName}`}
        >
          <span>{d}</span>
        </td>,
      );
    }
    return daysInMonth;
  };

  checkASingleDay = (day, month, year) => {
    const { currentMonth, currentDay, currentYear } = this.state;
    if (
      (day > currentDay && month === currentMonth && year === currentYear) ||
      (month > currentMonth && year >= currentYear)
    ) {
      return 1; // upcoming date
    }
    return 0; // leave taken day
  };

  checkIfUpcomingOrLeaveTaken = (value) => {
    const { currentMonth, currentDay, currentYear } = this.state;
    const { fromDate: from = '', toDate: to = '' } = value; // parse

    const eventFromDay = moment(from).format('D');
    const eventFromMonth = moment(from).format('M');
    const eventFromYear = moment(from).format('Y');
    const eventToMonth = moment(to).format('M');
    if (
      (currentDay < eventFromDay * 1 &&
        this.selectedMonth() * 1 === eventFromMonth * 1 &&
        this.selectedYear() * 1 === eventFromYear * 1 &&
        currentMonth * 1 === this.selectedMonth() * 1 &&
        currentYear * 1 === this.selectedYear() * 1) ||
      (currentMonth * 1 < this.selectedMonth() * 1 &&
        eventFromMonth * 1 === this.selectedMonth() * 1 &&
        eventFromYear * 1 >= this.selectedYear() * 1)
    )
      return 1; // upcoming
    if (
      ((eventFromDay * 1 <= currentDay * 1 &&
        eventFromMonth * 1 === this.selectedMonth() * 1 &&
        currentMonth * 1 === this.selectedMonth() * 1) ||
        (eventToMonth * 1 < this.selectedMonth() * 1 &&
          eventFromMonth * 1 === this.selectedMonth() * 1)) &&
      eventFromYear * 1 === this.selectedYear() * 1
    )
      return 2; // leave taken
    return '';
  };

  renderData = (id, holidaysList) => {
    const upcomingData = [];
    const leaveTakenData = [];

    holidaysList.map((value) => {
      const check = this.checkIfUpcomingOrLeaveTaken(value);
      if (check === 1) upcomingData.push(value);
      else if (check === 2) leaveTakenData.push(value);
      return '';
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  render() {
    const { holidaysList = [] } = this.props;

    // Map the weekdays i.e Sun, Mon, Tue etc as <td>
    const weekdays = this.weekdaysShort.map((day) => {
      return (
        <th key={day} className={styles.weekDay}>
          {day.slice(0, 1)}
          {/* get first letter of weekdays */}
        </th>
      );
    });

    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(<td key={i * 80} className={styles.emptySlot} />);
    }

    const daysInMonth = this.renderCalendar();

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
      <div className={styles.HolidayCalendar}>
        <div className={styles.headerContainer}>
          <div>
            {this.MonthNav()}
            {this.YearNav()}
          </div>
          <div className={styles.changeMonthBtn}>
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
        <div className={styles.daysTable}>
          <table>
            <tr className={styles.daysInMonth}>{weekdays}</tr>
            {trElems}
          </table>
        </div>
        <div className={styles.eventDetailContainer}>
          <div className={styles.eventDetailPart}>
            <span className={styles.title}>Upcoming</span>
            {this.renderData(1, holidaysList).map((value) => (
              <EventDetailBox data={value} color={1} />
            ))}
          </div>
          <div className={styles.eventDetailPart}>
            <div className={styles.title}>Leave taken</div>
            {this.renderData(2, holidaysList).map((value) => (
              <EventDetailBox data={value} color={2} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
