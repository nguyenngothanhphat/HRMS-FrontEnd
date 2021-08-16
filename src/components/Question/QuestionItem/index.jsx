/* eslint-disable react/jsx-curly-newline */
import AddIcon from '@/assets/add-symbols.svg';
import CircleIcon from '@/assets/circle.svg';
import RemoveIcon from '@/assets/remove.svg';
import SquareIcon from '@/assets/square.svg';
import { Button, Checkbox, Col, Input, InputNumber, notification, Row, Select, Space } from 'antd';
import { Option } from 'antd/lib/mentions';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SPECIFY, TYPE_QUESTION } from '../utils';
import styles from './index.less';

export default function QuestionItem({
  onChangeQuestionItem,
  questionItem: {
    isRequired = false,
    multiChoice = {},
    answerType = '',
    question = '',
    rating = {},
    defaultAnswers = [],
  } = {},
}) {
  // console.log('rating', rating);
  const [Icon, setIcon] = useState(CircleIcon);
  const [newOption, setNewOption] = useState(`Option ${defaultAnswers.length + 1}`);

  useEffect(() => {
    if (defaultAnswers.length < 1) onChangeQuestionItem({ defaultAnswers: ['Answer 1'] });
    let newDefaultAnswers = defaultAnswers;
    if (newDefaultAnswers.length === 0) {
      newDefaultAnswers = ['Option 1'];
    }
    // change icon
    switch (answerType) {
      case TYPE_QUESTION.TEXT_ANSWER.key:
        setIcon(null);
        onChangeQuestionItem({ defaultAnswers: [], multiChoice: {}, rating: {} });
        break;
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        onChangeQuestionItem({
          multiChoice: {
            specify: SPECIFY.AT_LEAST.key,
            num: 1,
          },
          rating: {},
          defaultAnswers: newDefaultAnswers,
        });
        setIcon(SquareIcon);
        break;
      case TYPE_QUESTION.SINGLE_CHOICE.key:
        setIcon(CircleIcon);
        onChangeQuestionItem({ defaultAnswers: newDefaultAnswers, multiChoice: {}, rating: {} });
        break;
      case TYPE_QUESTION.SELECT_OPTION.key:
        setIcon(null);
        onChangeQuestionItem({ defaultAnswers: newDefaultAnswers, multiChoice: {}, rating: {} });
        break;
      case TYPE_QUESTION.RATING_CHOICE.key:
        setIcon(null);
        // console.log('set rating', rating);
        if (!rating.columns)
          onChangeQuestionItem({
            defaultAnswers: [],
            multiChoice: {},
            rating: {
              columns: [1, 5],
              rows: ['Bad', 'Good'],
            },
          });
        break;
      case TYPE_QUESTION.MULTI_RATING_CHOICE.key:
        if (!rating.columns && !rating.rows)
          onChangeQuestionItem({
            defaultAnswers: new Array(1),
            multiChoice: {},
            rating: {
              columns: ['Column 1'],
              rows: ['Row 1'],
            },
          });
        break;
      default:
        setIcon(null);
        break;
    }
  }, [answerType]);

  useEffect(() => {
    setNewOption(`Option ${defaultAnswers.length + 1}`);
  }, [defaultAnswers]);

  const onAddAnswer = () => {
    onChangeQuestionItem({
      defaultAnswers: [...defaultAnswers, newOption],
    });
  };

  const onChangeAnswer = (e, indexOfAnswer) => {
    onChangeQuestionItem({
      defaultAnswers: [
        ...defaultAnswers.slice(0, indexOfAnswer),
        e.target.value,
        ...defaultAnswers.slice(indexOfAnswer + 1),
      ],
    });
  };
  const onChangeMultiRating = (e, indexOfAnswer, position) => {
    switch (position) {
      case 'row':
        onChangeQuestionItem({
          rating: {
            columns: [...rating.columns],
            rows: [
              ...rating.rows.slice(0, indexOfAnswer),
              e.target.value,
              ...rating.rows.slice(indexOfAnswer + 1),
            ],
          },
          defaultAnswers: new Array(rating.row.length),
        });
        break;
      case 'col':
        onChangeQuestionItem({
          rating: {
            columns: [
              ...rating.columns.slice(0, indexOfAnswer),
              e.target.value,
              ...rating.columns.slice(indexOfAnswer + 1),
            ],
            rows: [...rating.rows],
          },
        });
        break;
      default:
        break;
    }
  };
  const addRating = (position) => {
    switch (position) {
      case 'row':
        onChangeQuestionItem({
          rating: {
            columns: [...rating.columns],
            rows: [...rating.rows, `Row ${rating.rows.length + 1}`],
          },
        });
        break;
      case 'col':
        onChangeQuestionItem({
          rating: {
            rows: [...rating.rows],
            columns: [...rating.columns, `Columns ${rating.columns.length + 1}`],
          },
        });
        break;
      default:
        break;
    }
  };
  const onRemoveAnswer = (e, indexOfAnswer) => {
    if (defaultAnswers.length === 1) {
      return notification.error({
        message: 'This type of question must have at least one answer!',
      });
    }
    let newMultiChoice = multiChoice;
    if (defaultAnswers.length === multiChoice.num) {
      newMultiChoice = { ...multiChoice, num: defaultAnswers.length - 1 };
    }
    return onChangeQuestionItem({
      defaultAnswers: [
        ...defaultAnswers.slice(0, indexOfAnswer),
        ...defaultAnswers.slice(indexOfAnswer + 1),
      ],
      multiChoice: newMultiChoice,
    });
  };

  const _renderAnswer = () => {
    switch (answerType) {
      case TYPE_QUESTION.TEXT_ANSWER.key:
        return (
          <Col>
            <Input.TextArea rows={4} placeholder="Answer here" />
            <div
              className="label-input"
              style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}
            >
              Maximum character limit 200.
            </div>
          </Col>
        );
      case TYPE_QUESTION.SINGLE_CHOICE.key:
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        return defaultAnswers.map((answer, key) => (
          <Col className={styles.questionItem__answer}>
            <div className={styles.questionItem__answer__display}>
              <img
                style={{ width: '18px', height: '18px', marginRight: '10px' }}
                src={Icon}
                alt="icon"
              />
              <Input
                onChange={(e) => onChangeAnswer(e, key)}
                style={{ marginLeft: '12px' }}
                placeholder="Enter the answer"
                value={answer}
              />
            </div>
            <img
              onClick={(e) => onRemoveAnswer(e, key)}
              className={styles.questionItem__answer__remove}
              alt="delete icon"
              src={RemoveIcon}
            />
          </Col>
        ));
      case TYPE_QUESTION.SELECT_OPTION.key:
        return defaultAnswers.map((answer, key) => (
          <Col className={styles.questionItem__answer}>
            <Input
              onChange={(e) => onChangeAnswer(e, key)}
              style={{ marginLeft: '12px' }}
              placeholder="Enter the answer"
              value={answer}
            />
            <img
              onClick={(e) => onRemoveAnswer(e, key)}
              className={styles.questionItem__answer__remove}
              alt="delete icon"
              src={RemoveIcon}
            />
          </Col>
        ));
      case TYPE_QUESTION.MULTI_RATING_CHOICE.key:
        return (
          <Row style={{ marginTop: '5px' }}>
            <Col span={12}>
              <Space>
                <strong>Rows</strong>
              </Space>
              {map(rating.rows, (row, index) => (
                <Row
                  key={index}
                  // style={{ marginTop: '5px' }}
                  className={styles.questionItem__answer2}
                >
                  {' '}
                  {`0${index + 1}`.substr(-2)}.{' '}
                  <Input
                    onChange={(e) => onChangeMultiRating(e, index, 'row')}
                    style={{ marginLeft: '12px', justifyContent: 'left' }}
                    placeholder="Enter the answer"
                    value={row}
                  />
                </Row>
              ))}
              <Row style={{ marginTop: '5px' }}>
                {`0${rating.rows?.length + 1}`.substr(-2)}.{' '}
                <div type="Button" className={styles.addRating} onClick={() => addRating('row')}>
                  Add row
                </div>
              </Row>
            </Col>
            <Col span={12}>
              <Space>
                <strong>Columns</strong>
              </Space>
              {map(rating.columns, (col, index) => (
                <Row
                  key={index + 1}
                  // style={{ marginTop: '5px' }}
                  className={styles.questionItem__answer2}
                >
                  {' '}
                  {`0${index + 1}`.substr(-2)}.{' '}
                  <Input
                    onChange={(e) => onChangeMultiRating(e, index, 'col')}
                    style={{ marginLeft: '12px' }}
                    placeholder="Enter the answer"
                    value={col}
                  />
                </Row>
              ))}
              <Row style={{ marginTop: '5px' }}>
                {`0${rating.columns?.length + 1}`.substr(-2)}.{' '}
                <div type="Button" className={styles.addRating} onClick={() => addRating('col')}>
                  Add column
                </div>
              </Row>
            </Col>
          </Row>
        );
      default:
        return <></>;
    }
  };

  const _renderExtra = () => {
    switch (answerType) {
      case TYPE_QUESTION.RATING_CHOICE.key:
        return (
          <>
            {rating.columns && (
              <>
                <Select
                  style={{ width: '80px' }}
                  onChange={(e) =>
                    onChangeQuestionItem({ rating: { ...rating, columns: [e, rating.columns[1]] } })
                  }
                  defaultValue={rating.columns[0]}
                >
                  {map([...Array(10)], (value, index) => (
                    <Option value={index + 1}>{`0${index + 1}`.substr(-2)}</Option>
                  ))}
                </Select>
                <span style={{ margin: '0 16px' }}>to</span>
                <Select
                  style={{ width: '80px' }}
                  onChange={(e) => {
                    if (e <= rating.columns[0]) {
                      return notification.error({
                        message: `This value must be greater than ${rating.columns[0]}`,
                      });
                    }
                    return onChangeQuestionItem({
                      rating: { ...rating, columns: [rating.columns[0], e] },
                    });
                  }}
                  defaultValue={rating.columns[1]}
                >
                  {map([...Array(10)], (value, index) => (
                    <Option value={index + 1}>{`0${index + 1}`.substr(-2)}</Option>
                  ))}
                </Select>
              </>
            )}
          </>
        );
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        return (
          <>
            <div className={styles.questionItem__question__extra__specify}>
              <div className="label-input">Specify:</div>
              <div className={styles.questionItem__question__extra__specify__input}>
                <Select
                  onChange={(e) =>
                    onChangeQuestionItem({ multiChoice: { ...multiChoice, specify: e } })
                  }
                  defaultValue={multiChoice?.specify || SPECIFY.AT_LEAST.key}
                >
                  {map(SPECIFY, (type) => (
                    <Option value={type.key}>{type.value}</Option>
                  ))}
                </Select>
                <InputNumber
                  min={1}
                  max={defaultAnswers.length}
                  value={multiChoice.num}
                  onChange={(value) =>
                    onChangeQuestionItem({ multiChoice: { ...multiChoice, num: value } })
                  }
                />
              </div>
            </div>
            <div className={styles.questionItem__question__extra__note}>
              <strong>Note:</strong> This allows to specify how answers should be chosen.
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const _renderAddOption = () => {
    switch (answerType) {
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
      case TYPE_QUESTION.SINGLE_CHOICE.key:
      case TYPE_QUESTION.SELECT_OPTION.key:
        return (
          <Col className={styles.questionItem__addOption} span={24}>
            <div className={styles.questionItem__addOption__label}>Options:</div>
            <Input
              onChange={(e) => setNewOption(e.target.value)}
              style={{ marginLeft: '12px' }}
              placeholder="Enter the answer"
              value={newOption}
            />
            <Button
              type="link"
              style={{ display: 'flex', alignItems: 'center', paddingLeft: '0px' }}
              onClick={() => onAddAnswer()}
            >
              <img src={AddIcon} alt="Add icon" style={{ width: '17px', marginRight: '16px' }} />
              <span className={styles.questionItem__addOption__add}> Add option </span>
            </Button>
          </Col>
        );
      case TYPE_QUESTION.RATING_CHOICE.key:
        // console.log(rating.rows, rating.columns);
        return (
          <>
            {rating.rows && rating.columns && (
              <>
                <Col className={styles.questionItem__addLabel} span={24}>
                  <div className={styles.questionItem__addLabel__label}>{rating.columns[0]}:</div>
                  <Input
                    onChange={(e) =>
                      onChangeQuestionItem({
                        rating: { ...rating, rows: [e.target.value, rating.rows[1]] },
                      })
                    }
                    style={{ marginLeft: '12px' }}
                    placeholder="Label"
                    value={rating.rows[0]}
                  />
                </Col>
                <Col className={styles.questionItem__addLabel} span={24}>
                  <div className={styles.questionItem__addLabel__label}>{rating.columns[1]}:</div>
                  <Input
                    onChange={(e) =>
                      onChangeQuestionItem({
                        rating: { ...rating, rows: [rating.rows[0], e.target.value] },
                      })
                    }
                    style={{ marginLeft: '12px' }}
                    placeholder="Label"
                    value={rating.rows[1]}
                  />
                </Col>
              </>
            )}
          </>
        );
      default:
        return <div>&nbsp;</div>;
    }
  };

  return (
    <>
      <Row className={styles.questionItem}>
        <Col span={24} className={styles.questionItem__type}>
          <div style={{ marginBottom: '8px' }} className="label-input">
            Type of questions
          </div>
          <Select
            onChange={(e) => onChangeQuestionItem({ answerType: e })}
            defaultValue={answerType}
            style={{ width: '100%' }}
          >
            {map(TYPE_QUESTION, (type) => (
              <Option value={type.key}>{type.value}</Option>
            ))}
          </Select>
        </Col>
        <Col span={24} className={styles.questionItem__question}>
          <Input
            placeholder="Type your question"
            onChange={(e) => onChangeQuestionItem({ question: e.target.value })}
            value={question}
            // allowClear
          />
          <Row className={styles.questionItem__question__extra}>
            <Col span={12}>{_renderExtra()}</Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end' }} span={12}>
              <Checkbox
                onChange={(e) => onChangeQuestionItem({ isRequired: e.target.checked })}
                checked={isRequired}
              >
                Mandatory
              </Checkbox>
            </Col>
            <Col
              style={
                answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key ||
                answerType === TYPE_QUESTION.SELECT_OPTION.key ||
                answerType === TYPE_QUESTION.SINGLE_CHOICE.key ||
                answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key
                  ? { borderTop: '1px solid #d6dce0' }
                  : {}
              }
              span={24}
            >
              {_renderAnswer()}
            </Col>
          </Row>
        </Col>
        {_renderAddOption()}
      </Row>
    </>
  );
}
