import React, { PureComponent } from 'react';
import EventIcon from '@/assets/candidatePortal/event.svg';
import styles from './index.less';

class UpcomingEvents extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <div key={index}>
        <div className={styles.eachItem}>
          <div className={styles.eventIcon}>
            <img src={EventIcon} alt="event" />
          </div>
          <div className={styles.eventContent}>
            <span>{item?.content || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && <div className={styles.divider} />}
      </div>
    );
  };

  getData = () => {
    const { events = [], sliceNumber = 0 } = this.props;
    if (sliceNumber === 0 || !sliceNumber) return events;
    return events.slice(0, sliceNumber);
  };

  render() {
    const data = this.getData();

    return (
      <div className={styles.UpcomingEvents}>
        {data.map((val, index) => this.renderItem(val, data.length, index))}
      </div>
    );
  }
}

export default UpcomingEvents;
