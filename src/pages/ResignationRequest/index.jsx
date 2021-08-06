import React, { PureComponent } from 'react';
import { Row, Col, Affix } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ResignationLeft from './component/ResignationLeft';

import styles from './index.less';

class ResignationRequest extends PureComponent {
  render() {
    // const { sendrequest } = this.props;
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relationship with the company</p>
              {/* <div>
                <div className={styles.viewActivityLogs}>
                  <span>View Activity log (15)</span>
                </div>
              </div> */}
            </div>
          </Affix>
          <Row className={styles.content} gutter={[24, 24]}>
            <Col span={17}>
              <ResignationLeft />
            </Col>
            <Col span={7}>
              {/* {sendrequest ? (
                <Workflow />
              ) : (
                <Sidebar />
              )} */}
            </Col>
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
