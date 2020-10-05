import React from 'react';

import { connect } from 'umi';
import { Form, Input, Select, InputNumber, Row, Col, Button, message } from 'antd';
import LocationForm from './components/LocationForm/index';

import styles from './index.less';

const Screen2 = (props) => {
  const [form] = Form.useForm();

  const { headQuarterAddress, listCountry, name: companyName, locations, dispatch } = props;

  const onFinish = (values) => {
    console.log('Success:', values);
    // const { locations } = values;
    // if (!address || !country || !state || !zipCode || !locations) {
    // if (locations) console.log('Form not valid');
    return null;
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const buildValidator = (fieldName, value) => {
    // console.log('fieldName', fieldName);
    // console.log('value', value);

    let message = '';

    // if (!value) {
    //   return message;
    // }

    if (fieldName === 'address') {
      // msg = value.length === 0 ? 'Name is required' : '';
      if (!value) {
        message = 'Address is required!';
      }
    }

    if (fieldName === 'zipCode') {
      const regEx = new RegExp(/^[0-9]{6}$/);
      if (!value) {
        message = 'Zip code is required!';
      } else if (!regEx.exec(value)) {
        message = 'Zip code must contain 6 digits!';
      }
    }

    if (fieldName === 'country') {
      if (!value) {
        message = 'Please select country!';
      }
    }

    if (fieldName === 'country') {
      if (!value) {
        message = 'Please select state!';
      }
    }

    return message;
    // return `\n${msg}`;
  };

  const locationValidate = (rule, locations, callback) => {
    let msg = '';
    if (Array.isArray(locations) && locations.length > 0) {
      locations.every((location, index) => {
        if (index === 0) {
          // Skip headquarter location
          return true;
        }
        console.log(location);
        const keys = Object.keys(location);

        const flag = keys.every((key) => {
          const value = location[key];
          const errorMessage = buildValidator(key, value);

          if (errorMessage) {
            if (!msg.includes(errorMessage)) {
              // If final error message hasn't had this error message
              msg = errorMessage;
            }
            return false;
          }
          return true;
        });

        return flag;
      });
    }

    if (msg.length > 0) {
      callback(msg);
    }
  };

  const navigate = (type) => {
    let step;
    if (type === 'previous') {
      step = 0;
    }
    if (type === 'next') {
      step = 2;
    }

    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: { currentStep: step },
      });
    }
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="headquarter"
        initialValues={{
          remember: true,
          address: headQuarterAddress.address,
          country: headQuarterAddress.country,
          state: headQuarterAddress.state,
          zipCode: headQuarterAddress.zipCode,
          locations: [
            {
              address: 'a1',
              country: '',
              state: '',
              zipCode: 'z1',
            },
          ],
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={styles.form}
      >
        <div className={styles.card}>
          <h2 className={styles.header}>Work locations</h2>

          <p className={styles.description}>
            We need to collect this information to assign your employees to the right office. We
            will allow you to office specific administrators, filter employees per work location.
          </p>

          <h2 className={styles.header}>Headquarter address</h2>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
            className={styles.vertical}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input your country!' }]}
            className={styles.vertical}
          >
            {/* <Input disabled /> */}
            <Select disabled>
              <Select.Option value="america">America</Select.Option>
              <Select.Option value="britain">Britain</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={30}>
            <Col xm={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="State"
                name="state"
                className={styles.vertical}
                rules={[{ required: true, message: 'Please select your state!' }]}
              >
                <Select disabled>
                  <Select.Option value="california">California</Select.Option>
                  <Select.Option value="manhattan">Manhattan</Select.Option>
                  <Select.Option value="newyork">New York</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xm={24} sm={24} md={12} lg={12}>
              <Form.Item
                className={styles.vertical}
                label="Zip code"
                name="zipCode"
                rules={[{ required: true, message: 'Please input your Zip code!' }]}
              >
                <InputNumber disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Clone */}
        <Form.Item
          name="locations"
          rules={[
            {
              validator: locationValidate,
            },
          ]}
        >
          <LocationForm
            listCountry={listCountry}
            headQuarterAddress={headQuarterAddress}
            locations={locations}
            companyName={companyName}
            dispatch={dispatch}
          />
        </Form.Item>

        <div className={styles.btnWrapper}>
          <Button className={styles.btn} onClick={() => navigate('previous')}>
            Back
          </Button>
          <Button className={styles.btn} htmlType="submit" onClick={() => navigate('next')}>
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

// export default Screen2;
export default connect(
  ({
    signup: { headQuarterAddress = {}, locations, company: { name = '' } = {} } = {},
    country: { listCountry = [] } = {},
  }) => ({
    name,
    headQuarterAddress,
    locations,
    listCountry,
  }),
)(Screen2);
