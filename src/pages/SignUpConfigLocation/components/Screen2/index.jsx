import React, { useState, useEffect } from 'react';

import { connect, useIntl } from 'umi';
import { Form, Input, Select, InputNumber, Row, Col, Button } from 'antd';
import LocationForm from './components/LocationForm/index';

import styles from './index.less';

const Screen2 = (props) => {
  const [form] = Form.useForm();
  const [goNext, setGoNext] = useState(true);
  const { headQuarterAddress, listCountry, locations, dispatch } = props;
  const [currentIndex, setCurrentIndex] = useState(locations.length);

  const checkGoNext = () => {
    let check = true;
    locations.forEach((data) => {
      const {
        name = '',
        addressLine1 = '',
        zipCode = '',
        country: country1 = '',
        state = '',
        city = '',
      } = data;
      if (!name || !addressLine1 || !zipCode || !country1 || !state || !city) check = false;
    });
    setGoNext(check);
  };

  useEffect(() => {
    checkGoNext();
  }, [JSON.stringify(locations)]);

  useEffect(() => {
    if (locations.length > 0) {
      // Avoid duplicate index in location item
      setCurrentIndex(locations[locations.length - 1].index + 1);
    }
  }, [locations]);

  const onFinish = (values) => {
    // console.log('Success:', values);
    return null;
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  const addLocation = () => {
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          locations: [
            ...locations,
            {
              name: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              country: '',
              state: '',
              zipCode: '',
              isHeadQuarter: false,
              index: currentIndex,
            },
          ],
        },
      });
    }
    setCurrentIndex((prevState) => prevState + 1);
  };

  const removeLocation = (index) => {
    let newLocations = locations;
    newLocations = newLocations.filter((location) => location.index !== index);
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          locations: newLocations,
        },
      });
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

  const onChangeHeadquarterName = (e) => {
    dispatch({
      type: 'signup/saveHeadQuarterAddress',
      payload: { ...headQuarterAddress, name: e?.target?.value || 'Headquarter' },
    });
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="headquarter"
        initialValues={{
          remember: true,
          addressLine1: headQuarterAddress.addressLine1,
          addressLine2: headQuarterAddress.addressLine2,
          city: headQuarterAddress.city,
          country: headQuarterAddress.country,
          state: headQuarterAddress.state,
          zipCode: headQuarterAddress.zipCode,
          name: headQuarterAddress.name,
          locations: [
            {
              addressLine1: '',
              addressLine2: '',
              city: '',
              country: '',
              state: '',
              zipCode: '',
            },
          ],
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={styles.form}
      >
        <div className={styles.card}>
          <h2 className={styles.header}>
            {useIntl().formatMessage({ id: 'page.signUp.step2.workLocations' })}
          </h2>

          <p className={styles.description}>
            {useIntl().formatMessage({ id: 'page.signUp.step2.description' })}
          </p>

          <h2 className={styles.header}>
            {useIntl().formatMessage({ id: 'page.signUp.step2.headquarter' })}
          </h2>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input headquarter name!',
              },
            ]}
            className={styles.vertical}
          >
            <Input onChange={onChangeHeadquarterName} />
          </Form.Item>
          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[
              {
                required: true,
                message: useIntl().formatMessage({ id: 'page.signUp.step2.addressError' }),
              },
            ]}
            className={styles.vertical}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Address Line 2"
            name="addressLine2"
            // rules={[
            //   {
            //     required: true,
            //     message: useIntl().formatMessage({ id: 'page.signUp.step2.addressError' }),
            //   },
            // ]}
            className={styles.vertical}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="City Name*" className={styles.vertical} name="city">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={useIntl().formatMessage({ id: 'page.signUp.step2.country' })}
            name="country"
            rules={[
              {
                required: true,
                message: useIntl().formatMessage({ id: 'page.signUp.step2.countryError' }),
              },
            ]}
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
                label={useIntl().formatMessage({ id: 'page.signUp.step2.state' })}
                name="state"
                className={styles.vertical}
                rules={[
                  {
                    required: true,
                    message: useIntl().formatMessage({ id: 'page.signUp.step2.stateError' }),
                  },
                ]}
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
                label={useIntl().formatMessage({ id: 'page.signUp.step2.zipCode' })}
                name="zipCode"
                rules={[
                  {
                    required: true,
                    message: useIntl().formatMessage({ id: 'page.signUp.step2.zipCodeError' }),
                  },
                ]}
              >
                <InputNumber disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>

      {locations.map((location) => {
        const formIndex = location.index;
        return (
          <LocationForm
            key={location.index}
            dispatch={dispatch}
            formIndex={formIndex}
            locations={locations}
            locationItem={location}
            listCountry={listCountry}
            removeLocation={removeLocation}
          />
        );
      })}

      <Button className={styles.add} type="link" onClick={addLocation}>
        + Add work location
      </Button>

      <div className={styles.btnWrapper}>
        <Button className={styles.btn} onClick={() => navigate('previous')}>
          {useIntl().formatMessage({ id: 'page.signUp.step2.back' })}
        </Button>
        <Button
          disabled={!goNext}
          className={styles.btn}
          htmlType="submit"
          onClick={() => navigate('next')}
        >
          {useIntl().formatMessage({ id: 'page.signUp.step2.next' })}
        </Button>
      </div>
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
