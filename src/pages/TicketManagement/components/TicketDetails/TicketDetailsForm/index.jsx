import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
import styles from './index.less';
import attachIcon from '@/assets/ticketsManagement-attach.svg';

const { TextArea } = Input;
export class TicketDetailsForm extends Component {
  state = {
    value: '',
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className={styles.TicketDetails}>
        <div className={styles.formDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Tickets Details</span>
          </div>
          <div className={styles.formContent}>
            <div className={styles.formContent__container}>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Ticket ID: <span>16627</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Request Date: <span>12/03/2019</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Open by: <span>Sanvanna Nguyen</span>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  Query Type: <span>16627</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Priority: <span>12/03/2019</span>
                </Col>
                <Col span={8} className={styles.formContent__title}>
                  Subject: <span>Sanvanna Nguyen</span>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.formContent__title}>
                  QCC: <span>16627</span>
                </Col>
                <Col span={16} className={styles.formContent__title}>
                  Attachments: <span>12/03/2019</span>
                </Col>
              </Row>
              <Row>
                <Col span={24} className={styles.formContent__title}>
                  Description:
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
                  officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
                  nostrud amet.
                </Col>
              </Row>
            </div>
          </div>
          <div className={styles.note}>
            <div className={styles.note__title}>Notes</div>
            <div className={styles.note__textareaContent}>
              <TextArea
                value={value}
                onChange={this.onChange}
                placeholder="Type your message here..."
                autoSize={{ minRows: 6, maxRows: 8 }}
                className={styles.note__textarea}
              />
              <Button className={styles.btnAttach}>
                <img src={attachIcon} alt="attachIcon" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketDetailsForm;
