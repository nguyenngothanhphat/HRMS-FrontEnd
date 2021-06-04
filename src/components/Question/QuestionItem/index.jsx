import CircleIcon from '@/assets/circle.svg';
import SquareIcon from '@/assets/square.svg';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Tooltip } from 'antd';
import { Option } from 'antd/lib/mentions';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import TYPE_QUESTION from '../utils';
import styles from './index.less';

export default function QuestionItem({
  onChangeQuestionItem,
  questionItem: { answerType = '', question = '', defaultAnswers = [] } = {},
}) {
  const [Icon, setIcon] = useState(CircleIcon);
  useEffect(() => {
    if (defaultAnswers.length < 1) onChangeQuestionItem({ defaultAnswers: ['Answer 1'] });

    // change icon
    switch (answerType) {
      case TYPE_QUESTION.TEXT_ANSWER.key:
        setIcon(null);
        onChangeQuestionItem({ defaultAnswers: [] });
        break;
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        setIcon(SquareIcon);
        break;
      case TYPE_QUESTION.SINGLE_CHOICE.key:
        setIcon(CircleIcon);
        break;
      default:
        setIcon(null);
        break;
    }
  }, [answerType]);

  const onAddAnswer = () => {
    onChangeQuestionItem({
      defaultAnswers: [...defaultAnswers, `Answer ${defaultAnswers.length + 1}`],
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

  const onRemoveAnswer = (e, indexOfAnswer) => {
    onChangeQuestionItem({
      defaultAnswers: [
        ...defaultAnswers.slice(0, indexOfAnswer),
        ...defaultAnswers.slice(indexOfAnswer + 1),
      ],
    });
  };

  const _renderAnswer = () => {
    if (answerType === TYPE_QUESTION.TEXT_ANSWER.key) {
      return (
        <Col className={styles.questionItem__answer}>
          <Input placeholder={TYPE_QUESTION.TEXT_ANSWER.value} disabled />
        </Col>
      );
    }

    return defaultAnswers.map((answer, key) => (
      <Col className={styles.questionItem__answer}>
        {answerType === TYPE_QUESTION.SELECT_OPTION.key && `${key + 1}. `}
        {answerType !== TYPE_QUESTION.SELECT_OPTION.key && (
          <img style={{ width: '18px', height: '18px' }} src={Icon} alt="icon" />
        )}
        <Input
          onChange={(e) => onChangeAnswer(e, key)}
          style={{ marginLeft: '12px' }}
          placeholder="Enter the answer"
          value={answer}
        />
        {key > 0 && (
          <CloseOutlined
            onClick={(e) => onRemoveAnswer(e, key)}
            className={styles.questionItem__answer__remove}
          />
        )}
      </Col>
    ));
  };

  return (
    <>
      <Row className={styles.questionItem}>
        <Col span={18}>
          <Input
            placeholder="Enter the question"
            onChange={(e) => onChangeQuestionItem({ question: e.target.value })}
            value={question}
            allowClear
          />
          {_renderAnswer()}
        </Col>
        <Col span={5} offset={1}>
          <Select
            onChange={(e) => onChangeQuestionItem({ answerType: e })}
            defaultValue={answerType}
            style={{ width: '100%' }}
          >
            {map(TYPE_QUESTION, (type) => (
              <Option value={type.key}>{type.value}</Option>
            ))}
          </Select>
          <Col>
            {answerType !== TYPE_QUESTION.TEXT_ANSWER.key && (
              <Tooltip title="Add the answer">
                <Button
                  onClick={() => onAddAnswer()}
                  style={{ marginTop: '12px' }}
                  shape="circle"
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            )}
          </Col>
        </Col>
      </Row>
    </>
  );
}
