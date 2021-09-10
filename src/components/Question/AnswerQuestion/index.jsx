import { connect } from 'umi';
import { Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { MODE } from '@/components/Question/utils';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import QuestionItemView from '../QuestionItemView/index';
import { Page } from '../../../pages/NewCandidateForm/utils';

const AnswerQuestion = React.memo((props) => {
  const {
    candidate,
    data: { settings = [] },
    data,
    dispatch,
    processStatus,
    messageErrors = [],
    page,
  } = props;

  const [view, setView] = useState(false);

  const isView = () => {
    if (
      processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION &&
      (page === Page.Basic_Information ||
        page === Page.Job_Details ||
        page === Page.Eligibility_documents)
    )
      return false;
    if (processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION && page === Page.Salary_Structure)
      return false;
    return true;
  };

  useEffect(() => {
    if (candidate !== '') {
      dispatch({
        type: 'optionalQuestion/getQuestionByPage',
        payload: {
          candidate,
          page,
        },
      });
      setView(isView());
    }
  }, [candidate]);

  useEffect(() => {}, []);
  const onChangeEmployeeAnswers = async (value, key) => {
    const temp = [...settings];
    temp[key].employeeAnswers = value;
    await dispatch({
      type: 'optionalQuestion/save',
      payload: {
        data: {
          ...data,
          settings: temp,
        },
      },
    });
  };

  return (
    settings.length > 0 && (
      <Col md={24}>
        {settings.map((questionItem, key) => (
          <QuestionItemView
            mode={view ? MODE.VIEW : MODE.ANSWER}
            questionItem={questionItem}
            keyQuestion={key}
            onChangeEmployeeAnswers={onChangeEmployeeAnswers}
            errorMessage={messageErrors[key]}
          />
        ))}
      </Col>
    )
  );
});

export default connect(
  ({
    dispatch,
    optionalQuestion: { messageErrors, candidate = '', data = {}, listPage } = {},
    candidatePortal: { data: { processStatus = '' } } = {},
  }) => ({
    dispatch,
    messageErrors,
    processStatus,
    candidate,
    listPage,
    data,
  }),
)(AnswerQuestion);
