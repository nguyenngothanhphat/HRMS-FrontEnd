import { Button, Col, Row, notification, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/add-symbols.svg';
import { MODE, TYPE_QUESTION } from '@/components/Question/utils';
import ModalAddQuestion from '@/components/ModalAddQuestion';
import ModalListQuestion from '@/components/ModalListQuestion';
import EditIcon from '@/assets/editBtnBlue.svg';
import RemoveIcon from '@/assets/remove.svg';
import { PROCESS_STATUS } from '@/utils/onboarding';
import { Page } from '../../../pages/FormTeamMember/utils';

const defaultQuestion = {
  index: null,
  answerType: TYPE_QUESTION.TEXT_ANSWER.key,
  question: 'Type your question',
  defaultAnswers: [],
  isRequired: false,
  rating: {},
  multiChoice: {},
};
const RenderAddQuestion = (props) => {
  const {
    candidate,
    data: { _id, settings = [] },
    dispatch,
    processStatus,
    page,
  } = props;
  const [openModal, setOpenModal] = useState('');
  const [questionItem, setQuestionItem] = useState({});
  const [tempSetting, setTempSetting] = useState([]);
  const [action, setAction] = useState('');
  const [title, setTitle] = useState('');
  const [firstOpen, setFirstOpen] = useState(true);
  const [mode, setMode] = useState(MODE.EDIT);
  const [isDisable, setIsDisable] = useState(false);

  const checkEdit = (value) => {
    if (
      value === Page.Basic_Information ||
      value === Page.Job_Details ||
      value === Page.Salary_Structure ||
      value === Page.Eligibility_documents
    )
      setIsDisable(
        processStatus !== 'DRAFT' && processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT,
      );
    else
      setIsDisable(
        !(
          processStatus === PROCESS_STATUS.ACCEPTED_PROVISIONAL_OFFERS ||
          processStatus === PROCESS_STATUS.FINAL_OFFERS_DRAFT
        ),
      );
  };

  useEffect(() => {
    if (candidate) {
      dispatch({
        type: 'optionalQuestion/getQuestionByPage',
        payload: {
          candidate,
          page,
        },
      });
      checkEdit(page);
    }
  }, [candidate]);
  const openModalAdd = () => {
    setOpenModal('AddQuestion');
    setMode(MODE.EDIT);
    setQuestionItem(defaultQuestion);
    setTitle('Add question');
  };
  const closeModalAdd = () => {
    if (firstOpen) setOpenModal('');
    else setOpenModal('ListQuestion');
    setAction('');
  };

  const closeModalList = () => {
    setOpenModal('');
    setTempSetting([]);
    setAction('');
  };

  const openModalEdit = (Item) => {
    setOpenModal('AddQuestion');
    setQuestionItem(Item);
    setAction('Save');
    setTitle('Edit question');
  };
  const openModalEditList = (valueMode) => {
    setOpenModal('ListQuestion');
    setMode(valueMode);
    setFirstOpen(false);
    setTempSetting(settings);
    setAction('Save');
  };
  const openModalRemove = (_questionItem, keyQuestion) => {
    const temp = tempSetting;
    setTempSetting([...temp.slice(0, keyQuestion), ...temp.slice(keyQuestion + 1)]);
  };

  const onSave = () => {
    const tempSettings = tempSetting;
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
      questionItem.index = tempSettings.length;
      tempSettings.push(questionItem);
    } else {
      tempSettings[questionItem.index] = questionItem;
    }
    setTempSetting(tempSettings);
    setOpenModal('ListQuestion');
    // setAction('Add');
    setFirstOpen(false);
  };

  const onSaveList = () => {
    if (action === 'Add')
      dispatch({
        type: 'optionalQuestion/addQuestion',
        payload: {
          isDefault: false,
          position: {
            move_to: 'IN-PAGE',
            page,
          },
          candidate,
          settings: tempSetting,
        },
      });
    if (action === 'Save')
      dispatch({
        type: 'optionalQuestion/updateQuestionByHR',
        payload: {
          questionOnboarding: _id,
          settings: tempSetting,
        },
      });
    setOpenModal('');
    setTempSetting([]);
  };

  const removeQuestionList = () => {
    dispatch({
      type: 'optionalQuestion/removeQuestion',
      payload: {
        candidate,
        id: _id,
      },
    });
  };
  const onChangeQuestionItem = (item) => {
    setQuestionItem({ ...questionItem, ...item });
  };
  return (
    <>
      <Row>
        {settings && settings.length > 0 ? (
          <Col>
            <Button type="link" onClick={() => openModalEditList(MODE.VIEW)}>
              Optional Question Onboarding
            </Button>
            {!isDisable && (
              <Space>
                <Button type="link" onClick={() => openModalEditList(MODE.EDIT)}>
                  <img
                    src={EditIcon}
                    alt="Edit icon"
                    style={{ width: '16px', marginRight: '8px' }}
                  />
                  <span style={{ paddingRight: '16px', borderRight: '1px solid #B5B8BD' }}>
                    {' '}
                    Edit{' '}
                  </span>
                </Button>
                <Button
                  type="link"
                  style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px' }}
                  onClick={removeQuestionList}
                >
                  <img
                    src={RemoveIcon}
                    alt="Remove icon"
                    style={{ width: '16px', marginRight: '8px' }}
                  />
                  <span style={{ color: '#FF6565' }}> Delete </span>
                </Button>
              </Space>
            )}
          </Col>
        ) : (
          !isDisable && (
            <Col>
              <Button
                type="link"
                // style={{ display: 'flex', alignItems: 'center', paddingLeft: '0px' }}
                onClick={() => {
                  openModalAdd();
                  setAction('Add');
                }}
              >
                <img src={AddIcon} alt="Add icon" style={{ width: '18px', marginRight: '15px' }} />
                Add optional onboarding questions
              </Button>
            </Col>
          )
        )}
        <ModalAddQuestion
          openModal={openModal === 'AddQuestion'}
          title={title}
          onSave={onSave}
          onCancel={closeModalAdd}
          onChangeQuestionItem={onChangeQuestionItem}
          questionItem={questionItem}
          action={action}
        />
        <ModalListQuestion
          openModalList={openModal === 'ListQuestion'}
          title={title}
          action="Save"
          onSave={onSaveList}
          onCancel={closeModalList}
          openModalEdit={openModalEdit}
          openModalRemove={openModalRemove}
          openModalAdd={openModalAdd}
          settings={tempSetting}
          mode={mode}
        />
      </Row>
    </>
  );
};
export default connect(
  ({
    dispatch,
    loading,
    optionalQuestion: { listPage, candidate = '', optionalQuestionId = '', data = {} } = {},
    newCandidateForm: {
      data: { processStatus },
    },
  }) => ({
    dispatch,
    listPage,
    candidate,
    optionalQuestionId,
    data,
    processStatus,
    loading: loading.effects['optionalQuestion/getQuestionByPage'],
  }),
)(RenderAddQuestion);
