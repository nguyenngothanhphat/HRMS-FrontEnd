import React, { PureComponent } from 'react';
import Calendar from 'react-calendar';
import styles from './index.less';

export default class EventCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.EventCalendar}>
        <Calendar allowPartialRange />
      </div>
    );
  }
}
