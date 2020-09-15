import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';

import SalaryAcceptanceContent from '../SalaryAcceptanceContent';

import styles from './index.less';

class SalaryAcceptance extends PureComponent {
  onFinish = (values) => {
    console.log(values);
  };

  _renderStatus = () => {
    const { salaryStatus } = this.props;

    if (salaryStatus === 1) {
      return (
        <SalaryAcceptanceContent
          radioTitle="I would like to re-negotiate the salary structure."
          note="You have gone through all the contents of the table and accept the salary as terms of your employment."
        />
      );
    }
    if (salaryStatus === 2) {
      return (
        <SalaryAcceptanceContent
          radioTitle="I would like to re-negotiate the salary structure."
          note="You have gone through all the contents of the table. However, I would like to
          renegotiate."
        />
      );
    }
    if (salaryStatus === 3) {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle="I would like to reject this offer."
            note="You have gone through all the contents of the table and do not accept the offer given to me."
          />
          <hr />
          <Form
            className={styles.basicInformation__form}
            wrapperCol={{ span: 24 }}
            name="basic"
            // initialValues={{ fullName, privateEmail, workEmail, experienceYear }}
            onFinish={this.onFinish}
            onFocus={this.onFocus}
          >
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Comment"
              name="salaryComment"
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="fullName"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Close Candidature
              </Button>
            </Form.Item>
          </Form>
        </>
      );
    }
    return null;
  };

  render() {
    return <div className={styles.salaryAcceptance}>{this._renderStatus()}</div>;
  }
}

export default SalaryAcceptance;
