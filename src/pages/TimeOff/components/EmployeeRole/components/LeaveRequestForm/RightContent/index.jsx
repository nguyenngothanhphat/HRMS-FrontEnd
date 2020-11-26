// import React, { Component } from 'react';
import React, { Component, Fragment } from 'react';
// import { Row, Col } from 'antd';
// import icon1 from '@/assets/workflow1.svg';
import styles from './index.less';

// const { Step } = Steps;

export class RightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNode = (item, index, arr) => {
    return (
      <Fragment key={item.id}>
        <div className={styles.minWidth}>
          <div className={styles.borderImage}> {item.body} </div>
          <div>{item.text}</div>
        </div>
        {index !== arr.length - 1 && <div className={styles.borderStyles} />}
      </Fragment>
    );
  };

  render() {
    const arr1 = [
      {
        id: 1,
        body: '',
        text: 'Rose Mary',
      },
      {
        id: 2,
        body: '',
        text: 'Aditya Venkatesan',
      },
      {
        id: 3,
        body: '',
        text: 'Thammu Ayappa',
      },
    ];

    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <span className={styles.title}>Note</span>
          <span className={styles.description}>
            Timeoff requests requires approvals.
            <br />
            It takes anywhere around 2-4 standard working days for the entire process to complete.
          </span>
        </div>
        <div className={styles.flex}>
          {arr1.map((item, index) => this.renderNode(item, index, arr1))}
        </div>
      </div>
    );
  }
}

export default RightContent;
