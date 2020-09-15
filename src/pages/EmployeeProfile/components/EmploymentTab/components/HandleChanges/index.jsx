import React from 'react';
import { Steps } from 'antd';
import styles from './styles.less';

export default function HandleChanges(props) {
  const { steps, current } = props;
  const { Step } = Steps;
  return (
    <div className={styles.HandleChanges}>
      {' '}
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
    </div>
  );
}
