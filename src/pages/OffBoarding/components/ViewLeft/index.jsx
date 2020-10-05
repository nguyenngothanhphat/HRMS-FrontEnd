import React, { Component } from 'react';
import styles from './index.less';

export default class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={styles.root}>View Left</div>;
  }
}
