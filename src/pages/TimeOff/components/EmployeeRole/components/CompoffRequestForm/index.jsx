import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import LeftMenu from './LeftMenu';
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
        <div className={styles.compoffRequest}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Request for Compoff</p>
            </div>
          </Affix>
          <Row className={styles.compoffRequest__content} gutter={[24, 0]}>
            <Col span={17}>
              <LeftMenu />
            </Col>
            <Col span={7}>
              <RightContent />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default CompoffRequestForm;
