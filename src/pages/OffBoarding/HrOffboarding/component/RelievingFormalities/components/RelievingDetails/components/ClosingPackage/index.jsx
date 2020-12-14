import React, { PureComponent } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
// import editIcon from '@/assets/edit-template-icon.svg';
import lightBulbIcon from '@/assets/offboarding-schedule.svg';
import removeIcon from '@/assets/remove-template-icon.svg';
import styles from './index.less';

const closePackage = [
  {
    id: 1,
    attachment: {
      name: 'Relieving letter',
    },
  },
  {
    id: 2,
    attachment: {
      name: 'Experience letter',
    },
  },
];

@connect(({ offboarding: { relievingDetails: { closingPackage = {}, _id = '' } } }) => ({
  closingPackage,
  ticketId: _id,
}))
class ClosingPackage extends PureComponent {
  constructor(props) {
    super(props);
    const {
      closingPackage: { waitList = [] },
    } = this.props;
    this.state = {
      isSent: false,
      closingPackage: waitList,
    };
  }

  handleSendMail = () => {
    this.setState({
      isSent: true,
    });
  };

  renderBeforeSendMail = () => {
    const { closingPackage } = this.state;
    return (
      <>
        <Row gutter={[40, 15]}>
          {closingPackage.map((template, index) => {
            const { packageName } = template;
            return (
              <Col span={10} key={`${index + 1}`}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img src={templateIcon} alt="template-icon" />
                    <span>{packageName}</span>
                  </div>
                  <div className={styles.template__action}>
                    {/* <img className={styles.edit__icon} src={editIcon} alt="edit-icon" /> */}
                    <img src={removeIcon} alt="remove-icon" />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[40, 15]}>
          <Col span={14}>
            <Input
              className={styles.closingPackage__input}
              placeholder={formatMessage({ id: 'pages.relieving.placeholder.sendMail' })}
            />
          </Col>
          <Col span={7}>
            <Button
              type="default"
              className={styles.closingPackage__btn}
              onClick={this.handleSendMail}
            >
              {formatMessage({ id: 'pages.relieving.btn.sendMail' })}
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  renderAfterSendMail = () => {
    return (
      <>
        <Row gutter={[40, 15]}>
          {closePackage.map((template) => {
            const { attachment } = template;
            return (
              <Col span={10}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img src={templateIcon} alt="template-icon" />
                    <span>{attachment.name}</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[10, 15]} align="middle">
          <Col span={12}>
            <div className={styles.template}>avvk.krisna@gmail.com</div>
          </Col>
          <Col span={12}>
            <div className={styles.closingPackage__notification}>
              <img src={lightBulbIcon} alt="light-buld-icon" />
              <span>
                {formatMessage({ id: 'pages.relieving.closePackage.notification' })}{' '}
                avvk.krishna@gmail.com
              </span>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { isSent } = this.state;
    return (
      <div className={styles.closingPackage}>
        <p className={styles.closingPackage__title}>
          {formatMessage({ id: 'pages.relieving.closePackage' })}
        </p>
        {isSent ? this.renderAfterSendMail() : this.renderBeforeSendMail()}
      </div>
    );
  }
}

export default ClosingPackage;
