import React, { useState } from 'react';
import { Typography, Space, Radio, Input, Form, Button, Row, Col, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import send from './Assets/group-11.svg';
import sent from './Assets/sent.svg';
import style from './index.less';
import copy from './Assets/copy-office.svg';

const index = ({
  handleSendEmail = () => {},
  privateEmail = '',
  isSentEmail,
  generateLink = '',
  handleMarkAsDone = () => {},
  handleSendFormAgain = () => {},
  firstName = '',
  middleName = '',
  lastName = '',
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
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  const handleGenerate = () => {
    message.success('Generated link sucessfully');
  };

  const renderBody = () => {
    return (
      <div className={style.body}>
        <Form no-style>
          <Radio.Group defaultValue={1} className={style.radioContainer}>
            {/* Email */}
            <Radio value={1} className={style.radioItem} onChange={handleEmailClick}>
              Via Mail
              <p className={style.radioHelper}>
                The form will be sent on candidate’s private email id.
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
                <Form.Item name="email" label="Personal e-mail id of the joinee">
                  <Input disabled={isInputEnable} />
                </Form.Item>
                <Typography.Text className={style.change} onClick={handleClick}>
                  Change
                </Typography.Text>
                <Form.Item className={style.margin}>
                  <Button
                    loading={loading4}
                    htmlType="submit"
                    disabled={checkValidation === false || checkValidation === undefined}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...((checkValidation === false || checkValidation === undefined) && {
                      className: style.s,
                    })}
                  >
                    Send mail
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={style.line} />
            {/* Link */}
            <Radio value={2} className={style.radioItem} onChange={handleLinkClick}>
              Generate link
              <p className={style.radioHelper}>
                The link to the form will be generated which can be shared.
              </p>
            </Radio>
            <div className={isEnable === false ? `${style.link} ${style.open}` : style.link}>
              <Form
                no-style
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
                  <Typography.Text className={style.title}>Restricted access</Typography.Text>
                  <Typography.Paragraph className={style.helper}>
                    Only authorised people can access this link
                  </Typography.Paragraph>
                  <Row gutter={[4, 0]}>
                    <Col span={2}>
                      <CheckOutlined />
                    </Col>
                    <Col span={18}>
                      <Typography.Text>HR@terralogic.com</Typography.Text>
                    </Col>
                    <Col span={4}>
                      <Typography.Text>Owner</Typography.Text>
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
                  {privateEmail !== '' && (
                    <Row>
                      <Col span={2}>
                        <CheckOutlined />
                      </Col>
                      <Col span={22}>
                        {/* <Typography.Text>Landonorris@gmail.com</Typography.Text> */}
                        <Typography.Text>{privateEmail}</Typography.Text>
                      </Col>
                    </Row>
                  )}

                  <Form.Item className={style.s1}>
                    <Button htmlType="submit">Mark as done</Button>
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
            <Typography.Text className={style.text}>Send Form</Typography.Text>
          )}
        </Space>
      </div>
      {isSentEmail ? (
        <div className={style.anotherBody}>
          <Typography.Text className={style.text}>
            We are waiting for{' '}
            <span className={style.specificText}>
              Mr / Mrs. {firstName + lastName + middleName}
            </span>{' '}
            to upload all requested documents for eligibility check.
          </Typography.Text>
          <br />
          <Button type="link" onClick={handleSendFormAgain} className={style.buttonSend}>
            <Typography.Text className={style.buttonText}>Send form again</Typography.Text>
          </Button>
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
              <Typography.Text>Process to release a final offer</Typography.Text>
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

export default index;
