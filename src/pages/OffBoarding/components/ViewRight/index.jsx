import React, { Component } from 'react';
import styles from './index.less';

export default class ViewRight extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={styles.root}>View Right</div>;
  }
}
