import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import moment from 'moment';
import { DatePicker } from 'antd';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { itemRequest = {} } = this.props;
    const {
      requestDate: date = '',
      reasonForLeaving: reason = '',
      lastWorkingDate,
      // status = '',
      statusLastDate = '',
      requestLastDate,
    } = itemRequest;

    const preferredLWD = () => {
      if (statusLastDate === 'ACCEPTED') return moment(lastWorkingDate);
      if (requestLastDate) return moment(requestLastDate);
      return null;
    };

    return (
      <div className={styles.resignationRequest}>
        <div className={styles.resignationRequest__title}>
          <span>{formatMessage({ id: 'pages.offBoarding.resignationTitle' })}</span>
        </div>
        <div className={styles.resignationRequest__date}>
          <div className={styles.dateOfRequest}>
            <span className={styles.title}>Date of Request</span>
            <span className={styles.content}>{date && moment(date).format('MM.DD.YY')}</span>
          </div>

          <div className={styles.reason}>
            <span className={styles.title}>Reason for leaving us?</span>
            <p className={styles.content}>{reason}</p>
          </div>

          {/* <div className={styles.lastWorkingDay}>
            <span className={styles.title}>Last working date (System generated)</span>
            <div className={styles.datePicker}>
              <DatePicker
                defaultValue={date ? moment(date).add('90', 'days') : null}
                format="MM.DD.YY"
                disabled
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
            <span className={styles.title}>Preferred last working date</span>
            <div className={styles.datePicker}>
              <DatePicker defaultValue={preferredLWD} format="MM.DD.YY" disabled />
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default ResignationRequestDetail;
