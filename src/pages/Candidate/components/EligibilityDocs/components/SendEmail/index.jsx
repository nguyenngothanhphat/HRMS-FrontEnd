import React from 'react';
import { Typography, Space, Radio, Input, Form, Button } from 'antd';
import send from './Assets/group-11.svg';
import style from './index.less';

const index = ({ email, handleSendEmail }) => {
  console.log('initial', email);

  return (
    <div className={style.SendEmail}>
      <div className={style.header}>
        <Space direction="horizontal">
          <div className={style.icon}>
            <div className={style.inside}>
              <img src={send} alt="sent-icon" className={style.send} />
            </div>
          </div>
          <Typography.Text className={style.text}>Send Form</Typography.Text>
        </Space>
      </div>

      <div className={style.body}>
        <Radio.Group defaultValue={1} className={style.radioContainer}>
          <Radio value={1} className={style.radioItem}>
            Via Mail
            <p className={style.radioHelper}>The form will be sent to HR</p>
          </Radio>
          <br />
        </Radio.Group>
      </div>
      <div className={style.email}>
        <div className={style.line} />
        <Form
          onFinish={handleSendEmail}
          layout="vertical"
          className={style.emailForm}
          initialValues={{ email }}
        >
          <Form.Item name="email" label="email">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Send Email</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default index;
