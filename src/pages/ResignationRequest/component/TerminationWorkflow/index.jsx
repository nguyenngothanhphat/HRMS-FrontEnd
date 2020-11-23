import React, { Component, Fragment } from 'react';
import styles from './index.less';

export class TerminationWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNode = (item) => {
    return (
      <Fragment key={item.id}>
        <div className={styles.minWidth}>
          <div className={styles.borderImage}> {item.body} </div>
          <div>{item.text}</div>
        </div>
        <div className={styles.borderStyles} />
      </Fragment>
    );
  };

  render() {
    const arr2 = [
      {
        id: 4,
        body: 5,
        text: 'ExitInterview',
      },
      {
        id: 5,
        body: 4,
        text: 'Termination Complete',
      },
    ];

    const arr1 = [
      {
        id: 1,
        body: 1,
        text: 'Request Sent',
      },
      {
        id: 2,
        body: 2,
        text: 'Manager Approval',
      },
      {
        id: 3,
        body: 3,
        text: 'HR Approval',
      },
      {
        id: 4,
        body: 4,
        text: 'LWD Generated',
      },
    ];

    return (
      <div className={styles.root}>
        <p className={styles.title}>Termination Workflow</p>
        <div className={styles.flex}>{arr1.map((item) => this.renderNode(item))}</div>
        <div className={styles.flex_end}>
          <div className={styles.flex_data}>{arr2.map((item) => this.renderNode(item))}</div>
        </div>
      </div>
    );
  }
}

export default TerminationWorkflow;
