import React, { PureComponent, createRef } from 'react';
import { Form } from 'antd';
import BillingHistory from './components/BillingHistory';
import PaymentMethods from './components/PaymentMethods';
import PayrollBankAccount from './components/PayrollBankAccount';
import FlexbenBankAccount from './components/FlexbenBankAccount';
import s from './index.less';

export default class BillingPayments extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }

  render() {
    return (
      <div className={s.root}>
        <Form
          ref={this.formRef}
          initialValues={{}}
          // onValuesChange={(values) => console.log(values)}
        >
          <BillingHistory />
          <PayrollBankAccount />
          <PaymentMethods />
          <FlexbenBankAccount />
        </Form>
      </div>
    );
  }
}
