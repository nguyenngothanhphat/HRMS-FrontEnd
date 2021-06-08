import CustomModal from '@/components/CustomModal';
import ModalQuestionItem from '@/components/Question/ModalQuestionItem';
import QuestionItemView from '@/components/Question/QuestionItemView';
import TYPE_QUESTION from '@/components/Question/utils';
import { Button, Col, notification, Row } from 'antd';
import React, { Component } from 'react';
// import EmailReminderHeader from './components/EmailReminderHeader';
import { formatMessage } from 'umi';
import styles from './index.less';

const defaultQuestion = {
  answerType: TYPE_QUESTION.SINGLE_CHOICE.key,
  question: 'Untitled Question',
  defaultAnswers: ['Answer 1'],
};

class HandleQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      currentModal: null,
      questionItem: {},
      action: 'Edit',
      keyQuestion: null,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { questionItem, action } = this.state;
    if (prevState.questionItem !== questionItem)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentModal: (
          <ModalQuestionItem
            onChangeQuestionItem={this.onChangeQuestionItem}
            questionItem={questionItem}
            action={action}
            onSaveClick={this.onSaveQuestion}
          />
        ),
      });
  };

  /**
   * close modal
   */
  closeModal = () => {
    this.setState({
      openModal: false,
      questionItem: {},
    });
  };

  /**
   * open modal add question
   */
  openModalAdd = () => {
    this.setState({
      openModal: true,
      questionItem: defaultQuestion,
      action: 'Add',
      keyQuestion: null,
    });
  };

  /**
   * open modal edit question
   */
  openModalEdit = (question, keyQuestion) => {
    this.setState({
      openModal: true,
      questionItem: question,
      action: 'Edit',
      keyQuestion,
    });
  };

  openModalRemove = (_, keyQuestion) => {
    this.setState({
      openModal: true,
      action: 'Edit',
      keyQuestion,
      currentModal: (
        <Row className={styles.modalRemoveQuestion}>
          <Col span={18} offset={3}>
            <h2>Are you sure you want to remove this question?</h2>
            <div className={styles.modalRemoveQuestion__control}>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button
                onClick={() => this.onRemoveQuestion()}
                style={{ marginLeft: '15px' }}
                type="danger"
              >
                Remove
              </Button>
            </div>
          </Col>
        </Row>
      ),
    });
  };

  // ================ handle event remove question
  onRemoveQuestion = () => {
    const { questionList, changeQuestionList } = this.props;
    const { keyQuestion } = this.state;
    // remove question item
    const settings = [
      ...questionList.slice(0, keyQuestion),
      ...questionList.slice(keyQuestion + 1),
    ];
    return changeQuestionList(settings).then(() => {
      notification.success({
        message: `Remove the question successfully!`,
        duration: 3,
      });

      this.setState({
        openModal: false,
        questionItem: {},
      });
    });
  };

  // ================ handle event add question or edit question
  onSaveQuestion = () => {
    const { questionItem, keyQuestion } = this.state;
    const { questionList, changeQuestionList } = this.props;
    let settings = [...questionList];
    // remove empty answer
    const question = {
      ...questionItem,
      defaultAnswers: questionItem.defaultAnswers.filter((i) => i),
    };

    if (
      question.answerType !== TYPE_QUESTION.TEXT_ANSWER.key &&
      question.defaultAnswers.length < 1
    ) {
      return notification.error({
        message: `This type of question must have at least one answer!`,
      });
    }

    // if edit question
    if (keyQuestion !== null) {
      settings[keyQuestion] = question; // update question
    } else {
      // add question
      settings = [question, ...questionList];
    }

    // update question list and reset modal
    return changeQuestionList(settings).then(() => {
      notification.success({
        message: `Save the question successfully!`,
        duration: 3,
      });

      this.setState({
        openModal: false,
        questionItem: {},
      });
    });
  };

  onChangeQuestionItem = (data) => {
    const { questionItem } = this.state;
    this.setState({
      questionItem: {
        ...questionItem,
        ...data,
      },
    });
  };

  render() {
    const { questionList = [] } = this.props;
    const { openModal, currentModal } = this.state;

    return (
      <div className={styles.listQuestion}>
        <Row align="space-between" className={styles.OptionalOnboardingQuestions__buttonAdd}>
          <Col>
            <Button type="link" onClick={this.openModalAdd}>
              {formatMessage({ id: 'component.optionalOnboardingQuestions.addQuestion' })}
            </Button>
          </Col>
        </Row>
        {questionList.map((question, keyQuestion) => (
          <QuestionItemView
            openModalEdit={this.openModalEdit}
            keyQuestion={keyQuestion}
            questionItem={question}
            openModalRemove={this.openModalRemove}
          />
        ))}
        <CustomModal
          width={750}
          open={openModal}
          closeModal={this.closeModal}
          content={currentModal}
        />
      </div>
    );
  }
}

export default HandleQuestion;
