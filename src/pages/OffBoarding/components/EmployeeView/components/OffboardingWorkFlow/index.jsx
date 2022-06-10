import { Button, Card, Divider, Steps, notification } from 'antd';
import { history } from 'umi';
import React, { useState } from 'react';
import styles from './index.less';

const { Step } = Steps;

const steps1 = [
  {
    step: 1,
    description: 'Initiate Request',
  },
  {
    step: 2,
    description: 'Submit request',
  },
  {
    step: 3,
    description: '1-1 with your manager & their approval',
  },
  {
    step: 4,
    description: 'HR Approval',
  },
];

const steps2 = [
  {
    step: 1,
    description: 'Exit Interview & profile closure',
  },
  {
    step: 2,
    description: 'HR sends the relieving documents',
  },
  {
    step: 3,
    description: 'Termination Complete',
  },
];

const OffboardingWorkFlow = (props) => {
  const { hrManager, handleResignationRequest = () => {} } = props;
  const [current, setCurrent] = useState(0);
  const onChangeSteps = (values) => {};

  const handleResignation = () => {
    history.push('/offboarding/list/my-request/new');
  };

  return (
    <Card
      className={styles.OffboardingWorkFlow}
      title="Offboarding Workflow"
      extra={
        <Button onClick={handleResignation} className={styles.stepAction__btn}>
          Initiate resignation request
        </Button>
      }
    >
      <div className={styles.titleProcessStep}>Step 1: Offboarding</div>
      <div className={styles.offboardingProcess}>
        <div className={styles.offboardingProcess__process}>
          <Steps current={current} onChange={onChangeSteps} labelPlacement="vertical">
            {steps1.map((item) => (
              <Step key={item.step} description={item.description} />
            ))}
          </Steps>
        </div>
        <Divider />
        <div className={styles.titleProcess}>Step 2 : Relieving Formalities </div>
        <div className={styles.description}>
          (Relieving formalities will be initiated 2 days before the LWD)
        </div>
        <div className={styles.offboardingProcess__process}>
          <Steps current={current} onChange={onChangeSteps} labelPlacement="vertical">
            {steps2.map((item) => (
              <Step key={item.step} description={item.description} />
            ))}
          </Steps>
        </div>
      </div>
    </Card>
  );
};

export default OffboardingWorkFlow;
