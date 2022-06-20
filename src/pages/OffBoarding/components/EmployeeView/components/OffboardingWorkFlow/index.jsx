import { Button, Card, Divider, Steps } from 'antd';
import { history } from 'umi';
import React from 'react';
import styles from './index.less';
import { OFFBOARDING } from '@/utils/offboarding';

const { Step } = Steps;
const { STEP } = OFFBOARDING;
const current = 0;

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
  const { data: { status = '', step = '' } = {} } = props;

  const handleResignation = () => {
    history.push('/offboarding/my-request/new');
  };

  const renderCurrentStep = (stepProps) => {
    switch (stepProps) {
      case STEP.INIT_REQUEST:
        return 0;
      case STEP.SUBMIT_REQUEST: {
        return 1;
      }
      case STEP.VS_MANAGER:
        return 2;
      case STEP.APPROVE:
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Card
      className={styles.OffboardingWorkFlow}
      title="Offboarding Workflow"
      extra={
        !status ? (
          <Button onClick={handleResignation} className={styles.stepAction__btn}>
            Initiate resignation request
          </Button>
        ) : (
          ''
        )
      }
    >
      <div className={styles.container}>
        <div className={styles.titleProcessStep}>Step 1: Offboarding</div>
        <div className={styles.offboardingProcess}>
          <div className={styles.offboardingProcess__process}>
            <Steps current={renderCurrentStep(step)} labelPlacement="vertical">
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
            <Steps current={current} labelPlacement="vertical">
              {steps2.map((item) => (
                <Step key={item.step} description={item.description} />
              ))}
            </Steps>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OffboardingWorkFlow;
