import React, { useState } from 'react';
import { Typography, Space, Radio, Input, Form, Button, Row, Col } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import send from './Assets/group-11.svg';
import style from './index.less';
import copy from './Assets/copy-office.svg';

const index = ({ formatMessage = () => {} }) => {
  const [isEnable, setIsEnable] = useState(null);
  const [isInputEnable, setIsInputEnable] = useState(true);

  const handleEmailClick = () => {
    setIsEnable(true);
  };

  const handleLinkClick = () => {
    setIsEnable(false);
  };

  const handleClick = () => {
    setIsInputEnable(false);
  };

  return (
    <div className={style.SendEmail}>
      <div className={style.header}>
        <Space direction="horizontal">
          <div className={style.icon}>
            <div className={style.inside}>
              <img src={send} alt="send-icon" className={style.send} />
            </div>
          </div>
          <Typography.Text className={style.text}>
            {formatMessage({ id: 'component.eligibilityDocs.sentForm' })}
          </Typography.Text>
        </Space>
      </div>
      <div className={style.body}>
        <Radio.Group className={style.radioContainer}>
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
        <Form layout="vertical" className={style.emailForm}>
          <Form.Item label={formatMessage({ id: 'component.eligibilityDocs.emailLabel' })}>
            <Input defaultValue="Landonorris@gmail.com" disabled={isInputEnable} />
          </Form.Item>
          <Typography.Text className={style.change} onClick={handleClick}>
            {formatMessage({ id: 'component.eligibilityDocs.change' })}
          </Typography.Text>
          <Button>{formatMessage({ id: 'component.eligibilityDocs.sendEmail' })}</Button>
        </Form>
      </div>
      <div className={isEnable === false ? `${style.link} ${style.open}` : style.link}>
        <Form className={style.linkForm}>
          <Form.Item>
            <Input defaultValue="abc.xyz.com" />
            <img src={copy} alt="copy item" className={style.copy} />
          </Form.Item>
        </Form>
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
          <Button>{formatMessage({ id: 'component.eligibilityDocs.markAsDone' })}</Button>
        </div>
      </div>
    </div>
  );
};

export default index;
