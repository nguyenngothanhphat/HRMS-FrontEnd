import React, { PureComponent } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const { reason, date, name } = this.props;
    return (
      <div className={styles.resignationRequest}>
        <p className={styles.resignationRequest__title}>
          {formatMessage({ id: 'pages.offBoarding.resignationTitle' })}
        </p>
        <div className={styles.resignationRequest__date}>
          <p className={styles.resignationRequest__text}>
            {formatMessage({ id: 'pages.offBoarding.resignation.date' })}
          </p>
          <p>{moment(date).format('DD . MM .YYYY')}</p>
        </div>
        <p className={styles.resignationRequest__text}>{name}</p>
        <p>{reason}</p>
      </div>
    );
  }
}

export default ResignationRequestDetail;
