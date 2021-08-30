import React, { PureComponent } from 'react';
import { Typography } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: formatMessage({ id: 'component.jobDetail.title' }),
      text: formatMessage({ id: 'component.jobDetail.subtitle' }),
    };
  }

  render() {
    const { title, text } = this.state;
    return (
      <>
        <div className={styles.Header}>
          <Typography.Title level={4} className={styles.HeaderTitle}>
            {title}
          </Typography.Title>
          <Typography.Title level={5} className={styles.HeaderText}>
            {text}
          </Typography.Title>
        </div>
        <hr />
      </>
    );
  }
}

export default Header;
