import moment from 'moment';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';
import LastWorkingDate from '../LastWorkingDate';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { reason, date } = this.props;
    return (
      <div className={styles.resignationRequest}>
        <div className={styles.resignationRequest__title}>
          {formatMessage({ id: 'pages.offBoarding.resignationTitle' })}
        </div>
        <div>
          {/* date */}
          <div className={`${styles.resignationRequest__date} ${styles.resignationRequest__item}`}>
            <div className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.date' })}
            </div>
            <div style={{ marginLeft: '10px' }}>{moment(date).format('DD . MM .YYYY')}</div>
          </div>

          {/* reason */}
          <div className={styles.resignationRequest__item}>
            <div className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.reason' })}
            </div>
            <div className={styles.resignationRequest__reason__content}>{reason}</div>
          </div>

          <div className={styles.resignationRequest__item}>
            <div className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.lwd' })}
            </div>
            <div>
              <LastWorkingDate>
                <span>
                  The LWD is generated as per a 90 days period according to our{' '}
                  <strong>
                    <u>Standard Offboarding Policy</u>
                  </strong>
                </span>
              </LastWorkingDate>
            </div>
          </div>
          <div className={styles.resignationRequest__item}>
            <div className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.lwd' })}
            </div>
            <div>
              <LastWorkingDate>
                <span>
                  Preferred LWD must be vetted by your reporting manager & approved by the HR
                  manager to come into effect.
                </span>
              </LastWorkingDate>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResignationRequestDetail;
