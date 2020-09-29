import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import bin from './images/bin.svg';

import styles from './index.less';

const MyForm = (props) => {
  console.log(props);
  const { value = [] } = props;
  const [list, setList] = useState(value);
  const { address, country, state, zipCode } = list[0];

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (e, fieldName) => {
    console.log(e.target.value);
    console.log(fieldName);
  };

  const handleFieldChange = (index, fieldName, fieldValue) => {
    const item = list[index];
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>Work location</h2>

      {/* <Form
        form={form}
        // ref={(ref) => {
        //   formRef = ref;
        // }}
        name="headquarter"
        initialValues={{ remember: true, address, state, zipCode, country }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={styles.form}
      > */}
      <Form.Item
        label="Address"
        // name="address"
        rules={[{ required: true, message: 'Please input your address!' }]}
        className={styles.vertical}
      >
        <Input defaultValue={address} onChange={(e) => onChange(e, 'address')} />
      </Form.Item>

      <Form.Item
        label="Country"
        // name="country"
        rules={[{ required: true, message: 'Please input your country!' }]}
        className={styles.vertical}
      >
        <Input defaultValue={country} />
      </Form.Item>

      <Row gutter={30}>
        <Col xm={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="State"
            // name="state"
            className={styles.vertical}
            rules={[{ required: true, message: 'Please select your state!' }]}
          >
            <Select defaultValue={state}>
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
            // name="zipCode"
            rules={[{ required: true, message: 'Please input your Zip code!' }]}
          >
            <InputNumber defaultValue={zipCode} />
          </Form.Item>
        </Col>
      </Row>

      {/* <Button htmlType="submit">SUBMIT</Button> */}

      <span className={styles.remove}>
        <img src={bin} alt="bin icon" />
        Remove location
      </span>
      {/* </Form> */}
    </div>
  );
};

const Screen2 = (props) => {
  const [forms, setForms] = useState([]);
  let [form] = Form.useForm();
  let formRef = useRef();

  useEffect(() => {
    setForms((prevState) => {
      console.log([...prevState, form]);
      return [...prevState, form];
    });
  }, []);

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
  // console.log(address, state, zipCode);

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const addLocation = () => {
    console.log('ADD');
  };

  const submit = (values) => {
    // const formValues = form.getFieldsValue();
    // console.log('SUBMIT', formValues);
    console.log(values);
    // console.log(formRef);
    // formRef.current.onFinish();
  };

  const valueReturned = (values) => {
    console.log(values);
  };

  return (
    <div className={styles.container}>
      <Form
        form={forms[0]}
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
              //  defaultValue="asd"
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input your country!' }]}
            className={styles.vertical}
          >
            <Input disabled />
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
        <Form.Item name="locations">
          <MyForm />
        </Form.Item>
      </Form>

      <div>
        {/* {forms[1] && (
        <div className={styles.card}>
          <h2 className={styles.header}>Work location</h2>

          <Form
            form={form[1]}
            name="headquarter"
            initialValues={{ remember: true, address, state, zipCode, country }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={styles.form}
          >
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
              className={styles.vertical}
            >
              <Input
              //  defaultValue="asd"
              />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please input your country!' }]}
              className={styles.vertical}
            >
              <Input />
            </Form.Item>

            <Row gutter={30}>
              <Col xm={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="State"
                  name="state"
                  className={styles.vertical}
                  rules={[{ required: true, message: 'Please select your state!' }]}
                >
                  <Select>
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
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )} */}
      </div>

      <Button className={styles.add} type="link" onClick={addLocation}>
        + Add work location
      </Button>

      <div className={styles.btnWrapper}>
        <Button className={styles.btn}>Back</Button>
        <Button className={styles.btn} onClick={submit}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Screen2;
