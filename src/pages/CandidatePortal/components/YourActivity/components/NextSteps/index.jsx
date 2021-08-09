import React, { PureComponent } from 'react';
import StepIcon from '@/assets/candidatePortal/nextStep.svg';
import styles from './index.less';

class NextSteps extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <>
        <div className={styles.eachItem}>
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

  render() {
    const { steps = [] } = this.props;
    return (
      <div className={styles.NextSteps}>
        {steps.map((val, index) => this.renderItem(val, steps.length, index))}
      </div>
    );
  }
}

export default NextSteps;
