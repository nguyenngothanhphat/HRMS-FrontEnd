import React from 'react';
import { Typography, Row, Col, Form, Input } from 'antd';
import style from './index.less';

const InputField = () => {
  return (
    <div className={style.InputField}>
      <Typography.Text className={style.text}>Employer 1 Details</Typography.Text>
      <Row gutter={[48, 0]} className={style.form}>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colLeft}>
          <Form labelCol={24} wrapperCol={24} layout="vertical">
            <Form.Item label="Name of the employer*">
              <Input className={style.input} />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colRight}>
          <Form labelCol={24} wrapperCol={24} layout="vertical">
            <Form.Item label="Work Duration (In year, months, days)">
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
