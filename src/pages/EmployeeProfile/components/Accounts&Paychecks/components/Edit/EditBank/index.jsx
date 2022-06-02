import React, { Component } from 'react';
import { Row, Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      employee = '',
      originData: { bankData: bankDataOrigin = [] } = {},
      tempData: { bankData = [] } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    employee,
    bankDataOrigin,
    bankData,
  }),
)
class EditBank extends Component {
  handleChange = (changedValues) => {
    const { dispatch, bankData, bankDataOrigin } = this.props;
    const bankInfo = {
      ...bankData[0],
      ...changedValues,
    };
    const newList = [...bankData];
    newList.splice(0, 1, bankInfo);
    const isModified = JSON.stringify(newList) !== JSON.stringify(bankDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { bankData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChangesHaveId = () => {
    const { bankData: bankDataTemp } = this.props;
    const {
      bankName = '',
      accountNumber = '',
      accountType = '',
      ifscCode = '',
      micrcCode = '',
      uanNumber = '',
      _id: id = '',
    } = bankDataTemp[0];
    const payloadChanges = {
      id,
      bankName,
      accountNumber,
      accountType,
      ifscCode,
      micrcCode,
      uanNumber,
    };
    return payloadChanges;
  };

  processDataChangesNoId = () => {
    const { bankData: bankDataTemp, employee } = this.props;
    const {
      bankName = '',
      accountNumber = '',
      accountType = '',
      ifscCode = '',
      micrcCode = '',
      uanNumber = '',
    } = bankDataTemp[0];
    const payloadChanges = {
      employee,
      bankName,
      accountNumber,
      accountType,
      ifscCode,
      micrcCode,
      uanNumber,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { bankData } = this.props;
    const newObj = { ...bankData[0] };
    const listKey = [
      'bankName',
      'accountNumber',
      'accountType',
      'ifscCode',
      'micrcCode',
      'uanNumber',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch, bankData } = this.props;
    const dataTempKept = this.processDataKept() || {};
    const idBank = bankData[0] ? bankData[0]._id : '';
    if (idBank) {
      const payload = this.processDataChangesHaveId() || {};
      dispatch({
        type: 'employeeProfile/updateBank',
        payload,
        dataTempKept,
        key: 'openBank',
      });
    } else {
      const payload = this.processDataChangesNoId() || {};
      dispatch({
        type: 'employeeProfile/addBank',
        payload,
        dataTempKept,
        key: 'openBank',
      });
    }
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };

    const { bankData, loading, handleCancel = () => {} } = this.props;

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          ref={this.formRef}
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            bankName: bankData[0] ? bankData[0].bankName : '',
            accountNumber: bankData[0] ? bankData[0].accountNumber : '',
            accountType: bankData[0] ? bankData[0].accountType : '',
            ifscCode: bankData[0] ? bankData[0].ifscCode : '',
            micrcCode: bankData[0] ? bankData[0].micrcCode : '',
            uanNumber: bankData[0] ? bankData[0].uanNumber : '',
          }}
          onValuesChange={this.handleChange}
          onFinish={this.handleSave}
        >
          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              {
                pattern: /^[+]*[\d]{0,16}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="IFSC Code"
            name="ifscCode"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]{0,12}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validatePassPortNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="MICR Code"
            name="micrcCode"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]{0,12}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validatePassPortNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>

          <Form.Item
            label="UAN Number"
            name="uanNumber"
            rules={[
              {
                pattern: /^[+]*[\d]{0,12}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>

          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={() => handleCancel('bank')}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form>
      </Row>
    );
  }
}

export default EditBank;
