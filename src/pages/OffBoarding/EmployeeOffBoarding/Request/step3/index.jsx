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

  _renderScreen = (name) => {
    switch (name) {
      case 'Success':
        return <img src={icon2} alt="" className={styles.iconStyles} />;
      case 'done':
        return <img src={icon1} alt="" className={styles.iconStyles} />;
      default:
    }
  };

  renderNode = (item) => {
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
        {item && item.length <= 3 ? {} : <div className={styles.borderStyles} />}
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
        id: 2,
        body: '',
        status: 'Success',
        text: 'Manager Approval',
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
