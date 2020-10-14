import React, { Component } from 'react';
import { Space } from 'antd';
import { formatMessage } from 'umi';
import ideaIcon from './assets/ideaIcon.svg';
import checkIcon from './assets/checkIcon.svg';
import styles from './index.less';

class EmailReminderNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        'Custom Email messages are a great way to recognize important dates and milestones.',
        'For example, you can remind managers of their team members’ start dates or create remainders for events, like license renewals or 30 day check-ins. ',
        'You can use the Auto Text feature to generate personalized emails from a template.',
      ],
    };
  }

  render() {
    const { notes } = this.state;
    return (
      <div className={styles.EmailReminderNote}>
        <div className={styles.EmailReminderNote_header}>
          <Space size="middle">
            <div className={styles.EmailReminderNote_header_icons}>
              <div className={styles.outsideCircle} />
              <div className={styles.insideCircle} />
              <img src={ideaIcon} alt="icon" />
            </div>
          </Space>

          <div className={styles.EmailReminderNote_header_title}>Note</div>
        </div>
        <div className={styles.EmailReminderNote_list}>
          {notes.map((note) => {
            return (
              <div className={styles.EmailReminderNote_list_note}>
                <img src={checkIcon} alt="icon" />
                <div className={styles.content}>{note}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default EmailReminderNote;
