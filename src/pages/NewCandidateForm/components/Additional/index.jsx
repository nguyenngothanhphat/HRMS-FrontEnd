import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography } from 'antd';
import { connect, formatMessage } from 'umi';

import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

@connect(({ info: { basicInformation, checkMandatory } = {} }) => ({
  basicInformation,
  checkMandatory,
}))
class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenReminder: false,
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
    const { dispatch, checkMandatory } = this.props;

    const emailRegExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

    const { basicInformation = {} } = this.state;
    basicInformation[name] = value;
    const {
      firstName = '',
      middleName = '',
      lastName = '',
      workEmail = '',
      privateEmail = '',
    } = basicInformation;

    if (
      firstName !== '' &&
      middleName !== '' &&
      lastName !== '' &&
      workEmail !== '' &&
      privateEmail !== '' &&
      emailRegExp.test(privateEmail)
    ) {
      checkMandatory.filledBasicInformation = true;
    } else {
      checkMandatory.filledBasicInformation = false;
    }

    dispatch({
      type: 'info/saveBasicInformation',
      payload: {
        basicInformation,
        checkMandatory: {
          ...checkMandatory,
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

  onClickClose = () => {
    this.setState({
      isOpenReminder: false,
    });
  };

  onFocus = () => {
    this.setState({
      isOpenReminder: true,
    });
  };

  _renderForm = () => {
    const { isOpenReminder, basicInformation = {} } = this.state;
    const { firstName, middleName, lastName, privateEmail, workEmail, experienceYear } =
      basicInformation;
    return (
      <Form
        className={styles.basicInformation__form}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{ firstName, middleName, lastName, privateEmail, workEmail, experienceYear }}
        onFocus={this.onFocus}
      >
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.firstName' })}
              name="firstName"
              rules={[{ required: true, message: `'Please input your first name!'` }]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="firstName"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.middleName' })}
              name="middleName"
              rules={[{ required: true, message: `'Please input your middle name!'` }]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="middleName"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.lastName' })}
              name="lastName"
              rules={[{ required: true, message: `'Please input your last name!'` }]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="lastName"
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
              label={formatMessage({ id: 'component.basicInformation.workEmail' })}
              className={styles.formInput__email}
              name="workEmail"
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="workEmail"
                // suffix="@terralogic.com"
                // defaultValue={workEmail}
              />
            </Form.Item>
          </Col>
          {isOpenReminder ? <BasicInformationReminder onClickClose={this.onClickClose} /> : null}
        </Row>
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.experienceYear' })}
              name="experienceYear"
              rules={[
                {
                  pattern: /^[0-9]*$/,
                  message: 'Year of experience invalid!',
                },
              ]}
            >
              <Input
                onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="experienceYear"
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
              {/* {this._renderForm()} */}
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
