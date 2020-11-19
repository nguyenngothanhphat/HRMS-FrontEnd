import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ResignationLeft from './component/ResignationLeft';
import Resignation from './component/ResignationRight';
// import Submited from './component/SubmitedResignation';
import Workflow from './component/TerminationWorkflow';
import styles from './index.less';

class ResignationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { sendrequest } = this.props;
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Aditya Venkatesh [PSI: 1022]
              </p>
              <div>
                <span className={styles.textActivity}>View Activity Log</span>
                <span className={styles.textActivity} style={{ color: 'red', padding: '5px' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={17}>
              <ResignationLeft />
            </Col>
            <Col span={7}>{sendrequest ? <Workflow /> : <Resignation />}</Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default connect(({ offboarding: { sendrequest } = {} }) => ({
  sendrequest,
}))(ResignationRequest);
