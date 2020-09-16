import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'umi';

import SalaryAcceptanceContent from '../SalaryAcceptanceContent';
import SendEmail from '../../../EligibilityDocs/components/SendEmail';

import styles from './index.less';

@connect(({ info: { salaryStructure = {} } = {} }) => ({
  salaryStructure,
}))
class SalaryAcceptance extends PureComponent {
  onFinish = (values) => {
    console.log(values);
  };

  static getDerivedStateFromProps(props) {
    if ('salaryStructure' in props) {
      return { salaryStructure: props.salaryStructure || {} };
    }
    return null;
  }

  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch } = this.props;

    const { salaryStructure = {} } = this.state;
    salaryStructure[name] = value;

    dispatch({
      type: 'info/save',
      payload: {
        salaryStructure,
      },
    });
  };

  _renderStatus = () => {
    const { salaryStatus } = this.props;

    if (salaryStatus === 1) {
      return (
        <SalaryAcceptanceContent
          radioTitle="I hereby accept this salary structure."
          note="You have gone through all the contents of the table and accept the salary as terms of your employment."
        />
      );
    }
    if (salaryStatus === 2) {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle="I would like to re-negotiate the salary structure."
            note="You have gone through all the contents of the table. However, I would like to
        renegotiate."
          />
        </>
      );
    }
    if (salaryStatus === 3) {
      const { salaryStructure = {} } = this.state;
      const { rejectComment } = salaryStructure;
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
            initialValues={{ rejectComment }}
            onFinish={this.onFinish}
            onFocus={this.onFocus}
          >
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Comment"
              name="rejectComment"
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="rejectComment"
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
    const { salaryStatus } = this.props;
    return (
      <div className={styles.salaryAcceptance}>
        <div className={styles.salaryAcceptanceWrapper}>{this._renderStatus()}</div>
        {salaryStatus === 2 ? <SendEmail /> : ''}
      </div>
    );
  }
}

export default SalaryAcceptance;
