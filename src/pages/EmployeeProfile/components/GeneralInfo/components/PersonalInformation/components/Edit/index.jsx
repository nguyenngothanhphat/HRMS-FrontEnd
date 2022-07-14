/* eslint-disable camelcase */
import { Button, Checkbox, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const Edit = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    generalData = {},
    generalDataOrigin,
    countryList = [],

    loading,
    handleCancel = () => {},
    // profileOwner = false,
    loadingStates,
  } = props;

  const {
    personalNumber = '',
    personalEmail = '',
    Blood = '',
    maritalStatus = '',
    nationality = '',
    residentAddress: {
      addressLine1: r_addressLine1 = '',
      addressLine2: r_addressLine2 = '',
      city: r_city = '',
      country: r_countryObj = {} || {},
      state: r_state = '',
      zipCode: r_zipCode = '',
    } = {},
    currentAddress: {
      addressLine1: c_addressLine1 = '',
      addressLine2: c_addressLine2 = '',
      city: c_city = '',
      country: c_countryObj = {} || {},
      state: c_state = '',
      zipCode: c_zipCode = '',
    } = {},
    _id: id = '',
  } = generalData || {};

  const { _id: r_country } = r_countryObj || {};
  const { _id: c_country } = c_countryObj || {};

  const [reListStates, setReListStates] = useState([]);
  const [curListStates, setCurListStates] = useState([]);
  const [isSameAddress, setIsSameAddress] = useState(false);

  useEffect(() => {
    // check same address
    if (
      Object.keys(generalData.residentAddress || {}).length > 0 &&
      Object.keys(generalData.currentAddress || {}).length > 0
    ) {
      const keys = Object.keys(generalData.currentAddress || {});
      const check = keys.every(
        (x) =>
          JSON.stringify(generalData.residentAddress[x]) ===
          JSON.stringify(generalData.currentAddress[x]),
      );
      setIsSameAddress(check);
    }
  }, [JSON.stringify(generalData)]);

  const onSelectCountry = (countryId, type) => {
    dispatch({
      type: 'employeeProfile/fetchCountryStates',
      payload: {
        id: countryId,
      },
    }).then((data) => {
      switch (type) {
        case 'resident':
          setReListStates(data);
          break;
        case 'current':
          setCurListStates(data);
          break;
        default: {
          break;
        }
      }
    });
  };

  useEffect(() => {
    if (r_country) {
      onSelectCountry(r_country, 'resident');
    }
    if (c_country) {
      onSelectCountry(c_country, 'current');
    }
  }, [c_country, r_country]);

  const setSameAddress = (values) => {
    form.setFieldsValue({
      c_addressLine1: values.r_addressLine1,
      c_addressLine2: values.r_addressLine2,
      c_city: values.r_city,
      c_country: values.r_country,
      c_state: values.r_state,
      c_zipCode: values.r_zipCode,
    });
  };

  useEffect(() => {
    if (isSameAddress) {
      const values = form.getFieldValue();
      setSameAddress(values);
    }
  }, [isSameAddress]);

  const onValuesChange = (changedValues, allValues) => {
    const generalInfo = {
      ...generalData,
      ...allValues,
    };
    const isModified = JSON.stringify(generalInfo) !== JSON.stringify(generalDataOrigin);

    if (isSameAddress) {
      setSameAddress(allValues);
    }
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  const processDataChanges = (values) => {
    const payloadChanges = {
      id,
      personalNumber: values.personalNumber,
      personalEmail: values.personalEmail,
      Blood: values.Blood,
      maritalStatus: values.maritalStatus,
      nationality: values.nationality,
      residentAddress: {
        addressLine1: values.r_addressLine1,
        addressLine2: values.r_addressLine2,
        city: values.r_city,
        country: values.r_country,
        state: values.r_state,
        zipCode: values.r_zipCode,
      },
      currentAddress: {
        addressLine1: values.c_addressLine1,
        addressLine2: values.c_addressLine2,
        city: values.c_city,
        country: values.c_country,
        state: values.c_state,
        zipCode: values.c_zipCode,
      },
    };

    return payloadChanges;
  };

  const processDataKept = () => {
    const newObj = { ...generalData };
    const listKey = [
      'personalNumber',
      'personalEmail',
      'Blood',
      'maritalStatus',
      'nationality',
      'residentAddress',
      'currentAddress',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  const handleSave = (values) => {
    const payload = processDataChanges(values) || {};
    const dataTempKept = processDataKept() || {};

    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openPersonalInfo',
    });
  };

  const handleSameAddress = (e) => {
    setIsSameAddress(e.target.checked);
  };

  const { Option } = Select;
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 9 },
      sm: { span: 12 },
    },
  };

  const formatCountryList = countryList.map((item) => {
    const { _id: value, name } = item;
    return {
      value,
      name,
    };
  });

  return (
    <Row gutter={[0, 24]} className={styles.root}>
      <Form
        className={styles.Form}
        name="personal_information"
        form={form}
        id="myForm"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        initialValues={{
          personalNumber: personalNumber || null,
          personalEmail: personalEmail || null,
          Blood: Blood || null,
          maritalStatus: maritalStatus || null,
          nationality: nationality || null,
          r_addressLine1: r_addressLine1 || null,
          r_addressLine2: r_addressLine2 || null,
          r_city: r_city || null,
          r_country: r_country || null,
          r_state: r_state || null,
          r_zipCode: r_zipCode || null,
          c_addressLine1: c_addressLine1 || null,
          c_addressLine2: c_addressLine2 || null,
          c_city: c_city || null,
          c_country: c_country || null,
          c_state: c_state || null,
          c_zipCode: c_zipCode || null,
        }}
        onValuesChange={onValuesChange}
        onFinish={handleSave}
      >
        <div className={styles.fieldsContainer}>
          <Form.Item
            label="Personal Number"
            name="personalNumber"
            rules={[
              {
                pattern:
                  // eslint-disable-next-line no-useless-escape
                  /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} placeholder="Enter the Personal Number" />
          </Form.Item>
          <Form.Item
            label="Personal Email"
            name="personalEmail"
            rules={[
              {
                type: 'email',
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} placeholder="Enter the Personal Email" />
          </Form.Item>
          <Form.Item label="Blood Group" name="Blood">
            <Select showArrow className={styles.selectForm}>
              <Option value="O-">O-</Option>
              <Option value="O+">O+</Option>
              <Option value="A-">A-</Option>
              <Option value="A+">A+</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select showArrow className={styles.selectForm} placeholder="Select the Marital Status">
              <Option value="Single">Single</Option>
              <Option value="Married">Married</Option>
              <Option value="Rather not mention">Rather not mention</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Nationality" name="nationality">
            <Input className={styles.inputForm} placeholder="Enter the Nationality" />
          </Form.Item>
          <div className={styles.addressTitle}>Permanent Address</div>
          <Form.Item label="Address Line 1" name="r_addressLine1">
            <Input
              placeholder="Enter the Address Line 1"
              className={styles.inputForm}
              rules={[
                {
                  required: true,
                  message: 'Please input address',
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Address Line 2" name="r_addressLine2">
            <Input placeholder="Enter the Address Line 2" className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="City name" name="r_city">
            <Input placeholder="Enter the City" />
          </Form.Item>

          <Form.Item label="Country" name="r_country">
            <Select
              className={styles.selectForm}
              placeholder="Select the Country"
              rules={[
                {
                  required: true,
                  message: 'Please choose country',
                  type: 'array',
                },
              ]}
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value) => {
                onSelectCountry(value, 'resident');
                form.setFieldsValue({
                  r_state: null,
                });
              }}
            >
              {formatCountryList.map((itemCountry) => {
                return (
                  <Option key={itemCountry.value} value={itemCountry.value}>
                    {itemCountry.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="State" name="r_state">
            <Select
              showArrow
              className={styles.selectForm}
              placeholder="Select the State"
              showSearch
              loading={loadingStates}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {reListStates.map((item, index) => {
                return (
                  <Option key={`${index + 1}`} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Zip/Postal Code" name="r_zipCode">
            <Input className={styles.selectForm} placeholder="Enter the Zip/Postal Code" />
          </Form.Item>

          {/* ///////////////////////////////////////////////////////// */}
          <div className={styles.addressTitle}>
            Current Address
            <Checkbox onChange={handleSameAddress} checked={isSameAddress}>
              Same as above
            </Checkbox>
          </div>
          <Form.Item label="Address line 1" name="c_addressLine1">
            <Input
              className={styles.inputForm}
              placeholder="Enter the Address Line 1"
              disabled={isSameAddress}
            />
          </Form.Item>
          <Form.Item label="Address line 2" name="c_addressLine2">
            <Input
              className={styles.inputForm}
              placeholder="Enter the Address Line 2"
              disabled={isSameAddress}
            />
          </Form.Item>
          <Form.Item label="City name" name="c_city">
            <Input placeholder="Enter the City" disabled={isSameAddress} />
          </Form.Item>

          <Form.Item label="Country" name="c_country">
            <Select
              showArrow
              className={styles.selectForm}
              placeholder="Select the Country"
              showSearch
              disabled={isSameAddress}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value) => {
                onSelectCountry(value, 'current');
                form.setFieldsValue({
                  c_state: null,
                });
              }}
            >
              {formatCountryList.map((itemCountry) => {
                return (
                  <Option key={itemCountry.value} value={itemCountry.value}>
                    {itemCountry.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="State" name="c_state">
            <Select
              showArrow
              className={styles.selectForm}
              placeholder="Select the State"
              showSearch
              disabled={isSameAddress}
              loading={loadingStates}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {curListStates.map((item, index) => {
                return (
                  <Option key={`${index + 1}`} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Zip/Postal Code" name="c_zipCode">
            <Input
              className={styles.selectForm}
              placeholder="Enter the Zip/Postal Code"
              disabled={isSameAddress}
            />
          </Form.Item>
        </div>
        <div className={styles.spaceFooter}>
          <div className={styles.cancelFooter} onClick={handleCancel}>
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
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      countryList = [],
    } = {},
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingStates: loading.effects['employeeProfile/fetchCountryStates'],
    generalDataOrigin,
    generalData,
    countryList,
  }),
)(Edit);
