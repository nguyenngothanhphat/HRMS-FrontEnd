import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

@connect(({ info: { basicInformation, checkMandatory, currentStep = 0 } = {} }) => ({
  basicInformation,
  checkMandatory,
  currentStep,
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
    const { fullName = '', workEmail = '', privateEmail = '' } = basicInformation;

    if (
      fullName !== '' &&
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
        checkMandatory: {
          ...checkMandatory,
        },
      },
    });
  };

  onFinish = (values) => {
    const { dispatch, currentStep } = this.props;
    console.log('Success:', values);

    dispatch({
      type: 'info/save',
      payload: {
        currentStep: currentStep + 1,
      },
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
    const { isOpenReminder } = this.state;
    return (
      <div className={styles.basicInformation__form}>
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
      </div>
    );
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;
    return !filledBasicInformation ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    const { checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { basicInformation = {} } = this.state;
    const { fullName, privateEmail, workEmail, experienceYear } = basicInformation;
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
            <Form
              wrapperCol={{ span: 24 }}
              name="basic"
              initialValues={{ fullName, privateEmail, workEmail, experienceYear }}
              onFocus={this.onFocus}
              onFinish={this.onFinish}
            >
              <div className={styles.basicInformation__top}>
                <BasicInformationHeader />
                <hr />
                {this._renderForm()}
              </div>
              {this._renderBottomBar()}
            </Form>
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
