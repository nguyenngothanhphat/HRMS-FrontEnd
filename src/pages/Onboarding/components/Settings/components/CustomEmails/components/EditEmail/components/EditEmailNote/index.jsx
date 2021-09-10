import React, { Component } from 'react';
import { Space } from 'antd';
import { formatMessage } from 'umi';
import ideaIcon from './assets/ideaIcon.svg';
import checkIcon from './assets/checkIcon.svg';
import styles from './index.less';

class EditEmailNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        `${formatMessage({ id: 'component.editEmailNote.note1' })}`,
        `${formatMessage({ id: 'component.editEmailNote.note2' })}`,
        `${formatMessage({ id: 'component.editEmailNote.note3' })}`,
      ],
    };
  }

  render() {
    const { notes } = this.state;
    return (
      <div className={styles.EditEmailNote}>
        <div className={styles.EditEmailNote_header}>
          <Space size="middle">
            <div className={styles.EditEmailNote_header_icons}>
              <div className={styles.outsideCircle} />
              <div className={styles.insideCircle} />
              <img src={ideaIcon} alt="icon" />
            </div>
          </Space>

          <div className={styles.EditEmailNote_header_title}>
            {formatMessage({ id: 'component.editEmailNote.title' })}
          </div>
        </div>
        <div className={styles.EditEmailNote_list}>
          {notes.map((note) => {
            return (
              <div className={styles.EditEmailNote_list_note}>
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

export default EditEmailNote;
