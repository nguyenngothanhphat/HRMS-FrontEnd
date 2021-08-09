import React, { PureComponent } from 'react';
import EventIcon from '@/assets/candidatePortal/event.svg';
import styles from './index.less';

class UpcomingEvents extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <>
        <div className={styles.eachItem}>
          <div className={styles.eventIcon}>
            <img src={EventIcon} alt="event" />
          </div>
          <div className={styles.eventContent}>
            <span>{item?.content || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  render() {
    const { events = [] } = this.props;
    return (
      <div className={styles.UpcomingEvents}>
        {events.map((val, index) => this.renderItem(val, events.length, index))}
      </div>
    );
  }
}

export default UpcomingEvents;
