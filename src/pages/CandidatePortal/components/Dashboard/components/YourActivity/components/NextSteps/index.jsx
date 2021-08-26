import React, { PureComponent } from 'react';
import StepIcon from '@/assets/candidatePortal/nextStep.svg';
import styles from './index.less';

class NextSteps extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <>
        <div className={styles.eachItem} key={index}>
          <div className={styles.stepIcon}>
            <img src={StepIcon} alt="step" />
          </div>
          <div className={styles.stepContent}>
            <span>{item?.content || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  getData = () => {
    const { steps = [], sliceNumber = 0 } = this.props;
    if (sliceNumber === 0 || !sliceNumber) return steps;
    return steps.slice(0, sliceNumber);
  };

  render() {
    const data = this.getData();
    return (
      <div className={styles.NextSteps}>
        {data.map((val, index) => this.renderItem(val, data.length, index))}
      </div>
    );
  }
}

export default NextSteps;
