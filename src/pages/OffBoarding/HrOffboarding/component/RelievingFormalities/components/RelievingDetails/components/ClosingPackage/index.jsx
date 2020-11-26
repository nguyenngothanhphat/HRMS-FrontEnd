import React, { PureComponent } from 'react';
import { Row, Col, Input, Button } from 'antd';
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
class ClosingPackage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSend: false,
    };
  }

  handleSendMail = () => {
    this.setState({
      isSend: true,
    });
  };

  renderBeforeSendMail = () => {
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
              placeholder="Enter mail id to send package"
            />
          </Col>
          <Col span={7}>
            <Button
              type="default"
              className={styles.closingPackage__btn}
              onClick={this.handleSendMail}
            >
              Send mail
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
              <span>The closing package has been sent to avvk.krishna@gmail.com</span>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { isSend } = this.state;
    return (
      <div className={styles.closingPackage}>
        <p className={styles.closingPackage__title}>Close Package</p>
        {isSend ? this.renderAfterSendMail() : this.renderBeforeSendMail()}
      </div>
    );
  }
}

export default ClosingPackage;
