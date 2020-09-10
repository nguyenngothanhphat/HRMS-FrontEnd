import React, { PureComponent } from 'react';
import styles from './index.less';

class PaySlipMonth extends PureComponent {
  render() {
    const monthNames = [
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'June' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      //   'September',
      //   'October',
      //   'November',
      //   'December',
    ];
    // const month = new Date();
    return monthNames.reverse().map((item) => {
      return (
        <div key={item.id} className={styles.PaySlipMonth}>
          <p className={styles.nameMonth}>{`Payslip for ${item.name}`}</p>
          <a href="" className={styles.downLoad}>
            Download
          </a>
        </div>
      );
    });
  }
}

export default PaySlipMonth;
