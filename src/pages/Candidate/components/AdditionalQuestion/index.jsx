import QuestionItemView from '@/components/Question/QuestionItemView';
import { getCurrentTenant } from '@/utils/authority';
import { Button, Col, Form, Row, Typography } from 'antd';
import React, { useEffect } from 'react';
import { connect, formatMessage } from 'umi';
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

const AdditionalQuestion = (props) => {
  const { checkCandidateMandatory, dispatch, localStep, questionOnBoarding, candidate, loading1 } =
    props;

  const checkAllFieldsValidate = () => {
    const valid = questionOnBoarding.every(
      (question) => question.employeeAnswers.filter((answer) => answer).length > 0,
    );

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
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }, []);

  /**
   * Check if all the questions have been answered or not
   */
  useEffect(() => {
    checkAllFieldsValidate();
  }, [questionOnBoarding]);

  /**
   * Change the employee's answers in a sentence through the key of the question
   * @param {*} employeeAnswers
   * @param {*} keyOfQuestion
   */
  const onChangeEmployeeAnswers = (employeeAnswers, keyOfQuestion) => {
    dispatch({
      type: 'candidateProfile/saveTemp',
      payload: {
        questionOnBoarding: [
          ...questionOnBoarding.slice(0, keyOfQuestion),
          {
            ...questionOnBoarding[keyOfQuestion],
            employeeAnswers,
          },
          ...questionOnBoarding.slice(keyOfQuestion + 1),
        ],
      },
    });
  };

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
    const response = await dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        questionOnBoarding: questionOnBoarding.reverse(),
        candidate,
        tenantId: getCurrentTenant(),
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
              <Form layout="vertical">
                <div className={s.form}>
                  <Row>
                    <Col md={24}>
                      {questionOnBoarding.map((questionItem, key) => (
                        <QuestionItemView
                          control={false}
                          questionItem={questionItem}
                          keyQuestion={key}
                          onChangeEmployeeAnswers={onChangeEmployeeAnswers}
                        />
                      ))}
                    </Col>
                  </Row>
                </div>
              </Form>
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
      tempData: { hidePreviewOffer = true, questionOnBoarding = [] },
    } = {},
    loading,
  }) => ({
    checkCandidateMandatory,
    localStep,
    hidePreviewOffer,
    questionOnBoarding,
    candidate,
    loading1: loading.effects['candidateProfile/updateByCandidateEffect'],
  }),
)(AdditionalQuestion);
