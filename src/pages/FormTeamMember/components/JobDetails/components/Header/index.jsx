import React, { Component } from 'react';
import { Typography } from 'antd';
import styles from './index.less';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Job Detail',
      text: 'The details of the position the candidate is being recruited for',
    };
  }

  render() {
    const { title, text } = this.state;
    return (
      <div>
        <Typography level={4} className={styles.Header}>
          {title}
        </Typography>
        <Typography level={5} className={styles.HeaderText}>
          {text}
        </Typography>
      </div>
    );
  }
}

export default Header;
