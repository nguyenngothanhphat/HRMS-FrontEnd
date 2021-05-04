import React, { PureComponent } from 'react';
import { Space } from 'antd';
import { formatMessage } from 'umi';
import ideaIcon from './assets/ideaIcon.svg';
import checkIcon from './assets/checkIcon.svg';
import styles from './index.less';

class CreateNewTemplateNote extends PureComponent {
  render() {
    return (
      <div className={styles.CreateNewTemplateNote}>
        <div className={styles.CreateNewTemplateNote_header}>
          <Space size="middle">
            <div className={styles.CreateNewTemplateNote_header_icons}>
              <div className={styles.outsideCircle} />
              <div className={styles.insideCircle} />
              <img src={ideaIcon} alt="icon" />
            </div>
          </Space>

          <div className={styles.CreateNewTemplateNote_header_title}>
            {formatMessage({ id: 'component.templateDetailsNote.title' })}
          </div>
        </div>
        <div className={styles.CreateNewTemplateNote_list}>
          <div className={styles.CreateNewTemplateNote_list_note}>
            <img src={checkIcon} alt="icon" />
            <div className={styles.content}>
              {formatMessage({ id: 'component.templateDetailsNote.content1' })}
            </div>
          </div>
          <div className={styles.CreateNewTemplateNote_list_note}>
            <img src={checkIcon} alt="icon" />
            <div className={styles.content}>
              {formatMessage({ id: 'component.templateDetailsNote.content2' })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNewTemplateNote;
