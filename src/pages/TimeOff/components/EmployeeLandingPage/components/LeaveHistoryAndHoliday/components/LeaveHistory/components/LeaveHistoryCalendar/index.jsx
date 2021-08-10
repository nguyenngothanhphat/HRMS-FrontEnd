/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import EventDetailBox from './EventDetailBox';

import styles from './index.less';

moment.locale('en');

export default class LeaveHistoryCalendar extends PureComponent {
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
    // const { currentMonth, currentDay, currentYear } = this.state;
    const { leavingList = [] } = this.props;
    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      const className = `${styles.day}`;
      // const currentDayClassName =
      //   d === currentDay * 1 &&
      //   currentMonth === this.selectedMonth() &&
      //   currentYear === this.selectedYear()
      //     ? `${styles.currentDay}`
      //     : '';

      let eventMarkBeginClassName = '';
      let colorClassName = '';
      let eventMarkSingleClassName = '';
      const weekDayCheckClassName = '';
      let activeClassName = '';

      leavingList.forEach((value) => {
        const { fromDate: from = '', toDate: to = '', status = '' } = value;
        const eventFromDay = moment(from).format('D');
        const eventFromMonth = moment(from).format('M');
        const eventFromYear = moment(from).format('Y');
        const eventToDay = moment(to).format('D');
        const eventToMonth = moment(to).format('M');
        const eventToYear = moment(to).format('Y');

        const checkStatus = (statusName) => {
          if (statusName === TIMEOFF_STATUS.accepted) {
            colorClassName = styles.accepted;
          } else if (statusName === TIMEOFF_STATUS.rejected) {
            colorClassName = styles.rejected;
          } else if (
            statusName === TIMEOFF_STATUS.inProgress ||
            statusName === TIMEOFF_STATUS.inProgressNext
          ) {
            colorClassName = styles.applied;
          } else colorClassName = styles.allLeaves;
        };

        if (
          d === eventFromDay * 1 &&
          d === eventToDay * 1 &&
          eventFromMonth * 1 === eventToMonth * 1 &&
          eventFromYear * 1 === eventToYear * 1 &&
          eventFromMonth * 1 === this.selectedMonth() * 1 &&
          eventFromYear * 1 === this.selectedYear() * 1
        ) {
          checkStatus(status); // check status to change color of the dots

          eventMarkSingleClassName = styles.eventMarkSingleClassName;
          activeClassName = styles.activeDate;
        } else if (
          d === eventFromDay * 1 &&
          this.selectedMonth() * 1 === eventFromMonth * 1 &&
          this.selectedYear() * 1 === eventFromYear * 1
        ) {
          checkStatus(status);

          eventMarkBeginClassName = styles.markEventBegin;
          activeClassName = styles.activeDate;
        }
      });

      daysInMonth.push(
        <td
          key={d}
          className={`${className} ${eventMarkSingleClassName} ${eventMarkBeginClassName} ${colorClassName} `}
        >
          <div className={activeClassName}>
            <span className={`${weekDayCheckClassName}`}>{d}</span>
          </div>
        </td>,
      );
    }
    return daysInMonth;
  };
  // renderCalendar = () => {
  //   const { currentMonth, currentDay, currentYear } = this.state;
  //   const { leavingList = [] } = this.props;
  //   const daysInMonth = [];
  //   for (let d = 1; d <= this.daysInMonth(); d += 1) {
  //     const className = `${styles.day}`;
  //     const currentDayClassName =
  //       d === currentDay * 1 &&
  //       currentMonth === this.selectedMonth() &&
  //       currentYear === this.selectedYear()
  //         ? `${styles.currentDay}`
  //         : '';

  //     let eventMarkBeginClassName = '';
  //     let eventMarkEndClassName = '';
  //     let lineClassName = '';
  //     let colorClassName = '';
  //     let eventMarkSingleClassName = '';
  //     const weekDayCheckClassName = '';

  //     leavingList.forEach((value) => {
  //       const { fromDate: from = '', toDate: to = '' } = value;
  //       const eventFromDay = moment(from).format('D');
  //       const eventFromMonth = moment(from).format('M');
  //       const eventFromYear = moment(from).format('Y');
  //       const eventToDay = moment(to).format('D');
  //       const eventToMonth = moment(to).format('M');
  //       const eventToYear = moment(to).format('Y');

  //       if (
  //         d === eventFromDay * 1 &&
  //         d === eventToDay * 1 &&
  //         eventFromMonth * 1 === eventToMonth * 1 &&
  //         eventFromYear * 1 === eventToYear * 1 &&
  //         eventFromMonth * 1 === this.selectedMonth() * 1 &&
  //         eventFromYear * 1 === this.selectedYear() * 1
  //       ) {
  //         if (this.checkASingleDay(d, this.selectedMonth(), this.selectedYear()) === 1) {
  //           colorClassName = styles.upcomingColor;
  //         } else colorClassName = styles.leaveTakenColor;

  //         // eslint-disable-next-line prefer-destructuring
  //         eventMarkSingleClassName = styles.eventMarkSingleClassName;
  //       } else {
  //         if (
  //           d === eventFromDay * 1 &&
  //           this.selectedMonth() * 1 === eventFromMonth * 1 &&
  //           this.selectedYear() * 1 === eventFromYear * 1
  //         ) {
  //           if (this.checkASingleDay(d, this.selectedMonth(), this.selectedYear()) === 1) {
  //             colorClassName = styles.upcomingColor;
  //           } else colorClassName = styles.leaveTakenColor;
  //           eventMarkBeginClassName = styles.markEventBegin;
  //         }

  //         if (
  //           d === eventToDay * 1 &&
  //           this.selectedMonth() * 1 === eventToMonth * 1 &&
  //           this.selectedYear() * 1 === eventToYear * 1
  //         ) {
  //           if (this.checkASingleDay(d, this.selectedMonth(), this.selectedYear()) === 1) {
  //             colorClassName = styles.upcomingColor;
  //           } else colorClassName = styles.leaveTakenColor;
  //           eventMarkEndClassName = styles.markEventEnd;
  //         }

  //         if (
  //           d > eventFromDay * 1 &&
  //           d < eventToDay * 1 &&
  //           this.selectedYear() * 1 === eventFromYear * 1 &&
  //           this.selectedYear() * 1 === eventToYear * 1 &&
  //           this.selectedMonth() * 1 === eventFromMonth * 1 &&
  //           this.selectedMonth() * 1 === eventToMonth * 1
  //         )
  //           // eslint-disable-next-line prefer-destructuring
  //           lineClassName = styles.lineClassName;
  //       }
  //     });

  //     daysInMonth.push(
  //       <td
  //         key={d}
  //         className={`${className} ${eventMarkSingleClassName} ${lineClassName} ${eventMarkBeginClassName} ${eventMarkEndClassName} ${colorClassName} `}
  //       >
  //         <span className={`${weekDayCheckClassName} ${currentDayClassName}`}>{d}</span>
  //       </td>,
  //     );
  //   }
  //   return daysInMonth;
  // };

  checkASingleDay = (day, month, year) => {
    const { currentMonth, currentDay, currentYear } = this.state;
    if (
      (day * 1 > currentDay * 1 &&
        month * 1 === currentMonth * 1 &&
        year * 1 === currentYear * 1) ||
      (month * 1 > currentMonth * 1 && year * 1 === currentYear * 1) ||
      year * 1 > currentYear * 1
    ) {
      return 1; // upcoming date
    }
    return 0; // leave taken day
  };

  checkWeekDay = (day, month, year) => {
    const weekDayName = moment(`${month * 1}/${day * 1}/${year * 1}`).format('ddd');
    return weekDayName;
  };

  checkIfUpcomingOrLeaveTaken = (value) => {
    const { fromDate: from = '' } = value;

    const eventFromDay = moment(from).format('D');
    const eventFromMonth = moment(from).format('M');
    const eventFromYear = moment(from).format('Y');
    // const eventToMonth = moment(to).format('M');
    if (this.checkASingleDay(eventFromDay, eventFromMonth, eventFromYear) === 1) return 1; // upcoming

    return 2; // leave taken
  };

  renderData = (id) => {
    const upcomingData = [];
    const leaveTakenData = [];
    const { leavingList = [] } = this.props;
    leavingList.map((value) => {
      const check = this.checkIfUpcomingOrLeaveTaken(value);
      if (check === 1) upcomingData.push(value);
      else if (check === 2) leaveTakenData.push(value);
      return '';
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  render() {
    // Map the weekdays i.e Sun, Mon, Tue etc as <td>
    const weekdays = this.weekdaysShort.map((day) => {
      return (
        <th key={day} className={`${styles.weekDay}`}>
          {day.slice(0, 2)}
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
      <div className={styles.LeaveHistoryCalendar}>
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
            <div className={styles.eventsContainer}>
              {this.renderData(1).map((value) => (
                <EventDetailBox data={value} color={1} />
              ))}
            </div>
          </div>
          <div className={styles.eventDetailPart}>
            <div className={styles.title}>Leave taken</div>
            <div className={styles.eventsContainer}>
              {this.renderData(2).map((value) => (
                <EventDetailBox data={value} color={2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
