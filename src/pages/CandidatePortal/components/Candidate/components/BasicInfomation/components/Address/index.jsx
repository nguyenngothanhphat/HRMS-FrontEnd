import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const Address = (props) => {
  const {
    dispatch,
    disabled = false,
    onSameAddress = () => {},
    isSameAddress = false,
    candidatePortal: { countryList = [], stateList = [] } = {},
    loadingFetchCountry = false,
    loadingFetchState = false,
    form,
  } = props;

  const fetchCountryList = () => {
    dispatch({
      type: 'candidatePortal/fetchCountryList',
    });
  };

  const fetchStateListByCountry = (id, type) => {
    dispatch({
      type: 'candidatePortal/fetchStateByCountry',
      payload: { id },
    });

    // if country changes, remove selected state
    form.setFieldsValue({
      [`${type}State`]: null,
    });
    if (type === 'current') {
      form.setFieldsValue({
        permanentState: null,
      });
    }
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  const fields = [
    {
      name: 'AddressLine1',
      label: 'Address Line 1',
      rules: [
        {
          required: true,
          message: 'Required field',
        },
      ],
      span: {
        xs: 24,
        md: 24,
      },
      component: (disabled2) => (
        <Input disabled={disabled || disabled2} autoComplete="off" placeholder="Address Line 1" />
      ),
    },
    {
      name: 'AddressLine2',
      label: 'Address Line 2',
      span: {
        xs: 24,
        md: 24,
      },
      component: (disabled2) => (
        <Input disabled={disabled || disabled2} autoComplete="off" placeholder="Address Line 2" />
      ),
    },
    {
      name: 'Country',
      label: 'Country',
      rules: [
        {
          required: true,
          message: 'Required field',
        },
      ],
      span: {
        xs: 24,
        md: 12,
      },
      component: (disabled2, type) => (
        <Select
          autoComplete="off"
          placeholder="Country"
          onChange={(id) => fetchStateListByCountry(id, type)}
          disabled={disabled || disabled2}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
          showSearch
          loading={loadingFetchCountry}
        >
          {countryList.map((x) => (
            <Option key={x._id} value={x._id}>
              {x.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'State',
      label: 'State',
      rules: [
        {
          required: true,
          message: 'Required field',
        },
      ],
      span: {
        xs: 24,
        md: 12,
      },
      component: (disabled2) => (
        <Select
          disabled={disabled || disabled2}
          autoComplete="off"
          placeholder="State"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
          showSearch
          loading={loadingFetchState}
        >
          {stateList.map((x) => (
            <Option key={x} value={x}>
              {x}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'City',
      label: 'City',
      rules: [
        {
          required: true,
          message: 'Required field',
        },
      ],
      span: {
        xs: 24,
        md: 12,
      },
      component: (disabled2) => (
        <Input disabled={disabled || disabled2} autoComplete="off" placeholder="City" />
      ),
    },
    {
      name: 'ZipCode',
      label: 'Zip/Postal Code',
      rules: [
        {
          required: true,
          message: 'Required field',
        },
      ],
      span: {
        xs: 24,
        md: 12,
      },
      component: (disabled2) => (
        <Input disabled={disabled || disabled2} autoComplete="off" placeholder="Zip Code" />
      ),
    },
  ];

  return (
    <div className={styles.Address}>
      <div className={styles.form}>
        <Row gutter={[24, 0]}>
          {fields.map((x) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Col {...x.span}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={x.label}
                name={`${'current'}${x.name}`}
                rules={x.rules}
              >
                {x.component(false, 'current')}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
      <div className={styles.addressTitle}>
        Permanent Address
        <Form.Item name="isSameAddress" valuePropName="value">
          <Checkbox onChange={onSameAddress} disabled={disabled} checked={isSameAddress}>
            Same as above
          </Checkbox>
        </Form.Item>
      </div>
      <div className={styles.form}>
        <Row gutter={[24, 0]}>
          {fields.map((x) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Col {...x.span}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={x.label}
                name={`permanent${x.name}`}
                rules={x.rules}
              >
                {x.component(isSameAddress, 'permanent')}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default connect(({ candidatePortal, loading }) => ({
  candidatePortal,
  loadingFetchCountry: loading.effects['candidatePortal/fetchCountryList'],
  loadingFetchState: loading.effects['candidatePortal/fetchStateByState'],
}))(Address);
