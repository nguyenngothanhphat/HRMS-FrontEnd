import React, { useEffect } from 'react';

import { connect, formatMessage } from 'umi';
import { Row, Col, Button, Form, Typography, Input, Select } from 'antd';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import s from './index.less';
import { getCurrentTenant } from '@/utils/authority';

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
    // console.log('Select');
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
    checkMandatory,
    dispatch,
    // currentStep,
    hidePreviewOffer,
    additionalQuestion: additionalQuestionProp,
    additionalQuestions: additionalQuestionsProp,
    candidate,
  } = props;

  const {
    opportunity: opportunityProp,
    payment: paymentProp,
    shirt: shirtProp,
    dietary: dietaryProp,
  } = additionalQuestionProp;

  const [form] = Form.useForm();

  const onClickPrevious = () => {
    // const prevStep = currentStep - 1;
    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     currentStep: prevStep,
    //   },
    // });
  };

  const onClickNext = () => {
    const dataToSend = additionalQuestionsProp.map((item) => {
      const { question, answer, defaultAnswer, description, type } = item;
      return { question, answer, defaultAnswer, description, type };
    });

    // console.log(dataToSend);

    dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        additionalQuestions: dataToSend,
        candidate,
        tenantId: getCurrentTenant(),
      },
    });

    if (hidePreviewOffer) {
    }

    // const nextStep = currentStep + 1;
    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     currentStep: nextStep,
    //   },
    // });
  };

  const _renderStatus = () => {
    const { checkMandatory } = props;
    const { filledAdditionalQuestion } = checkMandatory;
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
    const { checkMandatory } = props;
    const { filledAdditionalQuestion } = checkMandatory;

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
      type: 'newCandidateForm/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
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

    dispatch({
      type: 'newCandidateForm/updateAdditionalQuestions',
      payload: newValues,
    });
    // dispatch({
    //   type: 'newCandidateForm/updateAdditionalQuestion',
    //   payload: allValues,
    // });
  };

  const handleFormChange = () => {
    checkAllFieldsValidate();
  };

  useEffect(() => {
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
                        const { name = '', type = '', question = '', answer = '' } = item;
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
    newCandidateForm: {
      checkMandatory = {},
      currentStep = 7,
      data: { _id: candidate = '' } = {},
      tempData: { hidePreviewOffer = true, additionalQuestion = {}, additionalQuestions = [] },
    } = {},
  }) => ({
    checkMandatory,
    currentStep,
    hidePreviewOffer,
    additionalQuestion,
    additionalQuestions,
    candidate,
  }),
)(AdditionalQuestion);
