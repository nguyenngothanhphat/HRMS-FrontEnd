import React, { useState } from 'react';
import { Typography, Row, Col, Form, Input } from 'antd';
import style from './index.less';

const InputField = ({ onValuesChange, employerName }) => {
  const [workDuration] = useState('');
  return (
    <div className={style.InputField}>
      <Typography.Text className={style.text}>Employer 1 Details</Typography.Text>
      <Row gutter={[48, 0]} className={style.form}>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colLeft}>
          <Form labelCol={24} wrapperCol={24} layout="vertical" initialValues={{ employerName }}>
            <Form.Item label="Name of the employer*" name="employerName">
              <Input className={style.input} disabled="true" />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colRight}>
          <Form
            labelCol={24}
            wrapperCol={24}
            layout="vertical"
            onValuesChange={onValuesChange}
            initialValues={{ workDuration }}
          >
            <Form.Item label="Work Duration (In year, months, days)*" name="workDuration">
              <Input className={style.inputDate} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Typography.Text className={style.bottomTitle}>Proof of employment</Typography.Text>
    </div>
  );
};

export default InputField;
