import AddIcon from '@/assets/add-symbols.svg';
import CustomModal from '@/components/CustomModal';
import ModalQuestionItem from '@/components/Question/ModalQuestionItem';
import QuestionItemView from '@/components/Question/QuestionItemView';
import { TYPE_QUESTION } from '@/components/Question/utils';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Button, Col, notification, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const defaultQuestion = {
  answerType: TYPE_QUESTION.TEXT_ANSWER.key,
  question: 'Type your question',
  defaultAnswers: [],
  isRequired: false,
  rating: {},
  multiChoice: {},
};

@connect(({ employeeSetting: { optionalOnboardQuestionList = [] } }) => ({
  optionalOnboardQuestionList,
}))
class OptionalOnboardingQuestions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      currentModal: null,
      questionItem: {},
      action: 'Edit',
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // fetch list optional onboarding question
    dispatch({
      type: 'employeeSetting/fetchListOptionalOnboardQuestions',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { questionItem, action } = this.state;
    if (prevState.questionItem !== questionItem)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentModal: (
          <ModalQuestionItem
            closeModal={this.closeModal}
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
    });
  };

  /**
   * open modal edit question
   */
  openModalEdit = (question) => {
    this.setState({
      openModal: true,
      questionItem: question,
      action: 'Edit',
    });
  };

  /**
   * Open modal remove
   * @param {*} question
   */
  openModalRemove = (question) => {
    this.setState({
      openModal: true,
      currentModal: (
        <Row className={styles.modalRemoveQuestion}>
          <Col span={18} offset={3}>
            <h2>Are you sure you want to remove this question?</h2>
            <div className={styles.modalRemoveQuestion__control}>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button
                onClick={() => this.onRemoveQuestion(question)}
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
  onRemoveQuestion = (questionItem) => {
    const { dispatch } = this.props;
    // remove question item
    dispatch({
      type: 'employeeSetting/removeOptionalOnboardQuestions',
      payload: questionItem,
    }).then(() => {
      this.closeModal();
    });
  };

  // ================ handle event add question or edit question
  onSaveQuestion = () => {
    const { questionItem } = this.state;
    const { dispatch } = this.props;
    // remove empty answer
    const question = {
      ...questionItem,
      defaultAnswers: questionItem.defaultAnswers.filter((i) => i),
    };

    // check the number of answers
    if (
      (question.answerType === TYPE_QUESTION.SINGLE_CHOICE.key ||
        question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) &&
      question.defaultAnswers.length < 1
    ) {
      return notification.error({
        message: `This type of question must have at least one answer!`,
      });
    }

    let action = 'employeeSetting/addOptionalOnboardQuestions';
    // if edit question
    if (question._id) {
      action = 'employeeSetting/updateOptionalOnboardQuestions';
    }

    return dispatch({
      type: action,
      payload: questionItem,
    }).then(() => {
      this.closeModal();
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
    const { openModal, currentModal } = this.state;
    const { optionalOnboardQuestionList } = this.props;
    return (
      <div className={styles.OptionalOnboardingQuestions}>
        <CustomModal
          width={646}
          open={openModal}
          closeModal={this.closeModal}
          content={currentModal}
        />
        <div className={styles.OptionalOnboardingQuestions__box}>
          <div className={styles.OptionalOnboardingQuestions_title}>
            {formatMessage({ id: 'component.optionalOnboardingQuestions.title' })}
          </div>
          <div className={styles.OptionalOnboardingQuestions_subTitle}>
            {formatMessage({ id: 'component.optionalOnboardingQuestions.subTitle' })}
          </div>
        </div>
        <Row
          align="space-between"
          style={{ marginTop: '24px' }}
          className={
            optionalOnboardQuestionList.length < 1 && styles.OptionalOnboardingQuestions__buttonAdd
          }
        >
          <Col>
            <Button
              type="link"
              style={{ display: 'flex', alignItems: 'center', paddingLeft: '0px' }}
              onClick={this.openModalAdd}
            >
              <img src={AddIcon} alt="Add icon" style={{ width: '18px', marginRight: '15px' }} />
              {formatMessage({ id: 'component.optionalOnboardingQuestions.addQuestion' })}
            </Button>
          </Col>
        </Row>
        {optionalOnboardQuestionList.map((question, keyQuestion) => (
          <QuestionItemView
            openModalEdit={this.openModalEdit}
            keyQuestion={keyQuestion}
            questionItem={question}
            openModalRemove={this.openModalRemove}
          />
        ))}
      </div>
    );
  }
}

export default OptionalOnboardingQuestions;
