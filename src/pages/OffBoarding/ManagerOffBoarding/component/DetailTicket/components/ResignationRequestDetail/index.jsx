import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { itemRequest = {} } = this.props;
    const {
      employee: { generalInfo: { firstName: employeeName = '' } = {} } = {},
      requestDate: date = '',
      reasonForLeaving: reason = '',
    } = itemRequest;

    return (
      <div className={styles.resignationRequest}>
        <p className={styles.resignationRequest__title}>
          {formatMessage({ id: 'pages.offBoarding.resignationTitle' })}
        </p>
        <div className={styles.resignationRequest__date}>
          <p className={styles.resignationRequest__text}>
            {formatMessage({ id: 'pages.offBoarding.resignation.date' })}
          </p>
          <p>{date && moment(date).format('MM.DD.YYYY')}</p>
        </div>
        <p className={styles.resignationRequest__text}>{employeeName}</p>
        <p>{reason}</p>
      </div>
    );
  }
}

export default ResignationRequestDetail;
