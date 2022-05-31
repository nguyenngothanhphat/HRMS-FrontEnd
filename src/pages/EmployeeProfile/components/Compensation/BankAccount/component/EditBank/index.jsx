import React from 'react';
import { Row, Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const EditBank = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    bankData,
    bankDataOrigin,
    loading,
    handleCancel = () => {},
    locationProp: { headQuarterAddress: { country = '' } = {} } = {},
  } = props;
  const checkIndiaLocation = country === 'IN';
  const checkVietNamLocation = country === 'VN';
  const checkUSALocation = country === 'US';

  const handleChange = (changedValues) => {
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
  const processDataChangesHaveId = () => {
    const { bankData: bankDataTemp } = props;
    const {
      bankName = '',
      branchName = '',
      accountNumber = '',
      accountType = '',
      swiftcode = '',
      routingNumber = '',
      ifscCode = '',
      micrcCode = '',
      uanNumber = '',
      _id: id = '',
    } = bankDataTemp[0];
    const payloadChanges = {
      id,
      bankName,
      branchName,
      accountNumber,
      accountType,
      swiftcode,
      routingNumber,
      ifscCode,
      micrcCode,
      uanNumber,
    };
    return payloadChanges;
  };
  const processDataChangesNoId = () => {
    const { bankData: bankDataTemp, employee } = props;
    const {
      bankName = '',
      branchName = '',
      accountNumber = '',
      accountType = '',
      swiftcode = '',
      routingNumber = '',
      ifscCode = '',
      micrcCode = '',
      uanNumber = '',
    } = bankDataTemp[0];
    const payloadChanges = {
      employee,
      bankName,
      branchName,
      accountNumber,
      accountType,
      swiftcode,
      routingNumber,
      ifscCode,
      micrcCode,
      uanNumber,
    };
    return payloadChanges;
  };

  const processDataKept = () => {
    const newObj = { ...bankData[0] };
    const listKey = [
      'bankName',
      'branchName',
      'accountNumber',
      'accountType',
      'swiftcode',
      'routingNumber',
      'ifscCode',
      'micrcCode',
      'uanNumber',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  const handleSave = () => {
    const dataTempKept = processDataKept() || {};
    const idBank = bankData[0] ? bankData[0]._id : '';
    if (idBank) {
      const payload = processDataChangesHaveId() || {};
      dispatch({
        type: 'employeeProfile/updateBank',
        payload,
        dataTempKept,
        key: 'openBank',
      });
    } else {
      const payload = processDataChangesNoId() || {};
      dispatch({
        type: 'employeeProfile/addBank',
        payload,
        dataTempKept,
        key: 'openBank',
      });
    }
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 7 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 9 },
      sm: { span: 9 },
    },
  };
  return (
    <Row gutter={[0, 16]} className={styles.root}>
      <Form
        form={form}
        className={styles.Form}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        initialValues={{
          bankName: bankData[0] ? bankData[0].bankName : '',
          branchName: bankData[0] ? bankData[0].branchName : '',
          accountNumber: bankData[0] ? bankData[0].accountNumber : '',
          accountType: bankData[0] ? bankData[0].accountType : '',
          swiftcode: bankData[0] ? bankData[0].swiftcode : '',
          routingNumber: bankData[0] ? bankData[0].routingNumber : '',
          ifscCode: bankData[0] ? bankData[0].ifscCode : '',
          micrcCode: bankData[0] ? bankData[0].micrcCode : '',
          uanNumber: bankData[0] ? bankData[0].uanNumber : '',
        }}
        onValuesChange={handleChange}
        onFinish={handleSave}
      >
        <Form.Item
          label="Bank Name"
          name="bankName"
          rules={[
            {
              required: true,
              message: 'Please enter the bank name!',
            },
          ]}
        >
          <Input className={styles.inputForm} />
        </Form.Item>
        {checkVietNamLocation ? (
          <Form.Item
            label="Branch Name"
            name="branchName"
            rules={[
              {
                required: true,
                message: 'Please enter the branch name!',
              },
            ]}
          >
            <Input placeholder="Branch Name" className={styles.inputForm} />
          </Form.Item>
        ) : null}

        <Form.Item
          label="Account Type"
          name="accountType"
          rules={[
            {
              required: true,
              message: 'Please enter the account type!',
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
              required: true,
              message: 'Please enter the account number!',
            },
            {
              pattern: /^[+]*[\d]{0,16}$/,
              message: formatMessage({ id: 'pages.employeeProfile.validateNumber' }),
            },
          ]}
        >
          <Input className={styles.inputForm} />
        </Form.Item>

        {checkVietNamLocation ? (
          <Form.Item
            label="Swift Code"
            name="swiftcode"
            rules={[
              {
                required: true,
                message: 'Please enter the swift code!',
              },
            ]}
          >
            <Input placeholder="Swift Code" className={styles.inputForm} />
          </Form.Item>
        ) : null}

        {checkUSALocation ? (
          <Form.Item
            label="Routing Number"
            name="routingNumber"
            rules={[
              {
                required: true,
                message: 'Please enter the routing number!',
              },
              {
                pattern: /^[\d]{0,9}$/,
                message: 'Input numbers only and a max of 9 digits',
              },
            ]}
          >
            <Input placeholder="Routing Number" className={styles.inputForm} />
          </Form.Item>
        ) : null}

        {checkIndiaLocation ? (
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
        ) : null}

        {checkIndiaLocation ? (
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
        ) : null}

        {checkIndiaLocation ? (
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
        ) : null}

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
};

export default connect(
  ({
    loading,
    employeeProfile: {
      employee = '',
      originData: {
        bankData: bankDataOrigin = [],
        employmentData: { location: locationProp = {} } = {},
      } = {},
      tempData: { bankData = [] } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    employee,
    bankDataOrigin,
    bankData,

    locationProp,
  }),
)(EditBank);
