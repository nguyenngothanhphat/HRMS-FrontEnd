import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class ResignationRequestDetail extends PureComponent {
  render() {
    const requestDetail = {
      date: '20.08.2020',
      employeeName: 'Employee Name',
      reason:
        'The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…',
    };
    return (
      <div className={styles.resignationRequest}>
        <p className={styles.resignationRequest__title}>
          {formatMessage({ id: 'pages.offBoarding.resignationTitle' })}
        </p>
        <div className={styles.resignationRequest__date}>
          <p className={styles.resignationRequest__text}>
            {formatMessage({ id: 'pages.offBoarding.resignation.date' })}
          </p>
          <p>{requestDetail.date}</p>
        </div>
        <p className={styles.resignationRequest__text}>Employee Name</p>
        <p>{requestDetail.reason}</p>
      </div>
    );
  }
}

export default ResignationRequestDetail;
