import React from 'react';
import { Typography, Space } from 'antd';
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
          <Typography.Text>Sent Form</Typography.Text>
        </Space>
      </div>
    </div>
  );
};

export default index;
