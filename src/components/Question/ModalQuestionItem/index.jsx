/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import QuestionItem from '../QuestionItem';
import styles from './index.less';

const ModalQuestionItem = ({
  closeModal = () => {},
  loadingSaveQuestions,
  onSaveClick,
  action,
  ...props
}) => {
  return (
    <div className={styles.modalQuestionItem}>
      <h1 className={styles.modalQuestionItem__header}>{action} question</h1>
      <QuestionItem {...props} />
      <Row className={styles.modalQuestionItem__button}>
        <Col style={{ display: 'flex', justifyContent: 'flex-end' }} span={24}>
          <Button type="link" onClick={() => closeModal()}>
            Cancel
          </Button>

          <Button loading={loadingSaveQuestions} onClick={() => onSaveClick()} type="primary">
            Save
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingSaveQuestions: loading.effects['employeeSetting/updateOptionalOnboardQuestions'],
}))(ModalQuestionItem);
