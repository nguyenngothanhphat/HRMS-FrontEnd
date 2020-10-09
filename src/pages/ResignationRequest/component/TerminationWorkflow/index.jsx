// import React, { Component } from 'react';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import icon1 from '@/assets/workflow1.svg';
import styles from './index.less';

// const { Step } = Steps;

export class TerminationWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <p className={styles.title}>Termination Workflow</p>
        <Row>
          <Col span={3}>
            <img src={icon1} alt="" />
            <div className={styles.textWorkflow}>Request Sent</div>
          </Col>
          <Col span={3}>
            <hr style={{ width: '29px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
          <Col span={3}>
            <img src={icon1} alt="" />
            <p className={styles.textWorkflow}>Manager Approval</p>
          </Col>
          <Col span={3}>
            <hr style={{ width: '29px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
          <Col span={3}>
            <img src={icon1} alt="" />
            <p className={styles.textWorkflow}>Manager Approval</p>
          </Col>
          <Col span={3}>
            <hr style={{ width: '29px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
          <Col span={3}>
            <img src={icon1} alt="" />
            <p className={styles.textWorkflow}>Manager Approval</p>
          </Col>
          <Col span={3}>
            <hr style={{ width: '19px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: '45px' }}>
          <Col span={3}>
            <img src={icon1} alt="" />
            <p className={styles.textWorkflow}>ExitInterview</p>
          </Col>
          <Col span={3}>
            <hr style={{ width: '29px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
          <Col span={3}>
            <img src={icon1} alt="" />
            <p className={styles.textWorkflow}>ExitInterview</p>
          </Col>
          <Col span={3}>
            <hr style={{ width: '29px', marginLeft: '5px', marginTop: '18px' }} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TerminationWorkflow;
