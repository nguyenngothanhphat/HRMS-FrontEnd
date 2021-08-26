import AddIcon from '@/assets/add-symbols.svg';
import { TYPE_QUESTION } from '@/components/Question/utils';
import { Button, Col, notification, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import ModalAddQuestion from '@/components/ModalAddQuestion/index';
import ModalListQuestion from '@/components/ModalListQuestion/index';
import ModalAddNewPage from '@/components/ModalAddNewPage/index';
import styles from './index.less';

const defaultQuestion = {
  index: null,
  answerType: TYPE_QUESTION.TEXT_ANSWER.key,
  question: 'Type your question',
  defaultAnswers: [],
  isRequired: false,
  rating: {},
  multiChoice: {},
};
const defaultPage = {
  index: null,
  name: '',
  moveTo: 'BEFORE',
  page: '',
};
@connect(({ employeeSetting: { listPageOnboarding = [] } }) => ({
  listPageOnboarding,
}))
class OptionalOnboardingQuestions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: '',
      questionItem: {},
      newPage: {},
      action: 'Add',
      settings: [],
      title: '',
      firstOpen: true,
    };
  }

  // componentDidMount = () => {
  //   const { dispatch } = this.props;
  //   // fetch list optional onboarding question
  //   dispatch({
  //     type: 'employeeSetting/fetchListPageOnboard',
  //   });
  // };

  // componentDidUpdate = (prevProps, prevState) => {};

  openModalAdd = () => {
    this.setState({
      openModal: 'AddQuestion',
      // openModalList: false,
      questionItem: defaultQuestion,
      action: 'Add',
      title: 'Add question',
    });
  };

  closeModalAdd = () => {
    const { firstOpen } = this.state;
    if (firstOpen) this.setState({ openModal: '' });
    else this.setState({ openModal: 'ListQuestion' });
  };

  closeModalList = () => {
    this.setState({ openModal: '', settings: [] });
  };

  openModalEdit = () => {
    this.setState({
      openModal: 'AddQuestion',
      // openModalList: false,
      title: 'Edit question',
      action: 'Save',
    });
  };

  openModalRemove = (_questionItem, keyQuestion) => {
    const { settings } = this.state;

    this.setState({
      settings: [...settings.slice(0, keyQuestion), ...settings.slice(keyQuestion + 1)],
      // questionItem: {},
    });
  };

  onSave = () => {
    const { questionItem, settings } = this.state;
    // remove empty answer
    const question = {
      ...questionItem,
      defaultAnswers: questionItem.defaultAnswers.filter((i) => i),
    };

    // check the number of answers
    if (
      (question.answerType === TYPE_QUESTION.SINGLE_CHOICE.key ||
        question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key ||
        question.answerType === TYPE_QUESTION.SELECT_OPTION.key) &&
      question.defaultAnswers.length < 1
    ) {
      notification.error({
        message: `This type of question must have at least one answer!`,
      });
    }
    if (questionItem.index === null) {
      questionItem.index = settings.length;
      settings.push(questionItem);
    } else {
      settings[questionItem.index] = questionItem;
    }

    this.setState({ settings, openModal: 'ListQuestion', firstOpen: false });
  };

  onSaveList = () => {
    const { dispatch } = this.props;
    // fetch list optional onboarding question
    dispatch({
      type: 'employeeSetting/fetchListPageOnboard',
    });
    this.setState({ openModal: 'AddNewPage', newPage: defaultPage });
  };

  onSaveAddPage = async () => {
    const { dispatch } = this.props;
    const { newPage, settings } = this.state;
    if (newPage.name === '')
      notification.error({
        message: `Name cannot be empty!`,
        duration: 3,
      });
    const result = await dispatch({
      type: 'employeeSetting/addOptionalOnboardQuestions',
      payload: {
        name: newPage.name,
        isDefault: true,
        position: {
          move_to: newPage.moveTo,
          page: newPage.page,
        },
        settings,
      },
    });
    if (result.statusCode === 200) this.setState({ openModal: '', newPage: {}, settings: [] });
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

  onChangeNewPage = (data) => {
    const { newPage } = this.state;
    this.setState({ newPage: { ...newPage, ...data } });
  };

  render() {
    const { openModal, questionItem, action, title, settings, newPage } = this.state;
    const { listPageOnboarding } = this.props;
    return (
      <div className={styles.OptionalOnboardingQuestions}>
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
          className={styles.OptionalOnboardingQuestions__buttonAdd}
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
        <ModalAddQuestion
          openModal={openModal === 'AddQuestion'}
          title={title}
          onSave={this.onSave}
          onCancel={this.closeModalAdd}
          onChangeQuestionItem={this.onChangeQuestionItem}
          questionItem={questionItem}
          action={action}
        />
        <ModalListQuestion
          openModalList={openModal === 'ListQuestion'}
          title={title}
          onSave={this.onSaveList}
          onCancel={this.closeModalList}
          openModalEdit={this.openModalEdit}
          openModalRemove={this.openModalRemove}
          openModalAdd={this.openModalAdd}
          settings={settings}
          // action={action}
        />
        <ModalAddNewPage
          openModal={openModal === 'AddNewPage'}
          onSave={this.onSaveAddPage}
          onCancel={this.closeModalAdd}
          onChangeNewPage={this.onChangeNewPage}
          newPage={newPage}
          listPage={listPageOnboarding}
        />
      </div>
    );
  }
}
export default OptionalOnboardingQuestions;
