import React, { PureComponent } from 'react';
import BillingHistory from './components/BillingHistory';
import PaymentMethods from './components/PaymentMethods';
import PayrollBankAccount from './components/PayrollBankAccount';
// import FlexbenBankAccount from './components/FlexbenBankAccount';
import s from './index.less';

export default class BillingPayments extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <BillingHistory />
        <PayrollBankAccount />
        <PaymentMethods />
        {/* <FlexbenBankAccount /> */}
      </div>
    );
  }
}
