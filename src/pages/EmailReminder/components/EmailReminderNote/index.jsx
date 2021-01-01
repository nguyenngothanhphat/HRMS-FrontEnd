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
        `${formatMessage({ id: 'component.emailReminderNote.note1' })}`,
        `${formatMessage({ id: 'component.emailReminderNote.note2' })}`,
        `${formatMessage({ id: 'component.emailReminderNote.note3' })}`,
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

          <div className={styles.EmailReminderNote_header_title}>
            {formatMessage({ id: 'component.emailReminderNote.title' })}
          </div>
        </div>
        <div className={styles.EmailReminderNote_list}>
          {notes.map((note, index) => {
            return (
              <div className={styles.EmailReminderNote_list_note} key={`${index + 1}`}>
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
