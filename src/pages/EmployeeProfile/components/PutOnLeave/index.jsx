import React, { Component } from 'react';
import { Form, DatePicker, Row, Col } from 'antd';
import warning from '@/assets/warning_filled.svg';
import path from '@/assets/path.svg';

import styles from './index.less';

class PutOnLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { cancel = () => {} } = this.props;
    cancel();
  };

  render() {
    return (
      <div className={styles.putOnLeaveRoot}>
        <div className={styles.putOnLeaveRoot__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.putOnLeaveRoot__titleSection__text}>Put on Leave (LWP)</p>
            <div onClick={this.handleCancel} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>
            <div className={styles.notification}>
              <img alt="warning" src={warning} />
              <div className={styles.notification__text}>
                This will put Aditya Venkatesh on leave for the days selected without pay, a
                Notification for the update will be sent to the employee as well.
              </div>
            </div>
            <div className={styles.lwpForm}>
              <Form className={styles.lwpForm__form}>
                <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                  <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div className={styles.lwpText}>Leave From</div>
                  </Col>
                  <Col
                    className={styles.lwpForm__form__col}
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    xl={18}
                  >
                    <Form.Item
                      name="leaveFrom"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Leave from date',
                        },
                      ]}
                    >
                      <DatePicker
                        className={styles}
                        placeholder="DD-MM-YYYY"
                        picker="date"
                        format="DD.MM.YYYY"
                        // onChange={(value) => _handleSelect(value, candidateField[1].title)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div className={styles.lwpText}>Leave To</div>
                  </Col>
                  <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    <Form.Item
                      name="leaveTo"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Leave to date',
                        },
                      ]}
                    >
                      <DatePicker
                        className={styles}
                        placeholder="DD-MM-YYYY"
                        picker="date"
                        format="DD.MM.YYYY"
                        // onChange={(value) => _handleSelect(value, candidateField[1].title)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PutOnLeave;
