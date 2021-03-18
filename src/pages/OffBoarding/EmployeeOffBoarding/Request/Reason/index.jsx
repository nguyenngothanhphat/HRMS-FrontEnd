import React, { PureComponent } from 'react';
import { Input, Row, Col, DatePicker } from 'antd';
import { connect } from 'umi';
import icon from '@/assets/offboarding-bulb.svg';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;

const dateFormat = 'YYYY/MM/DD';

@connect(({ offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
}))
class Reason extends PureComponent {
  render() {
    const {
      myRequest: { reasonForLeaving: reason = '', requestDate = '', lastWorkingDate = '' } = {},
    } = this.props;
    const marginTop = lastWorkingDate ? '0px' : '60px';
    const dateValue = moment(lastWorkingDate).format('YYYY/MM/DD');
    return (
      <div className={styles.stepContain}>
        {/* {!lastWorkingDate && (
          <div className={styles.title_Box}>
            <img src={icon} alt="iconCheck" className={styles.icon} />
            <span className={styles.title_Text}>
              A last working date (LWD) will generated after your request is approved by your
              manager and the HR.
              <div>
                The Last Working Day (LWD) will be generated as per our Standard Offboarding Policy.
              </div>
            </span>
          </div>
        )} */}

        <div className={styles.titleBody}>
          {lastWorkingDate && (
            <div className={styles.viewChangeLastWorkingDay}>
              <p className={styles.viewChangeLastWorkingDay__title}>Resignation request details</p>
              <p className={styles.viewChangeLastWorkingDay__label}>
                Last working day (HR approved)
              </p>
              <Row className={styles.viewChangeLastWorkingDay__viewDateApproved} gutter={[50, 0]}>
                <Col span={8}>
                  <DatePicker
                    value={dateValue && moment(dateValue, dateFormat)}
                    format={dateFormat}
                    className={styles.viewChangeLastWorkingDay__viewDateApproved__datePicker}
                    disabled
                  />
                </Col>
                <Col
                  span={16}
                  className={styles.viewChangeLastWorkingDay__viewDateApproved__description}
                >
                  <span
                    className={
                      styles.viewChangeLastWorkingDay__viewDateApproved__description__text1
                    }
                  >
                    A last working date (LWD) is generated as per a 90 days notice period according
                    to our{' '}
                  </span>
                  <span
                    className={
                      styles.viewChangeLastWorkingDay__viewDateApproved__description__text2
                    }
                  >
                    Standard Resignation Policy
                  </span>
                </Col>
              </Row>
            </div>
          )}
          {!lastWorkingDate && (
            <div className={styles.title_Box}>
              <img src={icon} alt="iconBulb" className={styles.icon} />
              <div className={styles.title_Text}>
                Your Last Working Day (LWD) will be 90 day from the submission of this request.
                Check our <span className={styles.title_Text_span}>Offboarding policy</span> to
                learn more. The LWD is system generated. Any change request has to be approved by
                the HR manager to come into effect.
              </div>
            </div>
          )}
          <div className={styles.center}>
            <p className={styles.textBox}>Reason for leaving us?</p>
            {/* <p className={styles.textTime}>
              {requestDate && moment(requestDate).format('DD.MM.YY | h:mm A')}
            </p> */}
          </div>
          <TextArea className={styles.boxReason} value={reason} disabled />
        </div>
      </div>
    );
  }
}

export default Reason;
