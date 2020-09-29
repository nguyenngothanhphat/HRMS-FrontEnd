import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import bin from './images/bin.svg';
import LocationForm from './components/LocationForm';

import styles from './index.less';

const Screen2 = (props) => {
  let [form] = Form.useForm();
  let formRef = useRef();

  const {
    headquarterInfo = {
      address: '240 E. Gish Rd, Suite 240, San Jose, CA',
      state: 'california',
      zipCode: '95112',
      country: 'America',
    },
  } = props;

  const {
    workLocationInfo = {
      address: 'address2',
      state: 'mahattan',
      zipCode: '12345',
      country: 'US',
    },
  } = props;

  const { address, state, zipCode, country } = headquarterInfo;

  const onFinish = (values) => {
    console.log('Success:', values);
    const { address, country, state, zipCode, locations } = values;
    // if (!address || !country || !state || !zipCode || !locations) {
    console.log(locations);
    if (locations) console.log('Form not valid');
    return;
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const addLocation = () => {
    console.log('ADD');
  };

  const submit = () => {
    const errors = form.getFieldsError();
    if (errors && errors.length > 0) {
      // console.log('Form not valid');
      console.log(errors);
      return;
    }
    const values = form.getFieldsValue();
    console.log(values);
  };

  const valueReturned = (values) => {
    console.log(values);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="headquarter"
        initialValues={{
          remember: true,
          address,
          state,
          zipCode,
          country,
          locations: [
            {
              address: 'a1',
              country: 'c1',
              state: 'manhattan',
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
            <Input
            // disabled
            />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input your country!' }]}
            className={styles.vertical}
          >
            <Input
            //  disabled
            />
          </Form.Item>

          <Row gutter={30}>
            <Col xm={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="State"
                name="state"
                className={styles.vertical}
                rules={[{ required: true, message: 'Please select your state!' }]}
              >
                <Select
                //  disabled
                >
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
                <InputNumber
                //  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Clone */}
        <Form.Item name="locations">
          <LocationForm />
        </Form.Item>

        <div className={styles.btnWrapper}>
          <Button className={styles.btn}>Back</Button>
          <Button
            className={styles.btn}
            htmlType="submit"
            //  onClick={submit}
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Screen2;
