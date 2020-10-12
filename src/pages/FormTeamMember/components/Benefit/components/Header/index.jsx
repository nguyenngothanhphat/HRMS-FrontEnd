import React, { PureComponent } from 'react';
import { Typography } from 'antd';
import styles from './index.less';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Benefits',
      text: 'The list of benefits the candidate is eligible for is populated below',
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
