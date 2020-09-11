import React from 'react';
import { Typography, Space, Radio } from 'antd';
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
        <Radio.Group className={style.radioContainer}>
          <Radio value={1} className={style.radioItem}>
            Via Email
            <p className={style.radioHelper}>
              The form will be sent on candidate’s private email id.
            </p>
          </Radio>
          <br />
          <Radio value={2} className={style.radioItem}>
            Generate Link
            <p className={style.radioHelper}>
              The link to the form will be generated which can be shared.
            </p>
          </Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

export default index;
