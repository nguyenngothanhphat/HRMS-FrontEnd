// import React, { Component } from 'react';
import React, { Component, Fragment } from 'react';
// import { Row, Col } from 'antd';
import icon1 from '@/assets/exclamation.svg';
import icon2 from '@/assets/check-true.svg';
import styles from './index.less';

// const { Step } = Steps;

export class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line consistent-return
  _renderScreen = (name) => {
    switch (name) {
      case 'Success':
        return <img src={icon2} alt="" className={styles.iconStyles} />;
      case 'done':
        return <img src={icon1} alt="" className={styles.iconStyles} />;
      default:
    }
  };

  renderNode = (item, index, arr) => {
    return (
      <Fragment key={item.id}>
        <div className={styles.minWidth}>
          <div className={item.id === 1 ? styles.borderImage : styles.borderSuccess}>
            {item.body}
            {/* <img src={icon2} alt="" className={styles.iconStyles} /> */}
            {this._renderScreen(item.status)}
          </div>
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
        success: true,
        body: '',
        status: 'done',
        text: 'Request Sent',
      },
      {
        id: 1,
        success: true,
        body: '',
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
        <div className={styles.flex}>
          {arr1.map((item, index) => this.renderNode(item, index, arr1))}
        </div>
      </div>
    );
  }
}

export default Step3;
