import React, { PureComponent } from 'react';
import { Row, Col, Affix } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ResignationLeft from './component/ResignationLeft';
import Sidebar from './component/Sidebar';
import Workflow from './component/TerminationWorkflow';
import styles from './index.less';

class ResignationRequest extends PureComponent {
  render() {
    const {
      sendrequest,
      currentUser: { employeeId = '', generalInfo: { firstName = '' } = {} } = {},
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with {firstName} [{employeeId}]
              </p>
              <div>
                <span className={styles.textActivity}>View Activity Log</span>
                <span className={styles.textActivity} style={{ color: 'red', padding: '5px' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <ResignationLeft />
            </Col>
            <Col span={7}>{sendrequest ? <Workflow /> : <Sidebar />}</Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default connect(
  ({ offboarding: { sendrequest } = {}, user: { currentUser = {} } = {} }) => ({
    sendrequest,
    currentUser,
  }),
)(ResignationRequest);
