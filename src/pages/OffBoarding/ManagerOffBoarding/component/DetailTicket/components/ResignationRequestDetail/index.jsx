import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import moment from 'moment';
import { DatePicker } from 'antd';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { itemRequest = {} } = this.props;
    const { requestDate: date = '', reasonForLeaving: reason = '', lastWorkingDate } = itemRequest;

    return (
      <div className={styles.resignationRequest}>
        <div className={styles.resignationRequest__title}>
          <span>{formatMessage({ id: 'pages.offBoarding.resignationTitle' })}</span>
        </div>
        <div className={styles.resignationRequest__date}>
          <div className={styles.dateOfRequest}>
            <span className={styles.title}>Date of Request</span>
            <span className={styles.content}>{date && moment(date).format('MM.DD.YYYY')}</span>
          </div>

          <div className={styles.reason}>
            <span className={styles.title}>Reason for leaving us?</span>
            <p className={styles.content}>{reason}</p>
          </div>

          <div className={styles.lastWorkingDay}>
            <span className={styles.title}>Last working date (System generated)</span>
            <div className={styles.datePicker}>
              <DatePicker
                defaultValue={lastWorkingDate ? moment(lastWorkingDate) : null}
                format="MM.DD.YY"
              />
              <div className={styles.notice}>
                <span className={styles.content}>
                  The LWD is generated as per a 90 days period according to our{' '}
                  <span className={styles.link}>Standard Offboarding Policy</span>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.lastWorkingDay}>
            <span className={styles.title}>Last working date (System generated)</span>
            <div className={styles.datePicker}>
              <DatePicker
                defaultValue={lastWorkingDate ? moment(lastWorkingDate) : null}
                format="MM.DD.YY"
              />
              <div className={styles.notice}>
                <span className={styles.content}>
                  Preferred LWD must be vetted by your reporting manager & approved by the HR
                  manager to come into effect.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResignationRequestDetail;
