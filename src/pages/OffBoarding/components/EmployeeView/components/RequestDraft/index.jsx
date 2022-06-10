import { Card, Col, Row, Divider, Avatar, Tooltip, Popover } from 'antd';
import React from 'react';
import avtDefault from '@/assets/defaultAvatar.png';
import IconPopup from './assets/popupIcon.svg';
import styles from './index.less';

const RequestDraft = () => {
  const status = 'Approved';

  const renderTitle = (statusProps) => {
    switch (statusProps) {
      case 'In Progress':
      case 'Approved':
        return 'Your Request';
      case 'Draft':
        return 'Saved Draft';
      default:
        return '';
    }
  };

  const renderStatus = (statusProps) => {
    switch (statusProps) {
      case 'DRAFT':
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusDraft} />
            <div style={{ color: '#fd4546' }}>Draft</div>
          </div>
        );
      case 'In Progress':
      case 'Approved':
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusInProgress} />
            <div style={{ color: '#ffa100' }}>In Progress</div>
          </div>
        );
      case 'Acepted':
        return (
          <div className={styles.containerStatus}>
            <div>Status: </div>
            <div className={styles.statusAcepted} />
            <div style={{ color: '#00C598' }}>Acepted</div>
          </div>
        );
      default:
        return '';
    }
  };

  const renderPopover = () => {
    return (
      <div>
        Resignation requests cannot be Withdrawn after the Manager approves. Please talk to the HR
        to make changes to your request.
      </div>
    );
  };

  const renderButton = (statusProps) => {
    switch (statusProps) {
      case 'DRAFT':
        return (
          <div className={styles.containerBtn}>
            <div className={styles.btnEdit}>Back to edit </div>
            <div className={styles.btnDelete}>Delete </div>
          </div>
        );
      case 'In Progress':
        return (
          <div className={styles.containerBtn}>
            <div className={styles.btnWithdraw}>Withdraw </div>
          </div>
        );
      case 'Approved':
        return (
          <div className={styles.containerBtn}>
            <Popover
              trigger="hover"
              placement="left"
              content={renderPopover()}
              overlayClassName={styles.contentPopover}
            >
              <img src={IconPopup} alt="" />
            </Popover>
            <div className={styles.btnWithdraw}>Withdraw </div>
          </div>
        );
      default:
        return '';
    }
  };

  const renderAvatar = () => {
    return (
      <Tooltip placement="top" title="legalName">
        <Avatar size={21} src={avtDefault} />
      </Tooltip>
    );
  };

  const renderContent = (statusProps) => {
    switch (statusProps) {
      case 'DRAFT':
        return (
          <div className={styles.containerContent}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Row gutter={[24, 24]} align="middle">
                  <Col span={4} className={styles.title}>
                    Ticket ID
                  </Col>
                  <Col span={20} style={{ color: '#2c6df9' }}>
                    16003134
                  </Col>
                  <Col span={4} className={styles.title}>
                    Last Edited
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    15-10-2021
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[24, 24]} align="top">
                  <Col span={4} className={styles.title}>
                    Reason
                  </Col>
                  <Col span={20} style={{ color: '#707177' }}>
                    The reason I have decided to end my journey with Lollypop here is because…The
                    reason I have decided to end my journey with Lollypop here is because…The reason
                    I have decided to end my journey with Lollypop here is because…
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      case 'In Progress':
      case 'Approved':
        return (
          <div className={styles.containerContent}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Row gutter={[24, 24]} align="middle">
                  <Col span={4} className={styles.title}>
                    Ticket ID
                  </Col>
                  <Col span={20} style={{ color: '#2c6df9' }}>
                    16003134
                  </Col>
                  <Col span={4} className={styles.title}>
                    Assigned
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    <div style={{ alignItem: 'center', display: 'flex' }}>
                      <Avatar.Group
                        maxStyle={{
                          color: '#f56a00',
                          backgroundColor: '#fde3cf',
                        }}
                      >
                        {renderAvatar()}
                      </Avatar.Group>
                    </div>
                  </Col>
                  <Col span={4} className={styles.title}>
                    Requested on
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    15-10-2021
                  </Col>
                  <Col span={4} className={styles.title}>
                    Tentative LWD
                  </Col>
                  <Col span={20} style={{ color: '#464646' }}>
                    15-10-2021
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[24, 24]} align="top">
                  <Col span={4} className={styles.title}>
                    Reason
                  </Col>
                  <Col span={20} style={{ color: '#707177' }}>
                    The reason I have decided to end my journey with Lollypop here is because…The
                    reason I have decided to end my journey with Lollypop here is because…The reason
                    I have decided to end my journey with Lollypop here is because…
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <div className={styles.RequestDraft}>
      <Card title={renderTitle(status)} extra={renderStatus(status)}>
        {renderContent(status)}
        <Divider />
        {renderButton(status)}
      </Card>
    </div>
  );
};

export default RequestDraft;
