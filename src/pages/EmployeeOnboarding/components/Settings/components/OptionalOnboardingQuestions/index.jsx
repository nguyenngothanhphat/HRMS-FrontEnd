import CustomModal from '@/components/CustomModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Button, Col, notification, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import ModalQuestionItem from './components/ModalQuestionItem';
import QuestionItemView from './components/QuestionItemView';
import TYPE_QUESTION from './components/utils';
import styles from './index.less';

const defaultQuestion = {
  answerType: TYPE_QUESTION.SINGLE_CHOICE.key,
  question: 'Untitled Question',
  defaultAnswers: ['Answer 1'],
};

@connect(
  ({
    onboardingSettings: {
      templateOnboardQuestionDefault: { id, settings: optionalOnboardQuestions = [] },
    },
  }) => ({
    optionalOnboardQuestions,
    id,
  }),
)
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
    dispatch({
      type: 'employeeSetting/fetchOptionalQuestions',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });

    dispatch({
      type: 'onboardingSettings/fetchListOptionalOnboardQuestions',
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

  openModalRemove = (question) => {
    this.setState({
      openModal: true,
      action: 'Edit',
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
    const { dispatch, id, optionalOnboardQuestions } = this.props;
    // remove question item
    const settings = optionalOnboardQuestions.filter((item) => item._id !== questionItem._id);
    dispatch({
      type: 'onboardingSettings/updateOptionalOnboardQuestions',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        id,
        settings,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: `Remove the question successfully!`,
          duration: 3,
        });

        this.setState({
          openModal: false,
          questionItem: {},
        });
      }
    });
  };

  // ================ handle event add question or edit question
  onSaveQuestion = () => {
    const { questionItem } = this.state;
    const { dispatch, id, optionalOnboardQuestions } = this.props;
    let settings = [...optionalOnboardQuestions];

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
    if (question._id) {
      const indexOfEditQuestion = settings.findIndex((item) => item._id === question._id);
      if (indexOfEditQuestion > -1) {
        settings[indexOfEditQuestion] = question; // update question
      }
    } else {
      // add question
      settings = [...optionalOnboardQuestions, question];
    }

    // update question list and reset modal
    return dispatch({
      type: 'onboardingSettings/updateOptionalOnboardQuestions',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        id,
        settings,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: `Save the question successfully!`,
          duration: 3,
        });

        this.setState({
          openModal: false,
          questionItem: {},
        });
      }
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
    const { optionalOnboardQuestions } = this.props;
    return (
      <div className={styles.OptionalOnboardingQuestions}>
        <CustomModal
          width={750}
          open={openModal}
          closeModal={this.closeModal}
          content={currentModal}
        />
        <div className={styles.OptionalOnboardingQuestions_title}>
          {formatMessage({ id: 'component.optionalOnboardingQuestions.title' })}
        </div>
        <div className={styles.OptionalOnboardingQuestions_subTitle}>
          {formatMessage({ id: 'component.optionalOnboardingQuestions.subTitle' })}
        </div>
        <Row align="space-between" className={styles.OptionalOnboardingQuestions__buttonAdd}>
          <Col>
            <Button type="link" onClick={this.openModalAdd}>
              {formatMessage({ id: 'component.optionalOnboardingQuestions.addQuestion' })}
            </Button>
          </Col>
        </Row>
        {optionalOnboardQuestions.map((question, keyQuestion) => (
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
