import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { formatMessage } from 'umi';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import LastWorkingDay from './components/LastWorkingDay';
import CommentsFromHR from './components/CommentFromHr';
import InfoEmployee from './components/RightContent';
import styles from './index.less';

class HRDetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBlockNotifications = () => {
    return (
      <Row>
        <div className={styles.notification}>
          <div className={styles.notification__content}>
            <span>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <span onClick={this.openFormReason}>
              {formatMessage({ id: 'pages.offBoarding.putOnHold' })}
            </span>
            <span>{formatMessage({ id: 'pages.offBoarding.reject' })}</span>
            <span>{formatMessage({ id: 'pages.offBoarding.accept' })}</span>
          </div>
        </div>
      </Row>
    );
  };

  render() {
    return (
      <PageContainer>
        <div className={styles.hrDetailTicket}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Venkat Vamsi Kr ... [PSI: 1022]
              </p>
            </div>
          </Affix>
          <Row className={styles.detailTicket__content} gutter={[30, 30]}>
            <Col span={17}>
              <RequesteeDetail />
              <ResignationRequestDetail />
              <CommentsFromHR />
              <LastWorkingDay />
            </Col>
            <Col span={7}>
              <InfoEmployee />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HRDetailTicket;
