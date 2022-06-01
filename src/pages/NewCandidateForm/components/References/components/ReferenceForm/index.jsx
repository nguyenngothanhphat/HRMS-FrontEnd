import { Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
// import { Page } from '@/pages/NewCandidateForm/utils';
import styles from './index.less';

const ReferenceForm = (props) => {
  const { disabled = true, index = 0, name = '', references = [] } = props;
  const [isOther, setIsOther] = useState(false);

  useEffect(() => {
    if (JSON.stringify(references)) {
      const item = references[index];
      setIsOther(item?.relationship === 'other');
    }
  }, [JSON.stringify(references)]);

  const fields = [
    {
      label: 'First Name',
      name: [name, 'firstName'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          pattern: /[^\s-]/,
          message: 'First name is invalid!',
        },
      ],
    },
    {
      label: 'Last Name',
      name: [name, 'lastName'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          pattern: /[^\s-]/,
          message: 'Last name is invalid!',
        },
      ],
    },
    {
      label: 'Personal e-mail ID',
      name: [name, 'personEmail'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          type: 'email',
          message: 'Invalid email',
        },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('workEmail') !== value) {
              return Promise.resolve();
            }
            // eslint-disable-next-line compat/compat
            return Promise.reject(new Error('Two emails cannot be the same!'));
          },
        }),
      ],
    },
    {
      label: 'Phone Number',
      name: [name, 'phoneNumber'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          pattern: /^\d+$/,
          message: 'Only digit !',
        },
      ],
    },
    {
      label: 'Company',
      name: [name, 'company'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          pattern: /[^\s-]/,
          message: 'Company name is invalid!',
        },
      ],
    },
    {
      label: 'Designation',
      name: [name, 'designation'],
      span: {
        xs: 24,
        md: 12,
      },
      component: <Input disabled={disabled} autoComplete="off" />,
      rules: [
        { required: true, message: 'Required field' },
        {
          pattern: /[^\s-]/,
          message: 'Designation is invalid!',
        },
      ],
    },
  ];

  return (
    <div className={styles.ReferenceForm}>
      <div className={styles.form}>
        <p className={styles.title}>Reference {index + 1}</p>
        <Row gutter={[24, 0]}>
          {fields.map((x) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Col {...x.span} key={x.name}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={x.label}
                name={x.name}
                rules={x.rules}
              >
                {x.component}
              </Form.Item>
            </Col>
          ))}
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Relationship to Referee"
              name={[name, 'relationship']}
              rules={[{ required: true, message: 'Required field' }]}
            >
              <Select
                disabled={disabled}
                autoComplete="off"
                onChange={(value) => setIsOther(value === 'other')}
              >
                <Select.Option value="colleague">Colleague</Select.Option>
                <Select.Option value="managedDirectly">Managed Directly</Select.Option>
                <Select.Option value="reportedDirectly">Reported Directly</Select.Option>
                <Select.Option value="professor">Professor</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {isOther && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label="If other, please mention"
                name={[name, 'other']}
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input disabled={disabled} autoComplete="off" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default connect(() => ({}))(ReferenceForm);
