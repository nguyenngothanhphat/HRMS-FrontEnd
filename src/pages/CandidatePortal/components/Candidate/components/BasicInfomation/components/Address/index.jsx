import { Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const Address = (props) => {
  const { disabled = false, onSameAddress = () => {}, isSameAddress = false, form } = props;

  useEffect(() => {
    ['AddressLine1', 'AddressLine2', 'Country', 'City', 'State', 'ZipCode'].forEach((x) => {
      const input = form.getFieldInstance(`permanent${x}`);
      if (input) {
        input.input.disabled = isSameAddress;
      }
    });
  }, [isSameAddress]);

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
      component: <Input disabled={disabled} autoComplete="off" placeholder="Address Line 1" />,
    },
    {
      name: 'AddressLine2',
      label: 'Address Line 2',
      span: {
        xs: 24,
        md: 24,
      },
      component: <Input disabled={disabled} autoComplete="off" placeholder="Address Line 2" />,
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
      component: <Input disabled={disabled} autoComplete="off" placeholder="Country" />,
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
      component: <Input disabled={disabled} autoComplete="off" placeholder="State" />,
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
      component: <Input disabled={disabled} autoComplete="off" placeholder="City" />,
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
      component: <Input disabled={disabled} autoComplete="off" placeholder="Zip Code" />,
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
                name={`current${x.name}`}
                rules={x.rules}
              >
                {x.component}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
      <div className={styles.addressTitle}>
        Permanent Address
        <Form.Item name="isSameAddress" valuePropName="value">
          <Checkbox onChange={onSameAddress} disabled={disabled}>
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
                {x.component}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Address);
