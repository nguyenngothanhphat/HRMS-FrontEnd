import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import BasicInformationHeader from './components/BasicInformationHeader';
import BasicInformationReminder from './components/BasicInformationReminder';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

@connect(({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {} }) => ({
  data,
  checkMandatory,
  currentStep,
  tempData,
}))
class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenReminder: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('data' in props) {
      return {
        data: props.data,
        checkMandatory: props.checkMandatory,
        tempData: props.tempData || {},
      };
    }
    return null;
  }

  handleChange = (e) => {
    const name = Object.keys(e).find((x) => x);
    const value = Object.values(e).find((x) => x);
    const { dispatch } = this.props;
    const emailRegExp = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    );

    const { tempData, checkMandatory } = this.state;
    tempData[name] = value;
    const { fullName = '', workEmail = '', privateEmail = '', checkStatus = {} } = tempData;
    if (
      fullName !== '' &&
      workEmail !== '' &&
      privateEmail !== '' &&
      emailRegExp.test(privateEmail) &&
      emailRegExp.test(workEmail)
    ) {
      checkStatus.filledBasicInformation = true;
    } else {
      checkStatus.filledBasicInformation = false;
    }
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
        },

        checkMandatory: {
          ...checkMandatory,
          filledBasicInformation: checkStatus.filledBasicInformation,
        },
      },
    });
  };

  onFinish = (values) => {
    const { data } = this.state;
    const { dispatch, currentStep } = this.props;
    const { _id } = data;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
      },
    });
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        fullName: values.fullName,
        privateEmail: values.privateEmail,
        workEmail: values.workEmail,
        candidate: _id,
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
    const { isOpenReminder, data = {} } = this.state;
    const { fullName, privateEmail, workEmail, experienceYear } = data;
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
                // onChange={(e) => this.handleChange(e)}
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
                // onChange={(e) => this.handleChange(e)}
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
                // onChange={(e) => this.handleChange(e)}
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
                // onChange={(e) => this.handleChange(e)}
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
    const { data = {} } = this.state;
    const { fullName, privateEmail, workEmail, experienceYear } = data;
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
              onValuesChange={this.handleChange}
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
