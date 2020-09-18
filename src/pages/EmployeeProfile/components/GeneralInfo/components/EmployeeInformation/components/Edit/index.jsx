import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Radio } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (changedValues) => {
    const {
      dispatch,
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
    const generalInfo = {
      ...generalData,
      ...changedValues,
      // DOB: changedValues.DOB ? changedValues.DOB.format('YYYY-MM-DD') : '',
    };
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: generalInfo },
    });
  };

  render() {
    const {
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
    console.log(generalData);
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const dateFormat = 'Do MMM YYYY';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
        >
          <Form.Item
            label="Legal Name"
            name="legalName"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} defaultValue={generalData.legalName} />
          </Form.Item>
          <Form.Item label="Date of Birth" name="DOB">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
              defaultValue={generalData.DOB}
            />
          </Form.Item>
          <Form.Item label="Legal Gender" name="legalGender">
            <Radio.Group defaultValue={generalData.legalGender} onChange={this.handleChange}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Employee ID" name="employeeId">
            <Input className={styles.inputForm} defaultValue={generalData.employeeId} />
          </Form.Item>
          <Form.Item
            label="Work Email"
            name="workEmail"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} defaultValue={generalData.workEmail} />
          </Form.Item>
          <Form.Item
            label="Work Number"
            name="workNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} defaultValue={generalData.workNumber} />
          </Form.Item>
          <Form.Item
            label="Adhaar Card Number"
            name="cardNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} defaultValue={generalData.cardNumber} />
          </Form.Item>
          <Form.Item
            label="UAN Number"
            name="uanNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} defaultValue={generalData.uanNumber} />
          </Form.Item>
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
