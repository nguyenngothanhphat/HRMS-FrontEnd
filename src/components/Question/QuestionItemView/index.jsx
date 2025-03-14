import EditIcon from '@/assets/editBtnBlue.svg';
import RemoveIcon from '@/assets/remove.svg';
import { Button, Checkbox, Col, Input, Radio, Row, Space, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { TYPE_QUESTION, SPECIFY, MODE } from '../utils';
import styles from './index.less';

export default function QuestionItemView({
  questionItem,
  keyQuestion,
  openModalEdit,
  openModalRemove,
  mode = MODE.EDIT,
  errorMessage,
  onChangeEmployeeAnswers = () => {},
}) {
  const {
    isRequired = false,
    multiChoice = {},
    answerType = '',
    question = '',
    rating = {},
    defaultAnswers = [],
    employeeAnswers = [],
    // errorMessage = '',
  } = questionItem;

  const [errMessage, setErrMessage] = useState(errorMessage);
  useEffect(() => {
    setErrMessage(errorMessage);
  }, [errorMessage]);
  const changeMultiChoice = (values) => {
    const { specify = {}, num } = multiChoice || {};
    onChangeEmployeeAnswers(values, keyQuestion);
    if (!isRequired && !values.length) {
      return setErrMessage('');
    }
    if (specify === SPECIFY.AT_LEAST.key && values.length < num) {
      setErrMessage(`This question has at least ${num} answers`);
    } else if (specify === SPECIFY.AT_MOST.key && values.length > num) {
      setErrMessage(`This question has at most ${num} answers`);
    } else if (specify === SPECIFY.EXACTLY.key && values.length !== num) {
      setErrMessage(`This question has exactly ${num} answers`);
    } else {
      setErrMessage('');
    }
    return true;
  };
  const onChangeRating = (e, i) => {
    defaultAnswers[i] = `${e.target.value}`;
    onChangeEmployeeAnswers(defaultAnswers, keyQuestion);
  };
  const _renderAnswer = () => {
    switch (answerType) {
      case TYPE_QUESTION.SINGLE_CHOICE.key:
        return (
          <Radio.Group
            onChange={(e) => onChangeEmployeeAnswers([e.target.value], keyQuestion)}
            value={employeeAnswers[0]}
            disabled={mode !== MODE.ANSWER}
          >
            <Space direction="vertical">
              {defaultAnswers.map((answer) => (
                <Radio value={answer}>{answer}</Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        return (
          <Checkbox.Group
            defaultValue={employeeAnswers}
            onChange={(values) => changeMultiChoice(values)}
            style={{ width: '100%' }}
            disabled={mode !== MODE.ANSWER}
          >
            {defaultAnswers.map((answer) => (
              <div style={{ marginBottom: '5px' }}>
                <Checkbox value={answer}>{answer}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        );
      case TYPE_QUESTION.TEXT_ANSWER.key:
        return (
          <Input.TextArea
            placeholder="Type here"
            onChange={(e) => onChangeEmployeeAnswers([e.target.value], keyQuestion)}
            value={employeeAnswers[0]}
            rows={4}
            disabled={mode !== MODE.ANSWER}
          />
        );
      case TYPE_QUESTION.RATING_CHOICE.key:
        return (
          <div className={styles.questionItem__rating}>
            <span>{rating.rows[0]}</span>
            <Radio.Group
              onChange={(e) => onChangeEmployeeAnswers([e.target.value], keyQuestion)}
              value={parseInt(employeeAnswers[0], 10)}
              disabled={mode !== MODE.ANSWER}
            >
              {[...Array(Math.abs(rating.columns[0] - rating.columns[1]) + 1)].map(
                (item, index) => (
                  <Radio value={rating.columns[0] + index}>{rating.columns[0] + index}</Radio>
                ),
              )}
            </Radio.Group>
            <span>{rating.rows[1]}</span>
          </div>
        );
      case TYPE_QUESTION.MULTI_RATING_CHOICE.key:
        return (
          <div>
            <Row>
              <Col flex="100px" key={0} />
              {rating.columns?.map((item) => (
                <Col flex={1}>
                  <div className={styles.contentColumns}>{item}</div>
                </Col>
              ))}
            </Row>
            {rating.rows?.map((item, i) => (
              <Row>
                <Col flex="100px">{item}</Col>
                <Col flex="auto">
                  <Radio.Group
                    style={{ width: '100%' }}
                    onChange={(e) => onChangeRating(e, i)}
                    value={parseInt(employeeAnswers[i], 10)}
                    disabled={mode !== MODE.ANSWER}
                  >
                    <Space direction="horizontal" className={styles.radioGroup}>
                      {[...Array(rating.columns.length)].map((k, j) => (
                        <Radio value={j} />
                      ))}
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            ))}
          </div>
        );
      case TYPE_QUESTION.SELECT_OPTION.key:
        return (
          <Select
            value={employeeAnswers[0] && employeeAnswers[0]}
            placeholder="Select a option"
            onChange={(value) => onChangeEmployeeAnswers([value], keyQuestion)}
            style={{ width: '100%' }}
            showSearch
            disabled={mode !== MODE.ANSWER}
          >
            {defaultAnswers.map((answer) => (
              <Select.Option value={answer}>{answer}</Select.Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Row className={styles.questionItem}>
      <Col span={mode === MODE.EDIT ? 18 : 24}>
        <div className={styles.questionItem__question}>
          {keyQuestion + 1}. {question} {isRequired && <span className={styles.required}>(*)</span>}
        </div>
        <Col className={styles.questionItem__answer}>
          {_renderAnswer()}
          {errMessage && (
            <div className={styles.errorMessage} role="alert">
              {errMessage}
            </div>
          )}
        </Col>
      </Col>
      {mode === 'edit' && (
        <div className={styles.questionItem__manage}>
          <Button
            type="link"
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0px',
              paddingRight: '0px',
            }}
            onClick={() => openModalEdit(questionItem, keyQuestion)}
          >
            <img src={EditIcon} alt="Edit icon" style={{ width: '16px', marginRight: '8px' }} />
            <span style={{ paddingRight: '16px', borderRight: '1px solid #B5B8BD' }}> Edit </span>
          </Button>
          <Button
            type="link"
            style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px' }}
            onClick={() => openModalRemove(questionItem, keyQuestion)}
          >
            <img src={RemoveIcon} alt="Remove icon" style={{ width: '16px', marginRight: '8px' }} />
            <span style={{ color: '#FF6565' }}> Delete </span>
          </Button>
        </div>
      )}
    </Row>
  );
}
