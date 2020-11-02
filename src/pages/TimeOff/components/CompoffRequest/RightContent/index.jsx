// import React, { Component } from 'react';
import React, { Component, Fragment } from 'react';
// import { Row, Col } from 'antd';
// import icon1 from '@/assets/workflow1.svg';
import styles from './index.less';

// const { Step } = Steps;

export class RightContet extends Component {
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
      <div className={styles.root}>
        <p className={styles.title}>Termination Workflow</p>
        <div className={styles.flex}>
          {arr1.map((item, index) => this.renderNode(item, index, arr1))}
        </div>
      </div>
    );
  }
}

export default RightContet;
