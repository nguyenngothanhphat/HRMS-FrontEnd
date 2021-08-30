import { connect } from 'umi';
import { Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { indexOf } from 'lodash';
import { MODE } from '@/components/Question/utils';
import { PROCESS_STATUS } from '@/utils/onboarding';
import QuestionItemView from '../QuestionItemView/index';
import { Page } from '../../../pages/NewCandidateForm/utils';

const AnswerQuestion = React.memo((props) => {
  const {
    candidate,
    data: { settings = [] },
    data,
    dispatch,
    listPage,
    processStatus,
    messageErrors = [],
    page,
  } = props;

  const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (candidate !== '') {
      dispatch({
        type: 'optionalQuestion/getQuestionByPage',
        payload: {
          candidate,
          page,
        },
      });
    }
  }, [candidate]);

  useEffect(() => {
    if (indexOf(listPage, page) <= indexOf(listPage, Page.Eligibility_documents)) {
      setDisable(processStatus !== PROCESS_STATUS.SENT_PROVISIONAL_OFFERS);
    } else setDisable(processStatus === PROCESS_STATUS.ACCEPTED_FINAL_OFFERS);
  }, []);
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
            mode={disable ? MODE.VIEW : MODE.ANSWER}
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
    candidatePortal: { processStatus = '' } = {},
  }) => ({
    dispatch,
    messageErrors,
    processStatus,
    candidate,
    listPage,
    data,
  }),
)(AnswerQuestion);
