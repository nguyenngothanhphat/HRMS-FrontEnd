import React, { Component } from 'react';
import { formatMessage } from 'umi';

import styles from './index.less';

class BillingInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.BillingInformation}>
        <div className={styles.BillingInformation_title}>
          {formatMessage({ id: 'component.billingInformation.title' })}
        </div>
        <hr />
        <div className={styles.BillingInformation_content}>
          We'll charge you your company's payment method whenever you run a background check. To pay
          for a background check from a different account, update{' '}
          <a href="#">Bank account information</a> on your company profile page.
        </div>
      </div>
    );
  }
}

export default BillingInformation;
