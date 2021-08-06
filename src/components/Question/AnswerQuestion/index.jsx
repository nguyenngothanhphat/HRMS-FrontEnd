import { connect } from 'umi';
import { Col } from 'antd';
import React, { useEffect } from 'react';
import { MODE } from '@/components/Question/utils';
import QuestionItemView from '../QuestionItemView/index';

const AnswerQuestion = React.memo((props) => {
  const {
    candidate,
    data: { settings = [] },
    data,
    dispatch,
    prevPage,
    pageName,
  } = props;
  useEffect(() => {
    if (candidate !== '' && pageName !== '' && pageName !== prevPage) {
      dispatch({
        type: 'optionalQuestion/getQuestionByPage',
        payload: {
          candidate,
          page: pageName,
        },
      });
    }
  }, [pageName]);

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
            mode={MODE.ANSWER}
            questionItem={questionItem}
            keyQuestion={key}
            onChangeEmployeeAnswers={onChangeEmployeeAnswers}
          />
        ))}
      </Col>
    )
  );
});

export default connect(
  ({
    dispatch,
    optionalQuestion: { prevPage, candidate = '', pageName = '', data = {} } = {},
  }) => ({
    dispatch,
    prevPage,
    candidate,
    pageName,
    data,
  }),
)(AnswerQuestion);
