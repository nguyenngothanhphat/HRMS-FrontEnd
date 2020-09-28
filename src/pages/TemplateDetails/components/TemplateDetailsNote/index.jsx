import React, { PureComponent } from 'react';
import { Space } from 'antd';

import ideaIcon from './assets/ideaIcon.svg';
import checkIcon from './assets/checkIcon.svg';
import styles from './index.less';

class TemplateDetailsNote extends PureComponent {
  render() {
    return (
      <div className={styles.TemplateDetailsNote}>
        <div className={styles.TemplateDetailsNote_header}>
          <Space size="middle">
            <div className={styles.TemplateDetailsNote_header_icons}>
              <div className={styles.outsideCircle} />
              <div className={styles.insideCircle} />
              <img src={ideaIcon} alt="icon" />
            </div>
          </Space>

          <div className={styles.TemplateDetailsNote_header_title}>Did you know?</div>
        </div>
        <div className={styles.TemplateDetailsNote_list}>
          <div className={styles.TemplateDetailsNote_list_note}>
            <img src={checkIcon} alt="icon" />
            <div className={styles.content}>
              You can now download the template, edit it and upload the contents to save time.
            </div>
          </div>
          <div className={styles.TemplateDetailsNote_list_note}>
            <img src={checkIcon} alt="icon" />
            <div className={styles.content}>
              Create your own directory to Auto-fill names for On-boarding candidates and Auto-fill
              words for quick-fill.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateDetailsNote;
