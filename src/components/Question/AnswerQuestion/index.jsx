import { connect } from 'umi';
import { Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { MODE } from '@/components/Question/utils';
import QuestionItemView from '../QuestionItemView/index';

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
    setDisable(processStatus === 'ACCEPT-FINAL-OFFER');
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
    optionalQuestion: { messageErrors, candidate = '', data = {} } = {},
    candidateProfile: { processStatus },
  }) => ({
    dispatch,
    messageErrors,
    processStatus,
    candidate,
    data,
  }),
)(AnswerQuestion);
