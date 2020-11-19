// import React, { Component } from 'react';
import React, { Component, Fragment } from 'react';
// import { Row, Col } from 'antd';
import styles from './index.less';

// const { Step } = Steps;

export class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line consistent-return

  renderNode = (item) => {
    return (
      <Fragment key={item.id}>
        <div className={styles.minWidth}>
          <div className={styles.borderImage}>{item.body}</div>
          <div>{item.text}</div>
        </div>
        <div className={styles.borderStyles} />
      </Fragment>
    );
  };

  render() {
    const arr1 = [
      {
        id: 1,
        body: '',
        text: 'Request Sent',
      },
      {
        id: 2,
        status: 'done',
        text: 'Manager Approval',
      },

      {
        id: 2,
        body: '',
        status: 'Success',
        text: 'HR Approval',
      },
    ];

    return (
      <div className={styles.root}>
        <p className={styles.title}>Termination Workflow</p>
        <div className={styles.flex}>{arr1.map((item) => this.renderNode(item))}</div>
      </div>
    );
  }
}

export default Step3;
