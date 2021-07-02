import React, { useState } from 'react';
import { Typography, Space, Radio, Input, Form, Button, Row, Col, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import send from './Assets/group-11.svg';
import sent from './Assets/sent.svg';
import style from './index.less';
import copy from './Assets/copy-office.svg';

const index = ({
  title,
  formatMessage = () => {},
  handleSendEmail = () => {},
  privateEmail = '',
  isSentEmail,
  generateLink = '',
  handleMarkAsDone = () => {},
  handleSendFormAgain = () => {},
  fullName = '',
  handleValueChange = () => {},
}) => {
  const [isEnable, setIsEnable] = useState(true);
  const [isInputEnable, setIsInputEnable] = useState(true);
  const [initialGenerateLink] = useState('abc.xyz.com');

  const handleEmailClick = () => {
    setIsEnable(true);
  };

  const handleLinkClick = () => {
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  const handleGenerate = () => {
    message.success('Generated link sucessfully');
  };
  return (
    <div className={style.SendEmail}>
      <div className={style.header}>
        <Space direction="horizontal">
          <div className={style.icon}>
            <div className={style.inside}>
              {isSentEmail ? (
                <img src={sent} alt="send-icon" className={style.send} />
              ) : (
                <img src={send} alt="sent-icon" className={style.send} />
              )}
            </div>
          </div>
          {isSentEmail ? (
            <Typography.Text className={style.text}>Sent</Typography.Text>
          ) : (
            <Typography.Text className={style.text}>
              {/* {formatMessage({ id: 'component.eligibilityDocs.sentForm' })} */}
              {title}
            </Typography.Text>
          )}
        </Space>
      </div>
      {isSentEmail ? (
        <div className={style.anotherBody}>
          <Typography.Text className={style.text}>
            We are waiting for <span className={style.specificText}>Mr / Mrs. {fullName}</span> to
            upload all requested documents for eligibility check.
          </Typography.Text>
          <br />
          <Button type="link" onClick={handleSendFormAgain} className={style.buttonSend}>
            <Typography.Text className={style.buttonText}>Send form again</Typography.Text>
          </Button>
        </div>
      ) : (
        <>
          <div className={style.body}>
            <Radio.Group defaultValue={1} className={style.radioContainer}>
              <Radio value={1} className={style.radioItem} onChange={handleEmailClick}>
                {formatMessage({ id: 'component.eligibilityDocs.viaEmail' })}
                <p className={style.radioHelper}>
                  {formatMessage({ id: 'component.eligibilityDocs.emailSubtitle' })}
                </p>
              </Radio>
              <br />
              <Radio value={2} className={style.radioItem} onChange={handleLinkClick}>
                {formatMessage({ id: 'component.eligibilityDocs.generateLink' })}
                <p className={style.radioHelper}>
                  {formatMessage({ id: 'component.eligibilityDocs.linkSubtitle' })}
                </p>
              </Radio>
            </Radio.Group>
          </div>
          <div className={isEnable ? `${style.email} ${style.open}` : style.email}>
            <div className={style.line} />
            <Form
              onFinish={handleSendEmail}
              layout="vertical"
              className={style.emailForm}
              initialValues={{ email: privateEmail }}
              onValuesChange={handleValueChange}
            >
              <Form.Item
                name="email"
                label={formatMessage({ id: 'component.eligibilityDocs.emailLabel' })}
              >
                <Input disabled={isInputEnable} />
              </Form.Item>
              <Typography.Text className={style.change} onClick={handleClick}>
                {formatMessage({ id: 'component.eligibilityDocs.change' })}
              </Typography.Text>
              <Form.Item>
                <Button htmlType="submit">
                  {formatMessage({ id: 'component.eligibilityDocs.sendEmail' })}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={isEnable === false ? `${style.link} ${style.open}` : style.link}>
            <Form
              className={style.linkForm}
              initialValues={{ generateLink: generateLink || initialGenerateLink }}
              onFinish={(values) => handleMarkAsDone(values)}
            >
              <div className={style.wrapperInput}>
                <Form.Item name="generateLink">
                  <Input />
                </Form.Item>
                <Form.Item className={style.generateButton}>
                  <Button onClick={handleGenerate} className={style.generateButtonItem}>
                    <img src={copy} alt="copy item" className={style.copy} />
                  </Button>
                </Form.Item>
              </div>
              <div className={style.textBottom}>
                <Typography.Text className={style.title}>
                  {formatMessage({ id: 'component.eligibilityDocs.restrictedAccess' })}
                </Typography.Text>
                <Typography.Paragraph className={style.helper}>
                  {formatMessage({ id: 'component.eligibilityDocs.restrictedHelper' })}
                </Typography.Paragraph>
                <Row gutter={[4, 0]}>
                  <Col span={2}>
                    <CheckOutlined />
                  </Col>
                  <Col span={18}>
                    <Typography.Text>HR@terralogic.com</Typography.Text>
                  </Col>
                  <Col span={4}>
                    <Typography.Text>
                      {formatMessage({ id: 'component.eligibilityDocs.owner' })}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={2}>
                    <CheckOutlined />
                  </Col>
                  <Col span={22}>
                    <Typography.Text>HRmanager@terralogic.com</Typography.Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={2}>
                    <CheckOutlined />
                  </Col>
                  <Col span={22}>
                    <Typography.Text>Landonorris@gmail.com</Typography.Text>
                  </Col>
                </Row>
                <Form.Item>
                  <Button htmlType="submit">
                    {formatMessage({ id: 'component.eligibilityDocs.markAsDone' })}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default index;
