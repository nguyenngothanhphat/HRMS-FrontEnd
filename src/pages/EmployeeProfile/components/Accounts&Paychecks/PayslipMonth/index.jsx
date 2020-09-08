import React, { PureComponent } from 'react';
import styles from './index.less';

class PaySlipMonth extends PureComponent {
  render() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      //   'September',
      //   'October',
      //   'November',
      //   'December',
    ];
    // const month = new Date();
    return monthNames.reverse().map((item) => {
      return (
        <div className={styles.PaySlipMonth}>
          <p className={styles.nameMonth}>{`Payslip for ${item}`}</p>
          <a href="" className={styles.downLoad}>
            Download
          </a>
        </div>
      );
    });
  }
}

export default PaySlipMonth;
