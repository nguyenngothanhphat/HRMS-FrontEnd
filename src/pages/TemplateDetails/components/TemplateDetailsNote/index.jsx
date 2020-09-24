import React, { PureComponent } from 'react';
import { Space } from 'antd';

import ideaIcon from './assets/ideaIcon.svg';
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
        {/* <div className={styles.TemplateDetailsNote_list}></div> */}
      </div>
    );
  }
}

export default TemplateDetailsNote;
