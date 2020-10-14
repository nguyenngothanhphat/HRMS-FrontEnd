import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ActionDetailTicket from './components/ActionDetailTicket';
import RightContent from './components/RightContent';
import styles from './index.less';

class DetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayNotifications: false,
      isOpenFormReason: false,
    };
  }

  openFormReason = () => {
    this.setState({
      isDisplayNotifications: false,
      isOpenFormReason: true,
    });
  };

  renderBlockNotifications = () => {
    return (
      <Row>
        <div className={styles.notification}>
          <div className={styles.notification__content}>
            <span>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <span onClick={this.openFormReason}>Put on hold</span>
            <span>Reject</span>
            <span>Accept</span>
          </div>
        </div>
      </Row>
    );
  };

  handleDisplayNotifications = () => {
    this.setState({
      isDisplayNotifications: true,
    });
  };

  render() {
    const { isDisplayNotifications, isOpenFormReason } = this.state;

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
              <ActionDetailTicket
                isOpenFormReason={isOpenFormReason}
                handleDisplayNotifications={this.handleDisplayNotifications}
              />
            </Col>
            <Col span={6}>
              <RightContent />
            </Col>
          </Row>
          {isDisplayNotifications ? this.renderBlockNotifications() : ''}
        </div>
      </PageContainer>
    );
  }
}

export default DetailTicket;
