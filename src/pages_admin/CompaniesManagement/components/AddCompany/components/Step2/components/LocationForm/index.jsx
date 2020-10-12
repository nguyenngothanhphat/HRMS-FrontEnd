import React, { useState, useEffect } from 'react';

import { useIntl } from 'umi';
import { Form, Input, Select, InputNumber, Row, Col } from 'antd';
import bin from '../../images/bin.svg';

import styles from './index.less';

const LocationForm = (props) => {
  const { formIndex } = props;
  const { locations = [], listCountry, dispatch, locationItem, removeLocation } = props;

  const [country, setCountry] = useState('');
  // const [state, setState] = useState('');
  // const [initialLocation, setInitialLocation] = useState({
  //   address: '',
  //   country: '',
  //   state: '',
  //   zipCode: '',
  // });

  const [form] = Form.useForm();

  useEffect(() => {}, [locations]);

  const removeAutocomplete = () => {
    const searchInputs = document.querySelectorAll(`input[type='search']`);

    searchInputs.forEach((element) => element.setAttribute('autocomplete', 'nope'));
  };

  useEffect(() => {
    removeAutocomplete();
  }, []);

  const saveToStore = () => {
    const formValues = form.getFieldsValue();
    const { address = '', zipCode = '', country: countryValue = '', state = '' } = formValues;

    const data = {
      name: '',
      address,
      country: countryValue,
      state,
      zipCode,
      isheadQuarter: false,
      index: formIndex,
    };

    if (!dispatch) {
      return;
    }
    const returnedLocations = locations;

    const currentIndex = locations.findIndex((location) => location.index === formIndex);

    returnedLocations.splice(currentIndex, 1, data);

    dispatch({
      type: 'signup/save',
      payload: {
        locations: returnedLocations,
      },
    });
  };

  const handleOnChange = () => {
    // saveToStore();
  };

  useEffect(() => {
    saveToStore();
  }, [country]);

  const _renderSelectState = (index) => {
    if (!locations || locations.length === 0 || !locations[index]) {
      return (
        <Form.Item
          label={useIntl().formatMessage({ id: 'page.signUp.step2.state' })}
          name="state"
          className={styles.vertical}
        >
          <Select />
        </Form.Item>
      );
    }

    const countryValue = locations[index].country || '';

    const itemCountry = listCountry.find((item) => item._id === countryValue) || {};
    const listStateByItemCountry = itemCountry.states || [];

    return (
      <Form.Item
        label={useIntl().formatMessage({ id: 'page.signUp.step2.state' })}
        name="state"
        className={styles.vertical}
      >
        <Select value={locations[index].state}>
          {listStateByItemCountry.map((state, itemIndex) => (
            <Select.Option key={`${itemIndex + 1}`} value={state}>
              {state}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  return (
    <Form form={form} onValuesChange={() => saveToStore()} initialValues={locationItem}>
      <div className={styles.card}>
        <h2 className={styles.header}>Work location</h2>

        <Form.Item
          name="address"
          label={useIntl().formatMessage({ id: 'page.signUp.step2.address' })}
          className={styles.vertical}
          rules={[
            {
              required: true,
              message: useIntl().formatMessage({ id: 'page.signUp.step2.addressError' }),
            },
          ]}
        >
          <Input onChange={() => handleOnChange()} />
        </Form.Item>

        <Form.Item
          name="country"
          label={useIntl().formatMessage({ id: 'page.signUp.step2.country' })}
          className={styles.vertical}
          rules={[
            {
              required: true,
              message: useIntl().formatMessage({ id: 'page.signUp.step2.countryError' }),
            },
          ]}
        >
          <Select
            onChange={(value) => {
              setCountry(value);
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
            {_renderSelectState(formIndex)}
          </Col>

          <Col xm={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="zipCode"
              label={useIntl().formatMessage({ id: 'page.signUp.step2.zipCode' })}
              className={styles.vertical}
              rules={[
                {
                  required: true,
                  message: useIntl().formatMessage({ id: 'page.signUp.step2.zipCodeError' }),
                },
                {
                  pattern: /^[0-9]{6}$/,
                  message: useIntl().formatMessage({ id: 'page.signUp.step2.zipCodeError2' }),
                },
              ]}
            >
              <InputNumber onChange={() => handleOnChange()} />
            </Form.Item>
          </Col>
        </Row>

        <span className={styles.remove} onClick={() => removeLocation(formIndex)}>
          <img src={bin} alt="bin icon" />
          {useIntl().formatMessage({ id: 'page.signUp.step2.remove' })}
        </span>
      </div>
    </Form>
  );
};

export default LocationForm;
