import React, { Component, Fragment } from 'react';
import icon1 from '@/assets/exclamation.svg';
import icon2 from '@/assets/check-true.svg';
import styles from './index.less';

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
          <div className={!item.noteStep ? styles.borderImage : styles.borderSuccess}>
            {item.body}
            {this._renderScreen(item.status)}
          </div>
          <div style={{ maxWidth: '40px' }}>{item.text}</div>
        </div>
        {index !== arr.length - 1 && <div className={styles.borderStyles} />}
      </Fragment>
    );
  };

  render() {
    const { approvalStep, nameManager } = this.props;
    const arr1 = [
      {
        id: 1,
        noteStep: approvalStep > 0,
        status: approvalStep > 0 ? 'Success' : 'done',
        text: nameManager,
      },
      {
        id: 1,
        noteStep: approvalStep > 1,
        status: approvalStep > 1 ? 'Success' : 'done',
        text: 'HR Manager',
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
