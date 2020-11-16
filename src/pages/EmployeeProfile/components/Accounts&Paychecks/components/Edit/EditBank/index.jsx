import React, { Component } from 'react';
import { Row, Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { bankData: bankDataOrigin = [] } = {},
      tempData: { bankData = [] } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    bankDataOrigin,
    bankData,
  }),
)
class EditBank extends Component {
  //   handleChange = (changedValues) => {
  //     const { dispatch, generalData, generalDataOrigin } = this.props;
  //     const generalInfo = {
  //       ...generalData,
  //       ...changedValues,
  //     };
  //     const isModified = JSON.stringify(generalInfo) !== JSON.stringify(generalDataOrigin);
  //     dispatch({
  //       type: 'employeeProfile/saveTemp',
  //       payload: { generalData: generalInfo },
  //     });
  //     dispatch({
  //       type: 'employeeProfile/save',
  //       payload: { isModified },
  //     });
  //   };

  //   processDataChanges = () => {
  //     const { generalData: generalDataTemp } = this.props;
  //     const {
  //       emergencyContact = '',
  //       emergencyPersonName = '',
  //       emergencyRelation = '',
  //       _id: id = '',
  //     } = generalDataTemp;
  //     const payloadChanges = {
  //       id,
  //       emergencyContact,
  //       emergencyPersonName,
  //       emergencyRelation,
  //     };
  //     return payloadChanges;
  //   };

  //   processDataKept = () => {
  //     const { generalData } = this.props;
  //     const newObj = { ...generalData };
  //     const listKey = ['emergencyContact', 'emergencyPersonName', 'emergencyRelation'];
  //     listKey.forEach((item) => delete newObj[item]);
  //     return newObj;
  //   };

  //   handleSave = () => {
  //     const { dispatch } = this.props;
  //     const payload = this.processDataChanges() || {};
  //     const dataTempKept = this.processDataKept() || {};
  //     dispatch({
  //       type: 'employeeProfile/updateGeneralInfo',
  //       payload,
  //       dataTempKept,
  //       key: 'openContactDetails',
  //     });
  //   };

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
                pattern: /^[+]*[\d]{0,12}$/,
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
