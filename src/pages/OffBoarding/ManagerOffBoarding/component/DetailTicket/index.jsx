import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ActionDetailTicket from './components/ActionDetailTicket';
import RightContent from './components/RightContent';
import styles from './index.less';

class DetailTicket extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.detailTicket}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Venkat Vamsi Kr ... [PSI: 1022]
              </p>
            </div>
          </Affix>
          <Row className={styles.detailTicket__content} gutter={[40, 0]}>
            <Col span={18}>
              <RequesteeDetail />
              <ResignationRequestDetail />
              <ActionDetailTicket />
            </Col>
            <Col span={6}>
              <RightContent />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default DetailTicket;
