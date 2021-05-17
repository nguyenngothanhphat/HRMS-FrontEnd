import React, { PureComponent } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { reason, date, name } = this.props;
    return (
      <div className={styles.resignationRequest}>
        <div className={styles.resignationRequest__title}>
          {formatMessage({ id: 'pages.offBoarding.resignationTitle' })}
        </div>
        <div>
          {/* date */}
          <div className={styles.resignationRequest__date}>
            <p className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.date' })}
            </p>
            <p style={{ marginLeft: '10px' }}>{moment(date).format('DD . MM .YYYY')}</p>
          </div>

          {/* reason */}
          <div className={styles.resignationRequest__reason}>
            <div className={styles.resignationRequest__text}>
              {formatMessage({ id: 'pages.offBoarding.resignation.reason' })}
            </div>
            <div className={styles.resignationRequest__reason__content}>{reason}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResignationRequestDetail;
