import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import { array } from 'prop-types';
import bin from '../../images/bin.svg';

import styles from './index.less';

const LocationForm = (props) => {
  // const [formIndex, setFormIndex] = useState(-1);
  // const { value = [], onChange } = props;
  const { onChange } = props;
  const { headQuarterAddress, locations, listCountry, dispatch, companyName = '' } = props;
  // const [countryId, setCountryId] = useState('');
  // const [countryInfo, setCountryInfo] = useState({});
  const [list, setList] = useState([]);

  useEffect(() => {
    if (locations.length === 0) {
      setList([...locations, { ...headQuarterAddress, isheadQuarter: true, name: companyName }]);
    } else {
      setList([...locations]);
    }
  }, []);

  const updateLocations = () => {
    const returnedLocations = [];
    list.map((item) => {
      const { address = '', country = '', state = '', zipCode = '', isheadQuarter = false } = item;
      const data = {
        name: companyName,
        address,
        country,
        state,
        zipCode,
        isheadQuarter: isheadQuarter || false,
      };
      returnedLocations.push(data);
      return null;
    });

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

  useEffect(() => {
    onChange(list);
    updateLocations();
  }, [list]);

  // const onFinish = (values) => {
  //   console.log('Success:', values);
  // };

  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  const addLocation = () => {
    // setFormIndex((prevIndex) => prevIndex + 1);
    const newList = [...list, {}];
    setList(newList);
  };

  const removeLocation = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleFieldChange = (index, fieldName, fieldValue) => {
    const item = list[index];
    const newItem = { ...item, [fieldName]: fieldValue };
    const newList = [...list];
    newList.splice(index, 1, newItem);
    setList(newList);
  };

  const handleOnChange = (fieldValue, fieldName, formIndex) => {
    handleFieldChange(formIndex, fieldName, fieldValue);
  };

  const _renderSelectState = (index) => {
    const country = list[index].country || {};
    const itemCountry = listCountry.find((item) => item._id === country) || {};
    const listStateByItemCountry = itemCountry.states || [];

    return (
      <Form.Item
        label="State"
        className={styles.vertical}
        rules={[{ required: true, message: 'Please select your state!' }]}
      >
        <Select
          value={list[index].state}
          onChange={(value) => handleOnChange(value, 'state', index)}
        >
          {listStateByItemCountry.map((state) => (
            <Select.Option value={state}>{state}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  return (
    <>
      {list.length > 1 &&
        list.map((item, index) => {
          if (index === 0) {
            return null;
          }
          const { address, country, zipCode } = item;
          return (
            <div key={`${index + 1}`} className={styles.card}>
              <h2 className={styles.header}>Work location</h2>

              <Form.Item
                label="Address"
                rules={[
                  { required: true, message: 'Please input your address!' },
                  { type: array, message: 'All fields must be filled' },
                ]}
                className={styles.vertical}
              >
                <Input
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
                <Select
                  value={country}
                  onChange={(value) => {
                    handleOnChange(value, 'country', index);
                  }}
                  showArrow
                  showSearch
                  filterOption={
                    (input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  {listCountry.map((countryItem) => {
                    const { name, _id } = countryItem;
                    return <Select.Option key={_id}>{name}</Select.Option>;
                  })}
                </Select>
              </Form.Item>

              <Row gutter={30}>
                <Col xm={24} sm={24} md={12} lg={12}>
                  {_renderSelectState(index)}
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

              <span className={styles.remove} onClick={() => removeLocation(index)}>
                <img src={bin} alt="bin icon" />
                Remove location
              </span>
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
