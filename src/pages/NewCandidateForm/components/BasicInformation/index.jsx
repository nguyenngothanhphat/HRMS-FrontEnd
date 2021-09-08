/* eslint-disable compat/compat */
/* eslint-disable no-param-reassign */
import { Button, Col, Form, Input, Row, Skeleton, Typography } from 'antd';
import { debounce } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { Page } from '../../utils';
import MessageBox from '../MessageBox';
// import BasicInformationReminder from './components/BasicInformationReminder';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import BasicInformationHeader from './components/BasicInformationHeader';
import styles from './index.less';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';

@connect(({ newCandidateForm: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
  data,
  checkMandatory,
  currentStep,
  tempData,
  loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
}))
class BasicInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {};
    // this.handleChange = debounce(this.handleChange, 250);
  }

  componentDidMount() {
    window.scrollTo({ top: 77, behavior: 'smooth' });
    const { data: { _id = '' } = {} } = this.props;
    if (_id) {
      this.checkFilled();
    }
  }

  componentDidUpdate = (prevProps) => {
    const { data = {}, tempData = {} } = this.props;

    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(data) ||
      JSON.stringify(prevProps.tempData) !== JSON.stringify(tempData)
    ) {
      this.checkFilled();
    }
  };

  handleChange = (e) => {
    const name = Object.keys(e).find((x) => x);
    const value = Object.values(e).find((x) => x);
    const { tempData } = this.props;
    tempData[name] = value;
    this.checkFilled();
  };

  checkFilled = () => {
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
    const { tempData } = this.props;
    const { dispatch } = this.props;
    const { _id, ticketID = '', currentStep = '', processStatus = '' } = tempData;

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        privateEmail: values.privateEmail,
        workEmail: values.workEmail,
        previousExperience: values.previousExperience,
        candidate: _id,
        currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 1 : currentStep,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: processStatus === NEW_PROCESS_STATUS.DRAFT ? 1 : currentStep,
          },
        });
        history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
      }
    });
  };

  _renderEmployeeId = () => {
    const { tempData } = this.props;
    const { processStatus } = tempData;
    if (processStatus === NEW_PROCESS_STATUS.OFFER_ACCEPTED) {
      return (
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            label={formatMessage({ id: 'component.basicInformation.employeeId' })}
            name="employeeId"
          >
            <Input autoComplete="off" className={styles.formInput} name="employeeId" />
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
    const { tempData } = this.props;
    const { processStatus = '' } = tempData;
    const disabled = ![
      NEW_PROCESS_STATUS.DRAFT,
      NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
      NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
    ].includes(processStatus);
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
                disabled={disabled}
                autoComplete="off"
                // onChange={(e) => this.handleChange(e)}
                placeholder="First Name"
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
              rules={[
                {
                  pattern: /[^\s-]/,
                  message: 'Middle name is invalid!',
                },
              ]}
            >
              <Input
                disabled={disabled}
                autoComplete="off"
                // onChange={(e) => this.handleChange(e)}
                placeholder="Middle Name"
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
              rules={[
                { required: true, message: `'Please input your last name!'` },
                {
                  pattern: /[^\s-]/,
                  message: 'Last name is invalid!',
                },
              ]}
            >
              <Input
                disabled={disabled}
                autoComplete="off"
                // onChange={(e) => this.handleChange(e)}
                placeholder="Last Name"
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
                disabled={disabled}
                autoComplete="off"
                // onChange={(e) => this.handleChange(e)}
                placeholder="Personal Email"
                className={styles.formInput}
                name="privateEmail"
                onChange={this.testValidate}
                // defaultValue={privateEmail}
              />
            </Form.Item>
          </Col>

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
                disabled={disabled}
                autoComplete="off"
                placeholder="Relevant previous experience"
                className={styles.formInput}
                name="previousExperience"
              />
            </Form.Item>
          </Col>
        </Row>
        <RenderAddQuestion page={Page.Basic_Information} />
      </div>
    );
  };

  _renderBottomBar = () => {
    const {
      checkMandatory,
      loadingUpdateByHR = false,
      tempData: { processStatus = '' } = {},
    } = this.props;
    const { filledBasicInformation } = checkMandatory;
    const renderText = ![
      NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
      NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
    ].includes(processStatus)
      ? 'Next'
      : 'Update';

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
                loading={loadingUpdateByHR}
              >
                {renderText}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { tempData = {} } = this.props;
    const {
      firstName,
      middleName,
      lastName,
      privateEmail,
      workEmail,
      previousExperience,
      employeeId,
    } = tempData;

    const { loadingFetchCandidate = false } = this.props;

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
        {loadingFetchCandidate ? (
          <div className={styles.viewLoading}>
            <Skeleton />
          </div>
        ) : (
          <>
            <Col xs={24} xl={16}>
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
            <Col className={styles.RightComponents} xs={24} xl={8}>
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
