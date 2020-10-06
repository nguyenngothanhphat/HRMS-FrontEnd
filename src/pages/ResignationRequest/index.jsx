import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ResignationLeft from './component/ResignationLeft/index';
import Resignationright from './component/ResignationRight/index';
import styles from './index.less';

class ResignationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
                <span className={styles.textActivity} style={{ color: 'red' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={18}>
              <ResignationLeft />
            </Col>
            <Col span={6}>
              <Resignationright />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ResignationRequest;
