import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';

import { array } from 'prop-types';
import bin from '../../images/bin.svg';

import styles from './index.less';

const LocationForm = (props) => {
  const { onChange } = props;
  const { headQuarterAddress, locations, listCountry, dispatch, companyName = '' } = props;
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

  const removeAutocomplete = () => {
    const searchInputs = document.querySelectorAll(`input[type='search']`);
    searchInputs.forEach((element) => element.setAttribute('autocomplete', 'nope'));
  };

  useEffect(() => {
    onChange(list);
    updateLocations();
    removeAutocomplete();
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
      <div className={styles.vertical}>
        <span className={styles.label}>State</span>
        <Select
          value={list[index].state}
          onChange={(value) => handleOnChange(value, 'state', index)}
        >
          {listStateByItemCountry.map((state) => (
            <Select.Option value={state}>{state}</Select.Option>
          ))}
        </Select>
      </div>
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

              <div className={styles.vertical}>
                <span className={styles.label}>Address</span>
                <Input
                  value={address}
                  onChange={(e) => handleOnChange(e.target.value, 'address', index)}
                />
              </div>

              <div className={styles.vertical}>
                <span className={styles.label}>Country</span>
                <Select
                  value={country}
                  onChange={(value) => {
                    handleOnChange(value, 'country', index);
                  }}
                  // autocomplete="nope"
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
              </div>

              <Row gutter={30}>
                <Col xm={24} sm={24} md={12} lg={12}>
                  {_renderSelectState(index)}
                </Col>

                <Col xm={24} sm={24} md={12} lg={12}>
                  <div className={styles.vertical}>
                    <span className={styles.label}>Zip code</span>
                    <InputNumber
                      value={zipCode}
                      onChange={(value) => handleOnChange(value, 'zipCode', index)}
                    />
                  </div>
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
