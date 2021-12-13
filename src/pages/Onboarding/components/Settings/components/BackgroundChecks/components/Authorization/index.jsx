import React, { Component } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class Authorization extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.Authorization}>
        <div className={styles.Authorization_title}>
          {formatMessage({ id: 'component.authorization.title' })}
        </div>
        <div className={styles.Authorization_author}>By Eliza Roberts, Senior Manager</div>
        <a href="#" className={styles.Authorization_link}>
          {formatMessage({ id: 'component.authorization.link' })}
        </a>
      </div>
    );
  }
}

export default Authorization;
