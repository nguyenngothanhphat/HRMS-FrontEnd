/* eslint-disable no-param-reassign */
import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { every } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomModal from '@/components/CustomModal';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { SPECIFY, TYPE_QUESTION } from '@/components/Question/utils';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { Page } from '../../../../../NewCandidateForm/utils';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import CollapseFields from './components/CollapseFields';
import ModalContentComponent from './components/ModalContentComponent';
import PreviousEmployment from './components/PreviousEmployment';
import Title from './components/Title';
import styles from './index.less';
import { mapType } from '@/utils/newCandidateForm';
import TechnicalCertification from './components/TechnicalCertification';

const Note = {
  title: 'Note',
  data: (
    <Typography.Text>
      All the documents that are marked as mandatory need to be uploaded and one or more of the
      documents that are optional can be uploaded.
    </Typography.Text>
  ),
};

const EligibilityDocs = (props) => {
  const {
    loading,
    data = {},
    data: {
      attachments,
      documentListToRender,
      validateFileSize,
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

  const processData = async () => {};

  useEffect(() => {
    processData();
    if (![NEW_PROCESS_STATUS.PROFILE_VERIFICATION].includes(processStatus)) {
      setIsSentEmail(true);
    }
  }, []);

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
        // workHistories: workHistory,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
        setIsSentEmail(true);
      }
    });
  };

  const onValuesChange = (val, type) => {
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [type]: val,
      },
    });
  };

  const closeModal = () => {
    history.push('/candidate-portal/dashboard');
  };

  const checkLength = (url) => {
    if (url.length > 20) {
      const ext = url.split('.').pop();
      let fileName = url.split('.')[0];
      if (fileName.length > 15) {
        fileName = `${fileName.substring(0, 10)}...`;
        url = `${fileName}${ext}`;
      }
    }
    return url;
  };

  const checkFull = () => {
    return true;
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
    if (_id !== '' && settings && settings.length) {
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
    const check = checkFull();
    const isVerifiedProfile = isVerifiedBasicInfo && isVerifiedJobDetail;
    const submitButton = (
      <Button
        type="primary"
        htmlType="submit"
        onClick={handleSendEmail}
        className={`${styles.bottomBar__button__primary} ${
          !check ? styles.bottomBar__button__disabled : ''
        }`}
        disabled={!check || !isVerifiedProfile}
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
                return <CollapseFields layout={x} items={data[mapType[x.type]]} />;
              })}

            {/* TYPE D */}
            <TechnicalCertification
              items={data[mapType.D]}
              layout={documentLayout.find((x) => x.type === 'D')}
            />

            {/* TYPE E */}
            <PreviousEmployment
              items={data[mapType.E]}
              layout={documentLayout.find((x) => x.type === 'E')}
            />
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
      currentStep,
      tempData,
    } = {},
    loading,
    user: { currentUser: { candidate = {} } = {} },
  }) => ({
    _id,
    settings,
    data,
    localStep,
    currentStep,
    tempData,
    checkMandatory,
    candidate,
    isVerifiedBasicInfo,
    isVerifiedJobDetail,
    loading: loading.effects['upload/uploadFile'],
    loading1: loading.effects['candidatePortal/sendEmailByCandidate'],
    loading2: loading.effects['candidatePortal/fetchCandidateById'],
    loadingFile:
      loading.effects['candidatePortal/fetchDocumentByCandidate'] ||
      loading.effects['candidatePortal/fetchWorkHistory'],
  }),
)(EligibilityDocs);
