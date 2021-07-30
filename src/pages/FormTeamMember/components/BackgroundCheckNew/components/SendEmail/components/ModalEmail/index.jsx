import React, { Component } from 'react';
import { Typography, Radio, Input, Form, Button, Row, Col, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import copy from '../../Assets/copy-office.svg';
import send from '../../Assets/group-11.svg';
import sent from '../../Assets/sent.svg';
import style from './index.less';
// eslint-disable-next-line react/prefer-stateless-function
class ModalEmail extends Component {
  render() {
    const {
      handleEmailClick = () => {},
      isEnable,
      handleSendEmail = () => {},
      privateEmail,
      handleValueChange = () => {},
      isInputEnable,
      handleClick = () => {},
      loading4,
      checkValidation,
      handleLinkClick = () => {},
      generateLink,
      handleGenerate = () => {},
      handleMarkAsDone = () => {},
      isSentEmail,
    } = this.props;

    return (
      <>
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
        <div className={style.body}>
          <Form no-style>
            <Radio.Group
              disabled={checkValidation === false || checkValidation === undefined}
              className={style.radioContainer}
            >
              {/* Email */}
              <Radio value={1} className={style.radioItem} onChange={handleEmailClick}>
                Via Mail
                <p className={style.radioHelper}>
                  The form will be sent on candidate’s private email id.
                </p>
              </Radio>

              {/* Link */}
              <Radio value={2} className={style.radioItem} onChange={handleLinkClick}>
                Generate link
                <p className={style.radioHelper}>
                  The link to the form will be generated which can be shared.
                </p>
              </Radio>

              <div className={isEnable ? `${style.email} ${style.open}` : style.email}>
                <div className={style.line} />
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
                  {/* <Typography.Text className={style.change} onClick={handleClick}>
                    Change
                  </Typography.Text> */}
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

              <div className={isEnable === false ? `${style.link} ${style.open}` : style.offlink}>
                <Form
                  no-style
                  className={style.linkForm}
                  // initialValues={{ generateLink }}
                  onFinish={(values) => handleMarkAsDone(values)}
                >
                  {generateLink && (
                    <div className={style.wrapperInput}>
                      <Form.Item name="generateLink">
                        <Input defaultValue={generateLink} />
                      </Form.Item>
                      <Form.Item className={style.generateButton}>
                        <Button onClick={handleGenerate} className={style.generateButtonItem}>
                          <img src={copy} alt="copy item" className={style.copy} />
                        </Button>
                      </Form.Item>
                    </div>
                  )}
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
                      <Button
                        disabled={checkValidation === false || checkValidation === undefined}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...((checkValidation === false || checkValidation === undefined) && {
                          className: style.s,
                        })}
                        loading={loading4}
                        htmlType="submit"
                      >
                        {generateLink ? 'Mark as done' : 'Generate link'}
                      </Button>
                    </Form.Item>
                    {/* Process to release a final offer */}
                  </div>
                </Form>
              </div>
            </Radio.Group>
          </Form>
        </div>
      </>
    );
  }
}

export default ModalEmail;
