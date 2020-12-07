import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

class CompoffRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageContainer>
        <div className={styles.CompoffRequestForm}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Request for Compoff</p>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <RequestInformation />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default CompoffRequestForm;
