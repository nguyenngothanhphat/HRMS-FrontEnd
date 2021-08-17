import QuestionItemView from '@/components/Question/QuestionItemView';
import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import { TYPE_QUESTION, SPECIFY, MODE } from '@/components/Question/utils';
import { every, indexOf } from 'lodash';
import { PROCESS_STATUS } from '@/utils/onboarding';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import s from './index.less';
import { Page } from '../../../FormTeamMember/utils';

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
  const {
    listPage,
    data: { settings },
    data,
    checkCandidateMandatory,
    dispatch,
    localStep,
    messageErrors,
    candidate,
    processStatus,
  } = props;
  const [disable, setDisable] = useState(false);

  const checkAllFieldsValidate = () => {
    const valid = settings.map((question) => {
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

  const checkDisable = () => {
    if (indexOf(Page.Eligibility_documents) >= localStep - 1) {
      setDisable(processStatus !== PROCESS_STATUS.SENT_PROVISIONAL_OFFERS);
    } else {
      setDisable(processStatus === PROCESS_STATUS.ACCEPTED_FINAL_OFFERS);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
    if (candidate !== '') {
      dispatch({
        type: 'optionalQuestion/getQuestionByName',
        payload: {
          candidate,
          name: listPage[localStep - 1],
        },
      });
    }
    checkDisable();
  }, []);

  /**
   * Change the employee's answers in a sentence through the key of the question
   * @param {*} employeeAnswers
   * @param {*} keyOfQuestion
   */

  const onClickPrevious = () => {
    const prevStep = localStep - 1;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: prevStep,
      },
    });
  };

  const onClickNext = () => {
    const messageErr = checkAllFieldsValidate();
    if (every(messageErr, (message) => message === null)) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: data._id,
          settings,
        },
      });

      const nextStep = localStep + 1;
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          localStep: nextStep,
        },
      });
    }
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
                className={s.bottomBar__button__primary}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  const onChangeEmployeeAnswers = (value, key) => {
    const temp = [...settings];
    temp[key].employeeAnswers = value;
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        data: {
          ...data,
          settings: temp,
        },
      },
    });
  };
  // main
  return (
    <div className={s.additionalQuestion}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={s.left}>
            <header>
              <h1>{data && data.name}</h1>
              {/* <p>Additional Question</p> */}
            </header>

            <div className={s.mainContent}>
              <div className={s.form}>
                <Row>
                  {settings && settings.length > 0 && (
                    <Col md={24}>
                      {settings.map((questionItem, key) => (
                        <QuestionItemView
                          mode={disable ? MODE.VIEW : MODE.ANSWER}
                          questionItem={questionItem}
                          keyQuestion={key}
                          onChangeEmployeeAnswers={onChangeEmployeeAnswers}
                          errorMessage={messageErrors[key]}
                        />
                      ))}
                    </Col>
                  )}
                </Row>
              </div>
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
    optionalQuestion: { listPage = [], data = {}, messageErrors = [] },
    candidateProfile: {
      processStatus,
      checkCandidateMandatory = {},
      localStep = 7,
      data: { _id: candidate = '' } = {},
      tempData: { hidePreviewOffer = true, questionOnBoarding = [] },
    } = {},
    loading,
  }) => ({
    listPage,
    data,
    messageErrors,
    checkCandidateMandatory,
    localStep,
    processStatus,
    hidePreviewOffer,
    questionOnBoarding,
    candidate,
    loading1: loading.effects['candidateProfile/updateByCandidateEffect'],
  }),
)(AdditionalQuestion);
