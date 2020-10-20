import React, { Component } from 'react';
import { Row, Col, Form, Input, Typography } from 'antd';
import { connect, formatMessage } from 'umi';

import BasicInformationHeader from './components/BasicInformationHeader';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

@connect(({ candidateProfile: { basicInformation, checkCandidateMandatory, data } = {} }) => ({
  basicInformation,
  checkCandidateMandatory,
  data,
}))
class BasicInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInformation: {},
    };
  }

  static getDerivedStateFromProps(props) {
    if ('basicInformation' in props) {
      return { basicInformation: props.basicInformation || {} };
    }
    return null;
  }

  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch, checkCandidateMandatory } = this.props;

    const emailRegExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

    const { basicInformation = {} } = this.state;
    basicInformation[name] = value;
    const { fullName = '', workLocation = '', privateEmail = '' } = basicInformation;

    const filledCandidateBasicInformation =
      fullName !== '' &&
      workLocation !== '' &&
      privateEmail !== '' &&
      emailRegExp.test(privateEmail);

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        basicInformation,
        checkCandidateMandatory: {
          ...checkCandidateMandatory,
          filledCandidateBasicInformation,
        },
      },
    });
  };

  onChangeFormData = (key, value) => {
    const { myInfo } = this.state;
    myInfo[key] = value;
    this.setState({
      myInfo,
    });
  };

  _renderForm = () => {
    const { basicInformation = {} } = this.state;
    const { fullName, privateEmail, workLocation, experienceYear } = basicInformation;
    return (
      <Form
        className={styles.basicInformation__form}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{ fullName, privateEmail, workLocation, experienceYear }}
        onFocus={this.onFocus}
      >
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.fullName' })}
              name="fullName"
              rules={[{ required: true, message: `'Please input your full name!'` }]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="fullName"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.privateEmail' })}
              name="privateEmail"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Email invalid!',
                },
              ]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="privateEmail"
                // defaultValue={privateEmail}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Previous experience in years*"
              className={styles.formInput__email}
              name="experienceYear"
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="experienceYear"
                // suffix="@terralogic.com"
                // defaultValue={workEmail}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Work Location*"
              name="workLocation"
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="workLocation"
                // defaultValue={experienceYear}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.basicInformation}>
            <div className={styles.basicInformation__top}>
              <BasicInformationHeader />
              <hr />
              {this._renderForm()}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row style={{ width: '322px' }}>
              <StepsComponent />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default BasicInformation;
