import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { every } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomModal from '@/components/CustomModal';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { SPECIFY, TYPE_QUESTION } from '@/components/Question/utils';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentTenant } from '@/utils/authority';
import { DOCUMENT_TYPES } from '@/constants/candidatePortal';
import { MAP_TYPE } from '@/constants/newCandidateForm';
import { NEW_PROCESS_STATUS } from '@/constants/onboarding';
import { Page } from '../../../../../NewCandidateForm/utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import CollapseFields from './components/CollapseFields';
import CommentModalContent from './components/CommentModalContent';
import ModalContentComponent from './components/ModalContentComponent';
import PreviousEmployment from './components/PreviousEmployment';
import TechnicalCertification from './components/TechnicalCertification';
import Title from './components/Title';
import ViewCommentModalContent from './components/ViewCommentModalContent';
import styles from './index.less';

const { NOT_AVAILABLE_PENDING_HR, VERIFYING, VERIFIED, NOT_AVAILABLE_ACCEPTED } = DOCUMENT_TYPES;

const Note = {
  title: 'Note',
  data: (
    <Typography.Text>
      All the documents on the left need to be uploaded. If you don`t have any of these documents,
      please select the Not Available button and provide a reason.
    </Typography.Text>
  ),
};

const EligibilityDocs = (props) => {
  const {
    data = {},
    data: {
      // generatedBy,
      processStatus = '',
      dateOfJoining,
      noticePeriod,
      firstName = '',
      middleName = '',
      lastName = '',
      generatedBy = {},
      // new
      documentTypeA = [],
      documentTypeB = [],
      documentTypeC = [],
      documentTypeD = [],
      documentTypeE = [],
      documentLayout = [],
    } = {},
    dispatch,
    _id,
    settings,
    isVerifiedBasicInfo = false,
    isVerifiedJobDetail = false,
    loading1 = false,
  } = props;

  const { generalInfo = {} } = generatedBy || {};
  const { workEmail: email = '' } = generalInfo || {};

  const [openModal, setOpenModal] = useState(false);
  const [isSentEmail, setIsSentEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [selectingFile, setSelectingFile] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [viewCommentModalVisible, setViewCommentModalVisible] = useState(false);
  const [viewDocumentModalVisible, setViewDocumentModalVisible] = useState(false);

  const [validated, setValidated] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (![NEW_PROCESS_STATUS.PROFILE_VERIFICATION].includes(processStatus)) {
      setIsSentEmail(true);
    }
  }, []);

  const validateFiles = () => {
    // for type A, B, C, D
    const checkDocumentUploaded = (arr = []) => {
      if (arr.length === 0) return true;
      return arr
        .filter((x) => (x.required || x.value) && x.status !== NOT_AVAILABLE_PENDING_HR)
        .every((x) => [VERIFIED, VERIFYING, NOT_AVAILABLE_ACCEPTED].includes(x.status));
    };
    // for type E
    const checkDocumentUploadedTypeE = (arr = []) => {
      if (arr.length === 0) return true;
      let check = false;
      arr.forEach((x) => {
        const { data: dataArr = [] } = x;
        check = checkDocumentUploaded(dataArr);
      });
      return check;
    };
    // for type D
    const checkInputTypeDFilled = (arr = []) => {
      if (arr.length === 0) return true;
      return !arr.some((x) => !x.issuedDate || !x.name || (!x.neverExpired && !x.expiryDate));
    };
    // for type E
    const checkInputTypeEFilled = (arr) => {
      if (arr.length === 0) return true;
      return !arr.some((x) => !x.employer || !x.startDate || (!x.currentlyWorking && !x.endDate));
    };

    return (
      checkDocumentUploaded(documentTypeA) &&
      checkDocumentUploaded(documentTypeB) &&
      checkDocumentUploaded(documentTypeC) &&
      checkDocumentUploaded(documentTypeD) &&
      checkDocumentUploadedTypeE(documentTypeE) &&
      checkInputTypeDFilled(documentTypeD) &&
      checkInputTypeEFilled(documentTypeE)
    );
  };

  useLayoutEffect(() => {
    if (!isFirstLoad) {
      dispatch({
        type: 'candidatePortal/updateByCandidateEffect',
        payload: {
          documentTypeA,
          documentTypeB,
          documentTypeC,
          documentTypeD,
          documentTypeE,
        },
      });
    }
    setValidated(validateFiles());
    setIsFirstLoad(false);
  }, [
    JSON.stringify(documentTypeA),
    JSON.stringify(documentTypeB),
    JSON.stringify(documentTypeC),
    JSON.stringify(documentTypeD),
    JSON.stringify(documentTypeE),
  ]);

  const initSendMail = () => {
    setIsSending(true);
    dispatch({
      type: 'candidatePortal/sendEmailByCandidate',
      payload: {
        dateOfJoining,
        options: 1,
        firstName,
        middleName,
        lastName,
        noticePeriod,
        hrEmail: email,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
        setIsSentEmail(true);
      }
    });
  };

  const closeModal = () => {
    history.push('/candidate-portal/dashboard');
  };

  const checkAllFieldsValidate = () => {
    const valid = settings?.map((question) => {
      const employeeAnswers = question.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = question?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (question.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = question?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };

  const handleSendEmail = () => {
    const messageErr = checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (_id && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: _id,
          settings,
        },
      });
    }

    initSendMail();
  };

  const _renderBottomBar = () => {
    const isVerifiedProfile = isVerifiedBasicInfo && isVerifiedJobDetail;
    const submitButton = (
      <Button
        type="primary"
        htmlType="submit"
        onClick={handleSendEmail}
        className={[
          styles.bottomBar__button__primary,
          !validated ? styles.bottomBar__button__disabled : '',
        ]}
        disabled={!validated || !isVerifiedProfile}
        loading={loading1 || isSending}
      >
        {isSentEmail ? 'Submit Again' : 'Submit'}
      </Button>
    );
    return (
      <div className={styles.bottomBar}>
        <AnswerQuestion page={Page.Eligibility_documents} />

        <Row align="middle">
          <Col span={8}>
            {/* <div className={styles.bottomBar__status}>{_renderStatus()}</div> */}
          </Col>
          <Col span={16}>
            <div className={styles.bottomBar__button}>
              {isVerifiedProfile ? (
                submitButton
              ) : (
                <Tooltip title="You must finish the Review Profile task first!">
                  {submitButton}
                </Tooltip>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const onViewDocumentClick = (itemProp) => {
    setSelectingFile({
      item: itemProp,
    });
    setViewDocumentModalVisible(true);
  };
  const onViewCommentClick = (itemProp) => {
    setSelectingFile({
      item: itemProp,
    });
    setViewCommentModalVisible(true);
  };

  const onNotAvailableClick = (typeProp, itemProp, indexProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
      index: indexProp,
    });
    setCommentModalVisible(true);
  };

  const onCloseCommentModal = () => {
    setCommentModalVisible(false);
    setSelectingFile(null);
  };

  const onSaveRedux = (result, type) => {
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [MAP_TYPE[type]]: result,
      },
    });
  };

  const onComment = (values) => {
    let items = [...data[MAP_TYPE[selectingFile?.type]]];
    const { notAvailableComment = '' } = values;
    const assignCommentToData = (arr) => {
      return arr.map((x) => {
        if (x.key === selectingFile?.item?.key) {
          return {
            ...x,
            notAvailableComment,
            status: NOT_AVAILABLE_PENDING_HR,
          };
        }
        return x;
      });
    };

    if (selectingFile?.type !== 'E') {
      items = assignCommentToData(items);
    } else {
      items = items.map((x, i) => {
        if (i === selectingFile?.index) {
          return {
            ...x,
            data: assignCommentToData(x.data),
          };
        }
        return x;
      });
    }
    onSaveRedux(items, selectingFile?.type);
    onCloseCommentModal();
  };

  return (
    <div className={styles.EligibilityDocs}>
      <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
        <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
          <div className={styles.eliContainer}>
            <Title />

            {/* TYPE ABC  */}
            {documentLayout
              .filter((x) => ['A', 'B', 'C'].includes(x.type))
              .map((x) => {
                const find = data[MAP_TYPE[x.type]] || [];
                const items = find.filter((y) => y.value || y.required);
                if (items.length === 0) return null;
                return (
                  <CollapseFields
                    layout={x}
                    items={items}
                    onNotAvailableClick={onNotAvailableClick}
                    onViewCommentClick={onViewCommentClick}
                    onViewDocumentClick={onViewDocumentClick}
                  />
                );
              })}

            {/* TYPE D */}
            <TechnicalCertification
              items={data[MAP_TYPE.D] || []}
              layout={documentLayout.find((x) => x.type === 'D')}
              onNotAvailableClick={onNotAvailableClick}
              onViewCommentClick={onViewCommentClick}
              onViewDocumentClick={onViewDocumentClick}
            />

            {/* TYPE E */}
            {data[MAP_TYPE.E]
              ? data[MAP_TYPE.E].length > 0 && (
              <PreviousEmployment
                items={data[MAP_TYPE.E]}
                layout={documentLayout.find((x) => x.type === 'E')}
                onNotAvailableClick={onNotAvailableClick}
                onViewCommentClick={onViewCommentClick}
                onViewDocumentClick={onViewDocumentClick}
              />
                )
              : null}
          </div>
          {_renderBottomBar()}
        </Col>
        <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
          <NoteComponent note={Note} />
          <MessageBox />
        </Col>
      </Row>

      <CustomModal
        open={openModal}
        closeModal={closeModal}
        content={<ModalContentComponent closeModal={closeModal} />}
      />
      <CommonModal
        visible={commentModalVisible}
        title={`${selectingFile?.item?.alias} comment`}
        width={500}
        onClose={onCloseCommentModal}
        content={<CommentModalContent onClose={onCloseCommentModal} onFinish={onComment} />}
      />
      <CommonModal
        visible={viewCommentModalVisible}
        title="View Comment"
        width={500}
        onClose={() => setViewCommentModalVisible(false)}
        hasFooter={false}
        content={
          <ViewCommentModalContent
            onClose={() => setViewCommentModalVisible(false)}
            comment={
              selectingFile?.item?.hrNotAvailableComment ||
              selectingFile?.item?.notAvailableComment ||
              selectingFile?.item?.resubmitComment
            }
          />
        }
      />

      <ViewDocumentModal
        visible={viewDocumentModalVisible}
        url={selectingFile?.item?.document?.attachment?.url}
        onClose={() => setViewDocumentModalVisible(false)}
      />
    </div>
  );
};

export default connect(
  ({
    optionalQuestion: {
      data: { _id, settings },
    },
    candidatePortal: {
      data,
      data: { isVerifiedBasicInfo, isVerifiedJobDetail, checkMandatory = {} } = {},
      localStep,
      tempData,
    } = {},
    loading,
    user: { currentUser: { candidate = {} } = {} },
  }) => ({
    _id,
    settings,
    data,
    localStep,
    tempData,
    checkMandatory,
    candidate,
    isVerifiedBasicInfo,
    isVerifiedJobDetail,
    loading: loading.effects['upload/uploadFile'],
    loading1: loading.effects['candidatePortal/sendEmailByCandidate'],
    loading2: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)(EligibilityDocs);
