import React, { PureComponent } from 'react';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import HRIcon2 from '@/assets/candidatePortal/HRViolet.svg';
import HRIcon3 from '@/assets/candidatePortal/HRRed.svg';
import styles from './index.less';

const icons = [HRIcon1, HRIcon2, HRIcon3];

class Messages extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <>
        <div className={styles.eachItem}>
          <div className={styles.messageIcon}>
            <img src={icons[index % icons.length]} alt="message" />
          </div>
          <div className={styles.messageContent}>
            <span className={styles.messageTitle}>{item?.title || ''}</span>
            <span className={styles.message}>{item?.content || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  render() {
    const { messages = [] } = this.props;
    return (
      <div className={styles.Messages}>
        {messages.map((val, index) => this.renderItem(val, messages.length, index))}
      </div>
    );
  }
}

export default Messages;
