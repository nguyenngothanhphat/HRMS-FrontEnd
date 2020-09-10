import React from 'react';
import { Typography, Space, Form, Radio } from 'antd';
import send from './Assets/path.svg';
import style from './index.less';

const index = () => {
  return (
    <div className={style.SendEmail}>
      <div className={style.header}>
        <Space direction="horizontal">
          <div className={style.icon}>
            <div className={style.inside}>
              <img src={send} alt="send-icon" className={style.send} />
            </div>
          </div>
          <Typography.Text className={style.text}>Sent Form</Typography.Text>
        </Space>
      </div>
      <div className={style.body}>
        <Form>
          <Form.Item>
            <Radio.Group>
              <Radio value={1}>
                Via Email <br />
                <Typography.Text>
                  The form will be sent on candidate’s private email id.
                </Typography.Text>
              </Radio>
              <br />
              <Radio value={2}>
                Generate Link <br />
                <Typography.Text>
                  The link to the form will be generated which can be shared.
                </Typography.Text>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default index;
