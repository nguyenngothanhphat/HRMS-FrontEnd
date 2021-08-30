/* eslint-disable compat/compat */
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import BasicInformationHeader from './components/BasicInformationHeader';
// import BasicInformationReminder from './components/BasicInformationReminder';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import MessageBox from '../MessageBox';
import styles from './index.less';
import { Page } from '../../utils';

@connect(({ newCandidateForm: { data, checkMandatory, currentStep, tempData } = {} }) => ({
  data,
  checkMandatory,
  currentStep,
  tempData,
}))
class BasicInformation extends PureComponent {
  formRef = React.createRef();

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

  componentDidMount() {
    const {
      dispatch,
      data: { candidate, processStatus, workEmail = '' },
    } = this.props;
    if (workEmail) {
      this.setState({
        isOpenReminder: true,
      });
    }
    window.scrollTo({ top: 77, behavior: 'smooth' });

    this.checkBottomBar();

    if (processStatus === 'DRAFT') {
      // const currentStepLocal = localStorage.getItem('currentStep') || currentStep;
      // console.log(candidate, currentStepLocal);
      if (candidate) {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            candidate,
            currentStep: 0,
            tenantId: getCurrentTenant(),
          },
        });
      }
    }
    // console.log('basicInfo currentStep', currentStep);
  }

  componentWillUnmount() {
    const { tempData: { cancelCandidate = false } = {} } = this.props;
    // const {
    //   data,
    //   tempData: { fullName, privateEmail, workEmail, previousExperience },
    // } = this.state;
    // const { dispatch, currentStep } = this.props;
    // console.log('current', currentStep);
    // const { _id } = data;
    // dispatch({
    //   type: 'newCandidateForm/updateByHR',
    //   payload: {
    //     fullName,
    //     privateEmail,
    //     workEmail,
    //     previousExperience,
    //     candidate: _id,
    //     currentStep,
    //   },
    // });
    // window.removeEventListener('unload', this.handleUnload, false);
    if (!cancelCandidate) {
      this.handleUpdateByHR();
    }
  }

  disableEdit = () => {
    const {
      data: { processStatus = '' },
    } = this.props;
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;
    if (processStatus === PROVISIONAL_OFFER_DRAFT || processStatus === FINAL_OFFERS_DRAFT) {
      return false;
    }
    return true;
  };

  // handleUnload = () => {
  //   const { currentStep } = this.props;
  //   localStorage.setItem('currentStep', currentStep);
  // };

  handleUpdateByHR = () => {
    const {
      data,
      currentStep,
      tempData: { firstName, middleName, lastName, privateEmail, workEmail, previousExperience },
    } = this.state;
    const { dispatch } = this.props;
    const { _id } = data;
    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        firstName,
        middleName,
        lastName,
        privateEmail,
        workEmail,
        previousExperience,
        candidate: _id,
        currentStep,
        tenantId: getCurrentTenant(),
      },
    });
  };

  handleChange = (e) => {
    const name = Object.keys(e).find((x) => x);
    const value = Object.values(e).find((x) => x);
    const { tempData } = this.props;
    tempData[name] = value;
    this.checkBottomBar();
  };

  checkBottomBar = () => {
    const {
      tempData: { firstName, middleName, lastName, privateEmail, workEmail, checkStatus },
      checkMandatory,
      dispatch,
    } = this.props;
    const notSpace = RegExp(/[^\s-]/);
    const emailRegExp = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    );
    if (
      firstName !== null &&
      // middleName !== null &&
      lastName !== null &&
      // workEmail !== null &&
      privateEmail !== null &&
      workEmail !== privateEmail &&
      notSpace.test(firstName) &&
      notSpace.test(middleName) &&
      notSpace.test(lastName) &&
      emailRegExp.test(privateEmail)
      // emailRegExp.test(workEmail)
    ) {
      checkStatus.filledBasicInformation = true;
    } else {
      checkStatus.filledBasicInformation = false;
    }
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
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
    if (this.disableEdit()) {
      const nextStep = currentStep + 1;
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          currentStep: nextStep,
        },
      });
    } else {
      dispatch({
        type: 'newCandidateForm/submitBasicInfo',
        payload: {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          privateEmail: values.privateEmail,
          workEmail: values.workEmail,
          previousExperience: values.previousExperience,
          candidate: _id,
          currentStep: currentStep + 1,
          tenantId: getCurrentTenant(),
        },
      }).then(({ data: data1, statusCode }) => {
        if (statusCode === 200) {
          dispatch({
            type: 'newCandidateForm/save',
            payload: {
              currentStep: data1.currentStep,
            },
          });
        }
      });
    }
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

  _renderEmployeeId = () => {
    const { isOpenReminder = {} } = this.state;
    const { data } = this.props;
    const { processStatus } = data;
    if (processStatus === 'ACCEPT-FINAL-OFFER') {
      return (
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            label={formatMessage({ id: 'component.basicInformation.employeeId' })}
            name="employeeId"
            // rules={[
            //   { required: true, message: `'Please input your full name!'` },
            //   {
            //     pattern: /[^\s-]/,
            //     message: 'Fullname is invalid!',
            //   },
            // ]}
          >
            <Input
              // onChange={(e) => this.handleChange(e)}
              className={styles.formInput}
              name="employeeId"
              disabled={this.disableEdit()}
            />
          </Form.Item>
        </Col>
      );
    }
    // return (
    //   <>{isOpenReminder ? <BasicInformationReminder onClickClose={this.onClickClose} /> : null}</>
    // );
    return null;
  };

  testValidate = () => {
    const email1 = this.formRef.current.getFieldValue('privateEmail');
    const email2 = this.formRef.current.getFieldValue('workEmail');
    if ((email2 && email1) || email2 === '') {
      this.formRef.current.validateFields();
    }
  };

  _renderForm = () => {
    return (
      <div className={styles.basicInformation__form}>
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.firstName' })}
              name="firstName"
              rules={[
                { required: true, message: `'Please input your first name!'` },
                {
                  pattern: /[^\s-]/,
                  message: 'First name is invalid!',
                },
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                placeholder="First name"
                className={styles.formInput}
                name="firstName"
                disabled={this.disableEdit()}
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
              rules={[
                {
                  pattern: /[^\s-]/,
                  message: 'Middle name is invalid!',
                },
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                placeholder="Middle name"
                className={styles.formInput}
                name="middleName"
                disabled={this.disableEdit()}
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
              rules={[
                { required: true, message: `'Please input your last name!'` },
                {
                  pattern: /[^\s-]/,
                  message: 'Last name is invalid!',
                },
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                placeholder="Last name"
                className={styles.formInput}
                name="lastName"
                disabled={this.disableEdit()}
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
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('workEmail') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Two emails cannot be the same!'));
                  },
                }),
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                placeholder="Personal email"
                className={styles.formInput}
                name="privateEmail"
                disabled={this.disableEdit()}
                onChange={this.testValidate}
                // defaultValue={privateEmail}
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.workEmail' })}
              className={styles.formInput__email}
              name="workEmail"
              rules={[
                {
                  // required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Email invalid!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('privateEmail') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Two emails cannot be the same!'));
                  },
                }),
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="workEmail"
                disabled={this.disableEdit()}
                onChange={this.testValidate}
                // suffix="@terralogic.com"
                // defaultValue={workEmail}
              />
            </Form.Item>
          </Col> */}
          {this._renderEmployeeId()}
          {/* </Row> */}
          {/* <Row gutter={[48, 0]}> */}
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.experienceYear' })}
              name="previousExperience"
              rules={[
                {
                  pattern: /\b([0-9]|[1-9][0-9])\b/,
                  message: 'Year of experience invalid!',
                },
                {
                  pattern: /^\d+$/,
                  message: 'Only digit !',
                },
              ]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                placeholder="Relevant previous experience"
                className={styles.formInput}
                name="previousExperience"
                disabled={this.disableEdit()}
                // defaultValue={experienceYear}
              />
            </Form.Item>
          </Col>
        </Row>
        <RenderAddQuestion page={Page.Basic_Information} />
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
                // onClick={this.onClickNext}
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
    const {
      firstName,
      middleName,
      lastName,
      privateEmail,
      workEmail,
      previousExperience,
      employeeId,
    } = data;
    const { loading1 } = this.props;
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
        {loading1 ? (
          <div className={styles.viewLoading}>
            <Spin />
          </div>
        ) : (
          <>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className={styles.basicInformation}>
                <Form
                  wrapperCol={{ span: 24 }}
                  name="basic"
                  initialValues={{
                    firstName,
                    middleName,
                    lastName,
                    privateEmail,
                    workEmail,
                    previousExperience,
                    employeeId,
                  }}
                  ref={this.formRef}
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
            <Col className={styles.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className={styles.rightWrapper}>
                <Row>
                  <NoteComponent note={Note} />
                </Row>
                <Row className={styles.stepRow}>
                  <StepsComponent />
                </Row>
                <Row>
                  <MessageBox />
                </Row>
              </div>
            </Col>
          </>
        )}
      </Row>
    );
  }
}

export default BasicInformation;
