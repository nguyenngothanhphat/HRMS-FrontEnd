import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import bin from '../../images/bin.svg';

import styles from './index.less';
import { array } from 'prop-types';

const LocationForm = (props) => {
  const [formIndex, setFormIndex] = useState(-1);
  const { value = [], onChange } = props;
  const { headQuarterAddress, locations, listCountry, dispatch, companyName = '' } = props;
  const [countryId, setCountryId] = useState('');
  const [countryInfo, setCountryInfo] = useState({});
  const [list, setList] = useState(locations.filter((item) => item.isheadQuarter === false));

  // const stateArr = countryInfo.states || [];

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
    setFormIndex((prevIndex) => prevIndex + 1);
    const newList = [...list, {}];
    setList(newList);

    // if (dispatch) {
    //   dispatch({
    //     type: 'signup/save',
    //     payload: {
    //       locations: [...locations, {}],
    //     },
    //   });
    // }
  };

  const removeLocation = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleOnChange = (fieldValue, fieldName, formIndex) => {
    // handleFieldChange(formIndex, fieldName, fieldValue);
    handleFieldChange(formIndex, fieldName, fieldValue);

    // console.log(list);

    let returnedLocations = [];

    const headquarter = {
      name: companyName,
      address: headQuarterAddress.address,
      country: headQuarterAddress.country,
      state: headQuarterAddress.state,
      zipCode: headQuarterAddress.zipCode,
      isheadQuarter: true,
    };
    returnedLocations.push(headquarter);

    list.map((item) => {
      const { address, country, state, zipCode } = item;
      const data = {
        name: companyName,
        address,
        country,
        state,
        zipCode,
        isheadQuarter: false,
      };
      returnedLocations.push(data);
    });
    console.log(returnedLocations);

    // save data to Store
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          locations: returnedLocations,
        },
      });
    }
  };

  const handleFieldChange = (index, fieldName, fieldValue) => {
    const item = list[index];
    const newItem = { ...item, [fieldName]: fieldValue };
    const newList = [...list];
    newList.splice(index, 1, newItem);
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
                  // defaultValue={address}
                  // defaultValue={locations[index].address}
                  value={address}
                  onChange={(e) => handleOnChange(e.target.value, 'address', index)}
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
                {/* <Input
                  defaultValue={country}
                  value={country}
                  onChange={(e) => handleOnChange(e.target.value, 'country')}
                /> */}
                <Select
                  // defaultValue={country}
                  // defaultValue={locations[index].country}
                  value={country}
                  onChange={(value) => {
                    handleOnChange(value, 'country', index);
                    // console.log(value);
                    setCountryInfo(listCountry.find((item) => item.name === country)); // Get all info of selected country
                    // console.log(countryInfo);
                  }}
                >
                  {listCountry.map((item) => {
                    const { name } = item;
                    return <Select.Option value={name}>{name}</Select.Option>;
                  })}
                </Select>
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
                      // defaultValue={state}
                      // defaultValue={locations[index].state}
                      value={state}
                      onChange={(value) => handleOnChange(value, 'state', index)}
                    >
                      {countryInfo &&
                        countryInfo.states &&
                        countryInfo.states.map((item) => {
                          return <Select.Option value={item}>{item}</Select.Option>;
                        })}
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
                      // defaultValue={zipCode}
                      // defaultValue={locations[index].zipCode}
                      value={zipCode}
                      onChange={(value) => handleOnChange(value, 'zipCode', index)}
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
