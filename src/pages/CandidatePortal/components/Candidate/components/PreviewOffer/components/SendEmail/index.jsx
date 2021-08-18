import React from 'react';
import { Typography, Space, Radio, Input, Form, Button } from 'antd';
import send from './Assets/group-11.svg';
import sent from './Assets/modal_img_1.png';
import style from './index.less';

const index = ({ email, handleSendEmail, onValuesChangeEmail, isSentEmail, handleSubmitAgain }) => {
  return (
    <div className={style.SendEmail}>
      <div className={isSentEmail ? style.header1 : style.header}>
        {isSentEmail ? (
          <Space direction="horizontal">
            <div className={style.icon}>
              <div className={style.inside}>
                <img src={sent} alt="sent-icon" className={style.send} />
              </div>
            </div>
          </Space>
        ) : (
          <Space direction="horizontal">
            <div className={style.icon}>
              <div className={style.inside}>
                <img src={send} alt="sent-icon" className={style.send} />
              </div>
            </div>
            <Typography.Text className={style.text}>Send offer letter to candidate</Typography.Text>
          </Space>
        )}
      </div>
      {isSentEmail ? (
        <div className={style.body1}>
          <Typography.Text>
            The HR is currently reviewing your documents for eligibility. It takes a standard{' '}
            <span className={style.coloredText}>1-2 days</span> for the process <br />.{' '}
            <span className={style.boldText}>
              Once done, the HR will get in touch for the next step of processes.{' '}
            </span>
          </Typography.Text>
          <div>
            <Button onClick={handleSubmitAgain}>Submit Again</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className={style.body}>
            <Radio.Group defaultValue={1} className={style.radioContainer}>
              <Radio value={1} className={style.radioItem}>
                Via Mail
                <p className={style.radioHelper}>
                  The form will be sent on candidate’s private email id.
                </p>
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
              onValuesChange={onValuesChangeEmail}
            >
              <Form.Item name="email" label="Candidate Email ID" className={style.marginBottom}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Send Email</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
