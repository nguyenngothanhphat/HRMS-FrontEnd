import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

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
          radioTitle={formatMessage({ id: 'component.salaryAcceptance.title1' })}
          note={formatMessage({ id: 'component.salaryAcceptance.note1' })}
        />
      );
    }
    if (salaryStatus === 2) {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle={formatMessage({ id: 'component.salaryAcceptance.title2' })}
            note={formatMessage({ id: 'component.salaryAcceptance.note2' })}
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
            radioTitle={formatMessage({ id: 'component.salaryAcceptance.title3' })}
            note={formatMessage({ id: 'component.salaryAcceptance.note3' })}
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
                {formatMessage({ id: 'component.salaryAcceptance.closeCandidature' })}
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
