import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import bin from '../../images/bin.svg';

import styles from './index.less';
import { array } from 'prop-types';

const LocationForm = (props) => {
  const [formIndex, setFormIndex] = useState(0);
  const { value = [], onChange } = props;
  const [list, setList] = useState(value);

  useEffect(() => {
    onChange(list);
  }, [list]);

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const addLocation = () => {
    const newList = [...list, {}];
    setList(newList);
    setFormIndex((prevIndex) => prevIndex + 1);
  };

  const removeLocation = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleOnChange = (fieldValue, fieldName) => {
    handleFieldChange(formIndex, fieldName, fieldValue);
  };

  const handleFieldChange = (index, fieldName, fieldValue) => {
    const item = list[index];
    const newItem = { ...item, [fieldName]: fieldValue };
    console.log(newItem);
    const newList = [...list];
    newList.splice(index, 1, newItem);
    console.log(newList);
    setList(newList);
  };

  return (
    <>
      {list.length > 0 &&
        list.map((item, index) => {
          const { address, country, state, zipCode } = item;
          return (
            <div key={index} className={styles.card}>
              <h2 className={styles.header}>Work location</h2>

              <Form.Item
                label="Address"
                rules={[
                  { required: true, message: 'Please input your address!' },
                  { type: array, message: 'All fields must be filled' },
                  //   { min: 0, message: 'Address should not be empty!' },
                ]}
                className={styles.vertical}
              >
                <Input
                  defaultValue={address}
                  value={address}
                  onChange={(e) => handleOnChange(e.target.value, 'address')}
                />
              </Form.Item>

              <Form.Item
                label="Country"
                rules={[
                  { required: true, message: 'Please input your country!' },
                  { min: 0, message: 'Country should not be empty!' },
                ]}
                className={styles.vertical}
              >
                <Input
                  defaultValue={country}
                  value={country}
                  onChange={(e) => handleOnChange(e.target.value, 'country')}
                />
              </Form.Item>

              <Row gutter={30}>
                <Col xm={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    label="State"
                    // name="state"
                    className={styles.vertical}
                    rules={[{ required: true, message: 'Please select your state!' }]}
                  >
                    <Select
                      defaultValue={state}
                      value={state}
                      onChange={(value) => handleOnChange(value, 'state')}
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
                    // name="zipCode"
                    rules={[
                      { required: true, message: 'Please input your Zip code!' },
                      { min: 0, message: 'Zip code should not be empty!' },
                      { min: 5, message: 'Zip code max length is 5!' },
                    ]}
                  >
                    <InputNumber
                      defaultValue={zipCode}
                      value={zipCode}
                      onChange={(value) => handleOnChange(value, 'zipCode')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* <Button htmlType="submit">SUBMIT</Button> */}

              <span className={styles.remove} onClick={() => removeLocation(index)}>
                <img src={bin} alt="bin icon" />
                Remove location
              </span>
              {/* </Form> */}
            </div>
          );
        })}

      <Button className={styles.add} type="link" onClick={addLocation}>
        + Add work location
      </Button>
    </>
  );
};

export default LocationForm;
