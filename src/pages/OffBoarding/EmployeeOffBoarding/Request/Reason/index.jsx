import React, { PureComponent } from 'react';
import { Input, Row, Col, DatePicker } from 'antd';
import { connect } from 'umi';
import icon from '@/assets/offboarding-bulb.svg';
import moment from 'moment';
import ViewDocumentModal from '@/components/ViewDocumentModal';
// import Checkbox from 'antd/lib/checkbox/Checkbox';
import styles from './index.less';

const { TextArea } = Input;

const dateFormat = 'MM.DD.YY';

@connect(({ offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
}))
class Reason extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewDocumentModal: false,
    };
  }

  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  onLinkClick = () => {
    this.setViewDocumentModal(true);
  };

  render() {
    const {
      myRequest: {
        // requestDate = '',
        reasonForLeaving = '',
        // requestLastDate = '',
        lastWorkingDate = '',
      } = {},
      // changeLWD = false,
      // handleLWD = () => {},
      // handleRequestToChange = () => {},
    } = this.props;
    // const marginTop = lastWorkingDate ? '0px' : '60px';
    const dateValue = moment(lastWorkingDate).format('MM.DD.YY');
    const { viewDocumentModal } = this.state;

    const link =
      'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf';

    return (
      <div className={styles.stepContain}>
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
                    value={dateValue ? moment(dateValue) : null}
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
                Check our{' '}
                <span onClick={this.onLinkClick} className={styles.title_Text_span}>
                  Offboarding policy
                </span>{' '}
                to learn more. The LWD is system generated. Any change request has to be approved by
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
          <TextArea className={styles.boxReason} defaultValue={reasonForLeaving} disabled />
          {/* <div className={styles.lastWorkingDay}>
            <span className={styles.title}>Last working date (System generated)</span>
            <div className={styles.datePicker}>
              <DatePicker
                format="MM.DD.YY"
                disabled
                defaultValue={moment(requestDate).add('90', 'days')}
              />
              <div className={styles.notice}>
                <span className={styles.content}>
                  The LWD is generated as per a 90 days period according to our{' '}
                  <span className={styles.link}>Standard Offboarding Policy</span>
                </span>
              </div>
            </div>

            <div className={styles.requestToChange}>
              <Checkbox defaultChecked={requestLastDate} onClick={handleRequestToChange}>
                Request to change
              </Checkbox>
            </div>
            {(changeLWD || requestLastDate) && (
              <div className={styles.datePicker}>
                <DatePicker
                  defaultValue={requestLastDate ? moment(requestLastDate) : null}
                  onChange={handleLWD}
                  format="MM.DD.YY"
                />
                <div className={styles.notice}>
                  <span className={styles.content}>
                    Preferred LWD must be vetted by your reporting manager & approved by the HR
                    manager to come into effect.
                  </span>
                </div>
              </div>
            )}
          </div> */}
        </div>
        <ViewDocumentModal
          url={link}
          visible={viewDocumentModal}
          onClose={this.setViewDocumentModal}
        />
      </div>
    );
  }
}

export default Reason;
