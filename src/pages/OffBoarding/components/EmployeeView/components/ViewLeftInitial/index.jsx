import React, { Component } from 'react';
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

class ViewLeftInitial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      viewDocumentModal: false,
    };
  }

  onChangeSteps = (values) => {};

  onCancel = () => {
    this.setState({
      viewDocumentModal: false,
    });
  };

  onLinkClick = () => {
    this.setState({
      viewDocumentModal: true,
    });
  };

  handleResignRequest = () => {
    const { hrManager } = this.props;

    if (hrManager !== null) {
      history.push('/offboarding/list/my-request/new');
    } else {
      notification.error({
        message: 'Notification',
        description:
          'Can not start your Resignation request because your HR Manager does not existed!',
      });
    }
  };

  render() {
    const { current = 0, viewDocumentModal } = this.state;
    return (
      <div className={styles.Container}>
        <Row className={styles.header} justify="space-between">
          <Col span={13} className={styles.headerTerminate}>
            <div className={styles.leftSection}>
              <div className={styles.leftSection__title}>Super six years with us. Thank you.</div>
              <div className={styles.leftSection__content}>
                We are indebted by your contribution to our company and clients all this while. This
                is not the end we like to see.
              </div>
              <a href="#" className={styles.links}>
                Request for feedback?
              </a>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.rightSection__bg} />
            </div>
          </Col>

          <Col span={10} className={styles.headerSchedule}>
            <div className={styles.headerSchedule__title}>Did you know?</div>
            <div className={styles.headerSchedule__content}>
              Your Manager, Sandeep, usually conducts 1-on-1s and you can speak anything to him.
              8/10 employees have changed their mind! Schedule a meeting now!
            </div>
            <a href="#" className={styles.links}>
              Schedule 1-on-1
            </a>
          </Col>
        </Row>

        <div className={styles.titleProcess}>
          However, if you have made your mind. We respect that as well.
        </div>
        <div className={styles.offboardingProcess}>
          <div className={styles.offboardingProcess__subtitle}>
            Our offboarding process at a glance
          </div>
          <div className={styles.offboardingProcess__process}>
            <Steps current={current} onChange={this.onChangeSteps} labelPlacement="vertical">
              {steps.map((item) => (
                <Step key={item.step} description={item.description} />
              ))}
            </Steps>
          </div>
        </div>

        <div className={styles.stepAction}>
          <div className={styles.stepAction__text} onClick={this.onLinkClick}>
            Learn more about offboarding policy
          </div>
          <Button onClick={this.handleResignRequest} className={styles.stepAction__btn}>
            Initiate resignation request
          </Button>
        </div>
        <ViewDocumentModal visible={viewDocumentModal} onClose={this.onCancel} />
      </div>
    );
  }
}

export default ViewLeftInitial;
