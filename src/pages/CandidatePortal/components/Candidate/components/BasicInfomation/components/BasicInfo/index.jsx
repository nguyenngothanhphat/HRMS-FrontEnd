import { Checkbox, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { connect, formatMessage } from 'umi';
import { Page } from '@/pages/NewCandidateForm/utils';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import styles from './index.less';

const BasicInfo = (props) => {
  const { isVerifiedBasicInfo = false, onVerifyThisForm = () => {} } = props;
  return (
    <div className={styles.BasicInfo}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.firstName' })}
            name="firstName"
          >
            <Input
              disabled
              autoComplete="off"
              // onChange={(e) => handleChange(e)}
              placeholder="First Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.middleName' })}
            name="middleName"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Middle Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.lastName' })}
            name="lastName"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Last Name"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Total Experience in years"
            name="totalExperience"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Total Experience in years"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Relevant Experience in years"
            name="previousExperience"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Relevant Experience in years"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label={formatMessage({ id: 'component.basicInformation.privateEmail' })}
            name="privateEmail"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Personal Email"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Phone Number"
            name="phoneNumber"
          >
            <Input
              disabled
              autoComplete="off"
              placeholder="Phone Number"
              className={styles.formInput}
            />
          </Form.Item>
        </Col>
        <AnswerQuestion page={Page.Basic_Information} />
        <Col span={24} className={styles.verifyCheckbox}>
          <Checkbox checked={isVerifiedBasicInfo} onChange={onVerifyThisForm}>
            I have verified that the above details are correct
          </Checkbox>
        </Col>
      </Row>
    </div>
  );
};

export default connect(() => ({}))(BasicInfo);
