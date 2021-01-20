import React, { useEffect } from 'react';

import { connect, formatMessage } from 'umi';
import { Row, Col, Button, Form, Typography, Input, Select } from 'antd';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import s from './index.less';

const Note = {
  title: 'Note',
  data: (
    <Typography.Text>
      Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
      working days for entire process to complete
    </Typography.Text>
  ),
};

const INPUT_TYPE = {
  TEXT: 'text',
  SELECT: 'select',
};

const getInput = (data) => {
  const { type = '' } = data;
  // console.log(data);
  const { Option } = Select;
  if (type === INPUT_TYPE.TEXT) {
    return <Input />;
  }
  if (type === INPUT_TYPE.SELECT) {
    const { defaultAnswer = [] } = data;
    console.log('Select');
    return (
      <Select>
        {defaultAnswer.map((answerItem) => (
          <Option value={answerItem}>{answerItem}</Option>
        ))}
      </Select>
    );
  }
  return null;
};

const AdditionalQuestion = (props) => {
  const {
    checkCandidateMandatory,
    dispatch,
    localStep,
    // additionalQuestion: additionalQuestionProp,
    additionalQuestions: additionalQuestionsProp,
    candidate,
    loading1,
  } = props;

  // const {
  //   opportunity: opportunityProp,
  //   payment: paymentProp,
  //   shirt: shirtProp,
  //   dietary: dietaryProp,
  // } = additionalQuestionProp;

  const [form] = Form.useForm();

  const onClickPrevious = () => {
    const prevStep = localStep - 1;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: prevStep,
      },
    });
  };

  const onClickNext = async () => {
    const dataToSend = additionalQuestionsProp.map((item) => {
      const { question, answer, defaultAnswer, description, type } = item;
      return { question, answer, defaultAnswer, description, type };
    });

    console.log(dataToSend);

    const response = await dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        additionalQuestions: dataToSend,
        candidate,
      },
    });

    const { statusCode = 1 } = response;
    if (statusCode !== 200) {
      return;
    }
    // if (hidePreviewOffer) {
    //   return;
    // }

    const nextStep = localStep + 1;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: nextStep,
      },
    });
  };

  const _renderStatus = () => {
    const { filledAdditionalQuestion } = checkCandidateMandatory;
    return !filledAdditionalQuestion ? (
      <div className={s.normalText}>
        <div className={s.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={s.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  const _renderBottomBar = () => {
    // const { checkCandidateMandatory } = props;
    const { filledAdditionalQuestion } = checkCandidateMandatory;

    return (
      <div className={s.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={s.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={s.bottomBar__button}>
              <Button
                type="secondary"
                onClick={onClickPrevious}
                className={s.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickNext}
                className={`${s.bottomBar__button__primary} ${
                  !filledAdditionalQuestion ? s.bottomBar__button__disabled : ''
                }`}
                loading={loading1}
                disabled={!filledAdditionalQuestion}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const checkAllFieldsValidate = () => {
    const allValues = form.getFieldsValue();
    console.log(allValues);
    let valid = true;
    Object.keys(allValues).forEach((key) => {
      if (allValues[key].length === 0) {
        valid = false;
      }
    });

    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        checkCandidateMandatory: {
          ...checkCandidateMandatory,
          filledAdditionalQuestion: valid,
        },
      },
    });

    // Save input data
    const newValues = additionalQuestionsProp.map((item) => {
      const { name } = item;
      return {
        ...item,
        answer: allValues[name],
      };
    });
    console.log('newValues', newValues);

    dispatch({
      type: 'candidateProfile/updateAdditionalQuestions',
      payload: newValues,
    });
    // dispatch({
    //   type: 'candidateInfo/updateAdditionalQuestion',
    //   payload: allValues,
    // });
  };

  const handleFormChange = () => {
    checkAllFieldsValidate();
  };

  useEffect(() => {
    window.scrollTo(0, 70); // Back to top of the page
    checkAllFieldsValidate();
  }, []);

  const getInitialValues = () => {
    let formattedValues = {};
    additionalQuestionsProp.map((item) => {
      const { name = '', answer = '' } = item;
      formattedValues = {
        ...formattedValues,
        [name]: answer,
      };
      return null;
    });
    return formattedValues;
  };

  // console.log(getInitialValues());

  return (
    <div className={s.additionalQuestion}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={s.left}>
            <header>
              <h1>Additional Question</h1>
              <p>Additional Question</p>
            </header>

            <div className={s.mainContent}>
              <Form
                form={form}
                // initialValues={{
                //   opportunity: opportunityProp,
                //   payment: paymentProp,
                //   shirt: shirtProp,
                //   dietary: dietaryProp,
                // }}
                initialValues={getInitialValues()}
                onValuesChange={handleFormChange}
                layout="vertical"
              >
                <div className={s.form}>
                  <Row>
                    <Col md={12}>
                      {additionalQuestionsProp.map((item) => {
                        const { name = '', question = '', defaultAnswer = [] } = item;
                        if (defaultAnswer.length === 0) {
                          return null;
                        }
                        return (
                          <Form.Item name={name} label={question}>
                            {getInput(item)}
                          </Form.Item>
                        );
                      })}

                      {/* <Form.Item name="opportunity" label="Equal employee opportunity">
                        <Input />
                      </Form.Item> */}
                    </Col>
                  </Row>
                </div>
              </Form>
              {/* <Form
                form={form}
                initialValues={{
                  opportunity: opportunityProp,
                  payment: paymentProp,
                  shirt: shirtProp,
                  dietary: dietaryProp,
                }}
                onValuesChange={handleFormChange}
                layout="vertical"
              >
                <div className={s.form}>
                  <Row>
                    <Col md={12}>
                      <Form.Item name="opportunity" label="Equal employee opportunity">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col md={12}>
                      <Form.Item name="payment" label="Preferred payment method">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Item name="shirt" label="T-shirt size">
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col md={12}>
                      <Form.Item name="dietary" label="Dietary restrictions">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Form> */}
            </div>
          </div>

          {_renderBottomBar()}
        </Col>
        <Col className={s.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
          <div style={{ width: '322px' }}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row style={{ width: '100%' }}>
              <StepsComponent />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  ({
    candidateProfile: {
      checkCandidateMandatory = {},
      localStep = 7,
      data: { _id: candidate = '' } = {},
      tempData: { hidePreviewOffer = true, additionalQuestion = {}, additionalQuestions = [] },
    } = {},
    loading,
  }) => ({
    checkCandidateMandatory,
    localStep,
    hidePreviewOffer,
    additionalQuestion,
    additionalQuestions,
    candidate,
    loading1: loading.effects['candidateProfile/updateByCandidateEffect'],
  }),
)(AdditionalQuestion);
