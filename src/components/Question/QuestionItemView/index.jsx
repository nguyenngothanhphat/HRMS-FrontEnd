import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Input, Radio, Row, Select, Space, Tooltip } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { Option } from 'antd/lib/mentions';
import React from 'react';
import TYPE_QUESTION from '../utils';
import styles from './index.less';

export default function QuestionItemView({
  openModalRemove,
  questionItem,
  keyQuestion,
  openModalEdit,
  control = true,
}) {
  const { answerType = '', question = '', defaultAnswers = [] } = questionItem;

  const _renderAnswer = () => {
    switch (answerType) {
      case TYPE_QUESTION.SINGLE_CHOICE.key:
        return (
          <Radio.Group>
            <Space direction="vertical">
              {defaultAnswers.map((answer) => (
                <Radio value={answer}>{answer}</Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case TYPE_QUESTION.MULTIPLE_CHOICE.key:
        return defaultAnswers.map((answer) => (
          <div style={{ marginBottom: '5px' }}>
            <Checkbox value={answer}>{answer}</Checkbox>
          </div>
        ));
      case TYPE_QUESTION.TEXT_ANSWER.key:
        return <Input placeholder={TYPE_QUESTION.TEXT_ANSWER.value} />;
      case TYPE_QUESTION.SELECT_OPTION.key:
        return (
          <Select
            defaultValue={defaultAnswers.length > 0 ? defaultAnswers[0] : ''}
            style={{ width: '100%' }}
          >
            {defaultAnswers.map((answer) => (
              <Option value={answer}>{answer}</Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Row className={styles.questionItem}>
      <Col span={18}>
        <div className={styles.questionItem__question}>
          {keyQuestion + 1}. {question}
        </div>
        <Col className={styles.questionItem__answer}>{_renderAnswer()}</Col>
      </Col>
      {control && (
        <div className={styles.questionItem__manage}>
          <Tooltip title="Edit question">
            <Button
              onClick={() => openModalEdit(questionItem, keyQuestion)}
              className={styles.questionItem__manage__edit}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Remove question">
            <Button
              className={styles.questionItem__manage__remove}
              type="danger"
              danger
              shape="circle"
              onClick={() => openModalRemove(questionItem, keyQuestion)}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </div>
      )}
    </Row>
  );
}
