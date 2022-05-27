import React from 'react';
import { Row, Form, Input, Button, Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const EditTax = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    taxData,
    taxDataOrigin,
    loading,
    handleCancel = () => {},
    locationProp: { headQuarterAddress: { country = '' } = {} } = {},
  } = props;
  const checkIndiaLocation = country === 'IN';
  const checkVietNamLocation = country === 'VN';
  const checkUSALocation = country === 'US';

  const handleChange = (changedValues) => {
    const taxValues = {
      ...taxData[0],
      ...changedValues,
    };
    const newList = [...taxData];
    newList.splice(0, 1, taxValues);
    const isModified = JSON.stringify(taxValues) !== JSON.stringify(taxDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { taxData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };
  const processDataChangesHaveId = () => {
    const { taxData: taxDataTemp } = props;
    const {
      incomeTaxRule = '',
      panNum = '',
      _id: id = '',
      nationalId = '',
      maritalStatus = '',
      noOfDependents = '',
      residencyStatus = '',
    } = taxDataTemp[0];
    const payloadChanges = {
      id,
      incomeTaxRule,
      panNum,
      nationalId,
      maritalStatus,
      noOfDependents,
      residencyStatus,
    };
    return payloadChanges;
  };
  const processDataChangesNoId = () => {
    const { taxData: taxDataTemp, employee } = props;
    const {
      incomeTaxRule = '',
      panNum = '',
      nationalId = '',
      maritalStatus = '',
      noOfDependents = '',
      residencyStatus = '',
    } = taxDataTemp[0];
    const payloadChanges = {
      employee,
      incomeTaxRule,
      panNum,
      nationalId,
      maritalStatus,
      noOfDependents,
      residencyStatus,
    };
    return payloadChanges;
  };

  const processDataKept = () => {
    const newObj = { ...taxData[0] };
    const listKey = [
      'incomeTaxRule',
      'panNum',
      'nationalId',
      'maritalStatus',
      'noOfDependents',
      'residencyStatus',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  const handleSave = () => {
    const dataTempKept = processDataKept() || {};
    const idTax = taxData[0] ? taxData[0]._id : '';
    if (idTax) {
      const payload = processDataChangesHaveId() || {};
      dispatch({
        type: 'employeeProfile/updateTax',
        payload,
        dataTempKept,
        key: 'openTax',
      });
    } else {
      const payload = processDataChangesNoId() || {};
      dispatch({
        type: 'employeeProfile/addTax',
        payload,
        dataTempKept,
        key: 'openTax',
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
          incomeTaxRule: taxData[0] ? taxData[0].incomeTaxRule : '',
          panNum: taxData[0] ? taxData[0].panNum : '',
          nationalId: taxData[0] ? taxData[0].nationalId : '',
          maritalStatus: taxData[0] ? taxData[0].maritalStatus : '',
          noOfDependents: taxData[0] ? taxData[0].noOfDependents : '',
          residencyStatus: taxData[0] ? taxData[0].residencyStatus : '',
        }}
        onValuesChange={handleChange}
        onFinish={handleSave}
      >
        {checkIndiaLocation ? (
          <Form.Item
            label="Income Tax Rule"
            name="incomeTaxRule"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: 'Please select an Income tax rule!',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
        ) : null}
        {checkIndiaLocation ? (
          <Form.Item
            label="PAN Number"
            name="panNum"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: 'Please enter your pan number!',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
        ) : null}

        {checkUSALocation ? (
          <Form.Item
            label="Social Security Card Number"
            name="nationalId"
            style={{ marginTop: '24px' }}
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: 'Please enter the National id card number',
              },
            ]}
          >
            <Input disabled maxLength={50} placeholder="Social Security Card Number" />
          </Form.Item>
        ) : null}
        {checkVietNamLocation ? (
          <Form.Item
            label="National ID Card Number"
            name="nationalId"
            style={{ marginTop: '24px' }}
            rules={[
              {
                required: true,
                message: 'Please enter the National id card number',
              },
            ]}
          >
            <Input maxLength={50} placeholder="National ID Card Number" />
          </Form.Item>
        ) : null}

        <Form.Item
          label="Marital Status"
          name="maritalStatus"
          validateTrigger="onChange"
          rules={[
            {
              required: true,
              message: 'Please select your marital status!',
            },
          ]}
        >
          <Select showArrow className={styles.selectForm}>
            <Select.Option value="Single">Single</Select.Option>
            <Select.Option value="Married">Married</Select.Option>
            <Select.Option value="Widowed">Widowed</Select.Option>
            <Select.Option value="Divorced">Divorced</Select.Option>
            <Select.Option value="Rather not mention">Rather not mention</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="No of dependants"
          name="noOfDependents"
          validateTrigger="onChange"
          rules={[
            {
              required: true,
              message: 'Please enter the no. of dependents!',
            },
          ]}
        >
          <Input className={styles.inputForm} />
        </Form.Item>

        <Form.Item
          label="Residency Status"
          name="residencyStatus"
          rules={[
            {
              required: true,
              message: 'Please select your residency status!',
            },
          ]}
        >
          <Select className={styles.selectForm} showArrow>
            <Select.Option value="Resident">Resident</Select.Option>
            <Select.Option value="Non Resident">Non Resident</Select.Option>
          </Select>
        </Form.Item>

        <div className={styles.spaceFooter}>
          <div className={styles.cancelFooter} onClick={() => handleCancel('tax')}>
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
        taxData: taxDataOrigin = {},
        employmentData: { location: locationProp = {} } = {},
      } = {},
      tempData: { taxData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/fetchTax'],
    employee,
    taxDataOrigin,
    taxData,

    locationProp,
  }),
)(EditTax);
