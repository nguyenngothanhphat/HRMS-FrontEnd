import React, { Component } from 'react';
import { Typography } from 'antd';
import styles from './index.less';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Job Details ',
      text: 'The details of the position the candidate is being recruited for',
    };
  }

  render() {
    const { title, text } = this.state;
    return (
      <div className={styles.Header}>
        <Typography.Title level={4} className={styles.HeaderTitle}>
          {title}
        </Typography.Title>
        <Typography.Title level={5} className={styles.HeaderText}>
          {text}
        </Typography.Title>
      </div>
    );
  }
}

export default Header;
