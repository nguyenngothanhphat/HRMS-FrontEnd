/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Typography, Space, Radio, Input, Form, Button, Row, Col, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import send from './Assets/group-11.svg';
import sent from './Assets/sent.svg';
import style from './index.less';
import copy from './Assets/copy-office.svg';

const SendEmail = ({
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
  valueToFinalOffer,
  changeValueToFinalOffer = () => {},
  checkValidation,
  loading4,
}) => {
  const [isEnable, setIsEnable] = useState(true);
  const [isInputEnable, setIsInputEnable] = useState(true);
  const [initialGenerateLink] = useState('abc.xyz.com');
  const handleEmailClick = () => {
    setIsEnable(true);
  };

  const handleLinkClick = () => {
    message.success('Link generated');
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  const handleGenerate = () => {
    message.success('Copied');
    navigator.clipboard.writeText(initialGenerateLink || '');
  };

  const renderBody = () => {
    return (
      <div className={style.body}>
        <Form no-style>
          <Radio.Group defaultValue={1} className={style.radioContainer}>
            {/* Email */}
            <Radio value={1} className={style.radioItem} onChange={handleEmailClick}>
              {formatMessage({ id: 'component.eligibilityDocs.viaEmail' })}
              <p className={style.radioHelper}>
                {formatMessage({ id: 'component.eligibilityDocs.emailSubtitle' })}
              </p>
            </Radio>
            <div className={isEnable ? `${style.email} ${style.open}` : style.email}>
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
                <Form.Item className={style.margin}>
                  <Button
                    loading={loading4}
                    htmlType="submit"
                    disabled={checkValidation === false || checkValidation === undefined}
                    {...((checkValidation === false || checkValidation === undefined) && {
                      className: style.s,
                    })}
                  >
                    {formatMessage({ id: 'component.eligibilityDocs.sendEmail' })}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={style.line} />
            {/* Link */}
            <Radio value={2} className={style.radioItem} onChange={handleLinkClick}>
              {formatMessage({ id: 'component.eligibilityDocs.generateLink' })}
              <p className={style.radioHelper}>
                {formatMessage({ id: 'component.eligibilityDocs.linkSubtitle' })}
              </p>
            </Radio>
            <div className={isEnable === false ? `${style.link} ${style.open}` : style.link}>
              <Form
                no-style
                className={style.linkForm}
                initialValues={{ generateLink: generateLink || initialGenerateLink }}
                onFinish={(values) => handleMarkAsDone(values)}
                // onChange={(e) => console.log(e)}
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
                      {/* <Typography.Text>Landonorris@gmail.com</Typography.Text> */}
                      <Typography.Text>{privateEmail}</Typography.Text>
                    </Col>
                  </Row>
                  <Form.Item className={style.s1}>
                    <Button htmlType="submit">
                      {formatMessage({ id: 'component.eligibilityDocs.markAsDone' })}
                    </Button>
                  </Form.Item>
                  {/* Process to release a final offer */}
                </div>
              </Form>
            </div>
          </Radio.Group>
        </Form>
        <div className={style.line} />
      </div>
    );
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
          {/* <Radio.Group
            className={style.s}
            onChange={changeValueToFinalOffer}
            value={valueToFinalOffer}
          >
            <Radio value={1}>
              <Typography.Text>Process to release a final offer</Typography.Text>
            </Radio>
          </Radio.Group> */}
        </div>
      ) : (
        <>
          <Radio.Group
            className={style.s}
            onChange={changeValueToFinalOffer}
            value={valueToFinalOffer}
          >
            <br />

            <Radio value={0}>
              <Typography.Text>Send Provisional Offer</Typography.Text>
            </Radio>

            {valueToFinalOffer === 0 ? (
              renderBody()
            ) : (
              <>
                <br />
                <br />
                <div className={style.line} />
              </>
            )}
            {/* {valueToFinalOffer === 1 && <br />} */}
            <Radio value={1}>
              <Typography.Text>Processs to release a final offer</Typography.Text>
            </Radio>
          </Radio.Group>
          {/* 
          <Radio.Group
            className={style.s}
            onChange={changeValueToFinalOffer}
            value={valueToFinalOffer}
          >
            
          </Radio.Group> */}
        </>
      )}
    </div>
  );
};

export default SendEmail;
