import React, { PureComponent } from 'react';
import { Affix, Row, Col, Spin } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TicketDetailsForm from './TicketDetailsForm';
import RightContent from './RightContent';

class TicketDetails extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.TicketDetails}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: ]</p>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <TicketDetailsForm />
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
export default TicketDetails;
