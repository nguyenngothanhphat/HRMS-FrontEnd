import { Button, Card, Col, Form, Row, Skeleton, Typography } from 'antd';
import { every } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { SPECIFY, TYPE_QUESTION } from '@/components/Question/utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import Address from './components/Address';
import BasicInfo from './components/BasicInfo';
import styles from './index.less';

const BasicInformation = (props) => {
  const [form] = Form.useForm();

  const {
    candidatePortal: { data = {}, checkMandatory, localStep } = {},
    settings,
    dispatch,
    loading = false,
    _id: id,
    loadingUpdateCandidate = false,
  } = props;
  const {
    isVerifiedBasicInfo = false,
    phoneNumber,
    workEmail,
    firstName,
    middleName,
    lastName,
    privateEmail,
    previousExperience,
    _id: candidateId = '',
  } = data;

  const { filledBasicInformation } = checkMandatory;
  const [isSameAddress, setIsSameAddress] = React.useState(false);

  const checkAllFieldsValidate = () => {
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

  const onFieldValidation = (values) => {
    let check = false;
    if (
      values.firstName &&
      values.lastName &&
      values.privateEmail &&
      values.phoneNumber &&
      values.currentAddressLine1 &&
      values.currentCountry &&
      values.currentState &&
      values.currentCity &&
      values.currentZipCode &&
      values.permanentAddressLine1 &&
      values.permanentCountry &&
      values.permanentState &&
      values.permanentCity &&
      values.permanentZipCode
    ) {
      check = true;
    } else {
      check = false;
    }

    dispatch({
      type: 'candidatePortal/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledBasicInformation: check,
        },
      },
    });
  };

  const onChangeAddress = (values) => {
    form.setFieldsValue({
      permanentAddressLine1: values.currentAddressLine1,
      permanentAddressLine2: values.currentAddressLine2,
      permanentCountry: values.currentCountry,
      permanentState: values.currentState,
      permanentCity: values.currentCity,
      permanentZipCode: values.currentZipCode,
    });
  };

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    if (isSameAddress) {
      onChangeAddress(values);
    }
  };

  const onFinish = async (values) => {
    const messageErr = checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (id && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id,
          settings,
        },
      });
    }

    await dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        candidate: candidateId,
        tenantId: getCurrentTenant(),
        isVerifiedBasicInfo,
      },
    });
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep + 1,
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

  // checkbox verify this form
  const onVerifyThisForm = (e) => {
    const {
      target: { checked = false },
    } = e;

    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        isVerifiedBasicInfo: checked,
      },
    });
  };

  const onSameAddress = (e) => {
    const values = form.getFieldsValue();
    if (e.target.checked) {
      setIsSameAddress(true);
      onChangeAddress(values);
    } else {
      setIsSameAddress(false);
    }
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    onFieldValidation(values);
  }, [isSameAddress, JSON.stringify(form)]);

  const _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={8} />
          <Col span={16}>
            <div className={styles.bottomBar__button}>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation || !isVerifiedBasicInfo
                    ? styles.bottomBar__button__disabled
                    : ''
                }`}
                disabled={!filledBasicInformation || !isVerifiedBasicInfo}
                loading={loadingUpdateCandidate}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderCardTitle = (title, description) => {
    return (
      <div className={styles.cardTitle}>
        <p className={styles.title} style={{ marginBottom: description ? 10 : 0 }}>
          {title}
        </p>
        <p className={styles.description}>{description}</p>
      </div>
    );
  };

  const Note = {
    title: 'Note',
    data: (
      <Typography.Text>
        Please verify the profile details that have been added. In case of incorrect details, please
        send a note in the text box below.
      </Typography.Text>
    ),
  };
  if (loading) {
    return (
      <div className={styles.viewLoading}>
        <Skeleton />
      </div>
    );
  }

  const cards = [
    {
      component: (
        <BasicInfo onVerifyThisForm={onVerifyThisForm} isVerifiedBasicInfo={isVerifiedBasicInfo} />
      ),

      title: 'Basic Information',
    },
    {
      component: (
        <Address onSameAddress={onSameAddress} isSameAddress={isSameAddress} form={form} />
      ),
      title: 'Current Address',
      description: 'Please fill out the below details',
    },
  ];

  return (
    <div className={styles.BasicInformation}>
      <Row gutter={[24, 24]}>
        <Col xs={24} xxl={16}>
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
                phoneNumber,
              }
            }
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            loading={loading}
            form={form}
          >
            <Row gutter={[24, 24]}>
              {cards.map((x) => (
                <Col span={24}>
                  <Card title={x.noHeader ? null : renderCardTitle(x.title, x.description)}>
                    <div style={x.noHeader ? { padding: 24 } : {}}>{x.component}</div>
                  </Card>
                </Col>
              ))}

              <Col span={24}>{_renderBottomBar()}</Col>
            </Row>
          </Form>
        </Col>
        <Col xs={24} xxl={8}>
          <div className={styles.RightComponents}>
            <NoteComponent note={Note} />
            <MessageBox />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  ({
    optionalQuestion: {
      messageErrors,
      data: { _id, settings },
    },
    candidatePortal,
    loading,
  }) => ({
    _id,
    settings,
    messageErrors,
    candidatePortal,
    loading: loading.effects['candidatePortal/fetchCandidateById'],
    loadingUpdateCandidate: loading.effects['candidatePortal/updateByCandidateEffect'],
  }),
)(BasicInformation);
