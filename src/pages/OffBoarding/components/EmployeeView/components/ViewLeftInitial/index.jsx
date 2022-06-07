import React, { useState } from 'react';
import { Button, Steps, Row, Col, notification } from 'antd';
import { history } from 'umi';
import ViewDocumentModal from '../ViewDocumentModal';
import styles from './index.less';

const { Step } = Steps;

const steps = [
  {
    step: 1,
    description: 'Begin the process',
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
  {
    step: 5,
    description: '2 days before LWD, Relieving formalities initiated',
  },
  {
    step: 6,
    description: 'Exit Interview & profile closure',
  },
  {
    step: 7,
    description: 'Send relieving documents',
  },
  {
    step: 8,
    description: 'Termination Complete',
  },
];

const ViewLeftInitial = (props) => {
  const {
    hrManager,
    employee: { managerInfo: { generalInfoInfo: { legalName: managerName = '' } = {} } = {} } = {},
  } = props;
  // const [current, setCurrent] = useState(0);
  // const [viewDocumentModal, setViewDocumentModal] = useState(false);

  // const onChangeSteps = (values) => {};

  // const onCancel = () => {
  //   setViewDocumentModal(false);
  // };

  // const onLinkClick = () => {
  //   setViewDocumentModal(false);
  // };

  // const handleResignRequest = () => {
  //   if (hrManager !== null) {
  //     history.push('/offboarding/list/my-request/new');
  //   } else {
  //     notification.error({
  //       message: 'Notification',
  //       description:
  //         'Can not start your Resignation request because your HR Manager does not existed!',
  //     });
  //   }
  // };

  return (
    <div className={styles.Container}>
      <Row className={styles.header} justify="space-between">
        <Col span={24} className={styles.headerSchedule}>
          <div className={styles.headerSchedule__title}>Did you know?</div>
          <div className={styles.container__content}>
            <div className={styles.headerSchedule__content}>
              Your Manager,
              <span className={styles.headerSchedule__content__managerName}> {managerName}</span>,
              usually conducts 1-on-1s and you can speak anything to him.{' '}
              <p style={{ fontWeight: 600, color: '#161c29', marginBottom: '0' }}>
                8/10 employees have changed their mind after talking to their manager.
              </p>
              <p>Schedule a meeting now!</p>
            </div>
            <div>
              <Button>Schedule 1-on-1</Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* <div className={styles.titleProcess}>
        However, if you have made your mind. We respect that as well.
      </div>
      <div className={styles.offboardingProcess}>
        <div className={styles.offboardingProcess__subtitle}>
          Our offboarding process at a glance
        </div>
        <div className={styles.offboardingProcess__process}>
          <Steps current={current} onChange={onChangeSteps} labelPlacement="vertical">
            {steps.map((item) => (
              <Step key={item.step} description={item.description} />
            ))}
          </Steps>
        </div>
      </div>

      <div className={styles.stepAction}>
        <div className={styles.stepAction__text} onClick={onLinkClick}>
          Learn more about offboarding policy
        </div>
        <Button onClick={handleResignRequest} className={styles.stepAction__btn}>
          Initiate resignation request
        </Button>
      </div>
      <ViewDocumentModal visible={viewDocumentModal} onClose={onCancel} /> */}
    </div>
  );
};

export default ViewLeftInitial;
