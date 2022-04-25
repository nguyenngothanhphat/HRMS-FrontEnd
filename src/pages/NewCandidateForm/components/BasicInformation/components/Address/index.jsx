import { Checkbox, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { Page } from '@/pages/NewCandidateForm/utils';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import styles from './index.less';

const Address = (props) => {
  const { disabled = false, onSameAddress = () => {}, isSameAddress = false } = props;

  const fields = [
    {
      name: 'AddressLine1',
      label: 'Address Line 1',
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
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" placeholder="Country" />,
    },
    {
      name: 'State',
      label: 'State',
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" placeholder="State" />,
    },
    {
      name: 'City',
      label: 'City',
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" placeholder="City" />,
    },
    {
      name: 'ZipCode',
      label: 'Zip/Postal Code',
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
        <Checkbox onChange={onSameAddress} disabled={disabled} checked={isSameAddress}>
          Same as above
        </Checkbox>
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
      <div span={24} className={styles.form}>
        <RenderAddQuestion page={Page.Basic_Information} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Address);
