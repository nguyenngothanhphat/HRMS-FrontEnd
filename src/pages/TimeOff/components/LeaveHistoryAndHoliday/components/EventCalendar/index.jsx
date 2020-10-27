import React, { PureComponent } from 'react';
import styles from './index.less';

export default class EventCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.EventCalendar}>
        <h1>Calendar</h1>
      </div>
    );
  }
}
