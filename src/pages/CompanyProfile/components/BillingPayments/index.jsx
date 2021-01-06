import React, { PureComponent } from 'react';
import s from './index.less';

export default class BillingPayments extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Billing & Payments</p>
        </div>
      </div>
    );
  }
}
