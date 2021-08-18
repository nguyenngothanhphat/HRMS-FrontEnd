import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { TYPE_QUESTION, SPECIFY } from '@/components/Question/utils';
import { every } from 'lodash';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import BasicInformationHeader from './components/BasicInformationHeader';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import styles from './index.less';
import { Page } from '../../../../../FormTeamMember/utils';

@connect(
  ({
    optionalQuestion: {
      messageErrors,
      data: { _id, settings },
    },
    candidatePortal: { data, checkMandatory, localStep, tempData } = {},
    loading,
  }) => ({
    data,
    _id,
    settings,
    messageErrors,
    checkMandatory,
    localStep,
    tempData,
    loading: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)
class BasicInformation extends PureComponent {
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
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }

  checkAllFieldsValidate = () => {
    const { settings, dispatch } = this.props;
    const valid = settings?.map((question) => {
      const employeeAnswers = question.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = question?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (question.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = question?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };

  handleChange = (e) => {
    const name = Object.keys(e).find((x) => x);
    const value = Object.values(e).find((x) => x);
    const { dispatch } = this.props;

    const { tempData, checkMandatory, data } = this.state;
    tempData[name] = value;
    const { checkStatus = {} } = tempData;
    const {
      firstName = '',
      middleName = '',
      lastName = '',
      privateEmail = '',
      previousExperience = '',
    } = data;
    if (
      firstName !== '' &&
      middleName !== '' &&
      lastName !== '' &&
      privateEmail !== '' &&
      previousExperience !== ''
    ) {
      checkStatus.filledBasicInformation = true;
    } else {
      checkStatus.filledBasicInformation = false;
    }
    dispatch({
      type: 'candidatePortal/save',
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
    const { dispatch, localStep, _id: id, settings } = this.props;
    const { _id } = data;
    const messageErr = this.checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (id !== '' && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id,
          settings,
        },
      });
    }
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep + 1,
      },
    });
    dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        candidate: _id,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
      },
    });
  };

  _renderForm = () => {
    return (
      <div className={styles.basicInformation__form}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="First Name*"
              name="firstName"
              rules={[{ required: true, message: `'Please input your first name!'` }]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="firstName"
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Middle Name"
              name="middleName"
              // rules={[{ required: true, message: `'Please input your middle name!'` }]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                disabled
                name="middleName"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label="Last Name*"
              name="lastName"
              rules={[{ required: true, message: `'Please input your last name!'` }]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                disabled
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
              <Input className={styles.formInput} name="privateEmail" disabled />
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
            >
              <Input className={styles.formInput} name="workEmail" disabled="true" />
            </Form.Item>
          </Col> */}
          {/* </Row>
        <Row gutter={[48, 0]}> */}
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.experienceYear' })}
              name="previousExperience"
              rules={[
                {
                  pattern: /^[0-9]*$/,
                  message: 'Year of experience invalid!',
                },
              ]}
            >
              <Input disabled className={styles.formInput} name="previousExperience" />
            </Form.Item>
          </Col>
          <Col span={24} className={styles.verifyCheckbox}>
            <Checkbox>I have verified the other details are correct</Checkbox>
          </Col>
          <AnswerQuestion page={Page.Basic_Information} />
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
    const { workEmail, firstName, middleName, lastName, privateEmail, previousExperience } = data;
    const { loading } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    if (loading) {
      return (
        <div className={styles.viewLoading}>
          <Spin />
        </div>
      );
    }
    return (
      <Row gutter={[24, 0]}>
        <Col lg={24} xl={16}>
          <div className={styles.basicInformation}>
            <Form
              wrapperCol={{ span: 24 }}
              name="basic"
              initialValues={
                firstName !== '' && {
                  workEmail,
                  firstName,
                  middleName,
                  lastName,
                  privateEmail,
                  previousExperience,
                }
              }
              onFocus={this.onFocus}
              onValuesChange={this.handleChange}
              onFinish={this.onFinish}
              loading={loading}
            >
              <div className={styles.basicInformation__top}>
                <BasicInformationHeader />
                {this._renderForm()}
              </div>
              {this._renderBottomBar()}
            </Form>
          </div>
        </Col>
        <Col className={styles.RightComponents} lg={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default BasicInformation;
