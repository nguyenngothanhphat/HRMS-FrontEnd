import React, { PureComponent } from 'react';
import {
  addMonths,
  subMonths,
  format,
  startOfWeek,
  isSameDay,
  parse,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
} from 'date-fns';
import styles from './index.less';

export default class EventCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
    };
  }

  onDateClick = (day) => {
    this.setState({
      selectedDate: day,
    });
  };

  nextMonth = () => {
    const { currentMonth } = this.state;
    this.setState({
      currentMonth: addMonths(currentMonth, 1),
    });
  };

  prevMonth = () => {
    const { currentMonth } = this.state;
    this.setState({
      currentMonth: subMonths(currentMonth, 1),
    });
  };

  renderHeader() {
    const dateFormat = 'MMMM yyyy';
    const { currentMonth } = this.state;
    return (
      <div className={styles.renderHeader}>
        <div className={styles.monthLabel}>
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className={styles.monthNavigation}>
          <div className={styles.icon} onClick={this.prevMonth}>
            {`<`}
          </div>
          <div className={styles.icon} onClick={this.nextMonth}>{`>`}</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const { currentMonth } = this.state;
    const dateFormat = 'dddd';
    const days = [];

    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i += 1) {
      days.push(
        <div className={`${styles.col} ${styles.colCenter}`} key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }

    return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day}
            onClick={() => this.onDateClick(parse(cloneDay))}
          >
            <span className={styles.number}>{formattedDate}</span>
            <span className={styles.bg}>{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.row} key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className={styles.body}>{rows}</div>;
  }

  render() {
    return (
      <div className={styles.EventCalendar}>
        <div className={styles.calendar}>
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
      </div>
    );
  }
}
