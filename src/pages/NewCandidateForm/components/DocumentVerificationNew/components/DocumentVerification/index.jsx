/* eslint-disable no-param-reassign */
import { Button, Col, notification, Row, Skeleton, Space } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomModal from '@/components/CustomModal';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
import { Page } from '../../../../utils';
import MessageBox from '../../../MessageBox';
import NoteComponent from '../../../NewNoteComponent';
import CollapseFieldsTypeABC from './components/CollapseFieldsTypeABC';
import CollapseFieldsTypeD from './components/CollapseFieldsTypeD';
import CollapseFieldsTypeE from './components/CollapseFieldsTypeE';
import ModalContentComponent from './components/ModalContentComponent';
import SendEmail from './components/SendEmail';
import Title from './components/Title';
import styles from './styles.less';
import { mapType } from '@/utils/newCandidateForm';

const DocumentVerification = (props) => {
  const {
    newCandidateForm: {
      tempData,
      checkMandatory,
      checkMandatory: { filledDocumentVerification = false } = {},
      tempData: {
        _id,
        processStatus = '',
        ticketID = '',
        isSentEmail = false,
        assignTo: {
          generalInfo: { firstName: hrFN = '', middleName: hrMN = '', lastName: hrLN = '' } = {} ||
            {},
          _id: hrId = '',
        } = {} || {},
        CEOInfo: {
          generalInfoInfo: { legalName: ceoFullname = '' } = {} || {},
          title: { name: titleCEOName = '' } = {} || {},
        } = {} || {},
        titleList = [],
        department,
        workLocation,
        reportingManager,
        title,
        employeeType,
        firstName,
        middleName,
        lastName,
        position,
        privateEmail,
        workEmail,
        previousExperience,
        salaryStructure,
        phoneNumber,
        totalExperience,
        candidate,
        generateLink,
        valueToFinalOffer,
        isMarkAsDone,
        documentTypeA = [],
        documentTypeB = [],
        documentTypeC = [],
        documentTypeD = [],
        documentTypeE = [],
        currentStep = 0,
      } = {} || {},
      documentLayout = [],
    },
    dispatch,
    companiesOfUser = [],
    conversationList = [],
    loading4,
    loadingFetchCandidate,
  } = props;

  const { DRAFT, PROFILE_VERIFICATION } = NEW_PROCESS_STATUS;

  const [openModal, setOpenModal] = useState(false);
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [checkRadioSendMail, setCheckRadioSendMail] = useState(0);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const validateFields = () => {
    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledDocumentVerification: true,
      },
    });
  };

  // SEND FORM VIA EMAIL AGAIN
  const handleSendFormAgain = () => {
    setOpenModalEmail(true);
  };

  const changeValueToFinalOffer = (e) => {
    if (e.target.value === 1) {
      if (processStatus === PROFILE_VERIFICATION) {
        notification.warning({
          message:
            'Waiting for candidate to complete the Profile Verification and upload the documents.',
        });
      } else {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            tempData: {
              ...tempData,
              valueToFinalOffer: 1,
            },
            checkMandatory: {
              ...checkMandatory,
              filledDocumentVerification: true,
            },
          },
        });
      }
    } else {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            valueToFinalOffer: 0,
          },
          checkMandatory: {
            ...checkMandatory,
            filledDocumentVerification: true,
          },
        },
      });
    }
    setCheckRadioSendMail(e.target.value);
  };

  // bottom bar
  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
  };

  const onClickNext = () => {
    if (checkRadioSendMail === 0) {
      setOpenModalEmail(true);
    } else {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          // currentStep: currentStep + 1,
          valueToFinalOffer: 1,
        },
      });
    }
  };

  const _renderBottomBar = () => {
    return (
      <Col span={24}>
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col span={24}>
              <div className={styles.bottomBar__button}>
                <Space size={24}>
                  <Button
                    type="secondary"
                    onClick={onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={onClickNext}
                    className={`${styles.bottomBar__button__primary} ${
                      !filledDocumentVerification ? styles.bottomBar__button__disabled : ''
                    }`}
                    disabled={!filledDocumentVerification}
                  >
                    {isSentEmail ? 'Resend' : 'Send'}
                  </Button>
                </Space>
                <RenderAddQuestion page={Page.Eligibility_documents} />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  const closeModalEmail = () => {
    setOpenModalEmail(false);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  // WELCOME MESSAGE
  const addFirstMessage = async () => {
    // get company name
    const currentCompany = companiesOfUser.find((c) => c._id === getCurrentCompany()) || {};
    const { name: companyName = '' } = currentCompany;
    // get candidate name
    let candidateName = `${firstName} ${middleName} ${lastName}`;
    if (!middleName) candidateName = `${firstName} ${lastName}`;
    // get hr name
    let hrName = `${hrFN} ${hrMN} ${hrLN}`;
    if (!hrMN) hrName = `${hrFN} ${hrLN}`;
    // get job title
    let currentJobTitle = title;
    if (!currentJobTitle)
      currentJobTitle = titleList.find((t) => t._id === title?._id || t._id === title) || {};
    const titleName = currentJobTitle?.name || '-';
    const messages = [
      {
        id: 1,
        title: `Welcome to ${companyName} !`,
        content: `Hello ${candidateName} !
        We are excited to have you onboard on this amazing journey with ${companyName}. This kicks off a journey packed with a crazy amount of fun, learning, brand new experiences and a lot more !
        We wish you lots of success in this new chapter of your life and can't wait to have you onboard !
        Our HR team will be in touch with you soon to help you complete the onboarding formalities.
        Regards
        ${ceoFullname}
        ${titleCEOName}, ${companyName}`,
      },
      {
        id: 2,
        title: `HR ${companyName} !`,
        content: `Hello ${candidateName} !
        Welcome to ${companyName} !
        My name is ${hrFN}, I will be helping you with the onboarding process.
        To proceed with the onboarding process, please go ahead and complete the Pending tasks shown on the Dashboard.
        Please feel free to reach out to me if you have any questions or issues.
        Regards
        ${hrName}
        ${titleName}, ${companyName}`,
      },
    ];
    const addNewMessage = async (id, senderId, message, preventSaveToRedux) => {
      await dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: id,
          sender: senderId,
          text: message,
        },
        preventSaveToRedux,
      });
    };
    const conversationIds = conversationList.map((c) => c._id);
    if (conversationIds.length > 0) {
      await addNewMessage(conversationIds[0], hrId, messages[0].content, true);
    }
    if (conversationIds.length > 1) {
      await addNewMessage(conversationIds[1], hrId, messages[1].content);
    }
  };

  // EMAILS
  const handleSendEmail = async (type) => {
    const payload = {
      candidate: _id,
      firstName,
      middleName,
      lastName,
      position,
      employeeType: employeeType._id || employeeType,
      department: department._id || department,
      title: title._id || title,
      workLocation: workLocation._id || workLocation,
      reportingManager: reportingManager._id || reportingManager,
      privateEmail,
      workEmail,
      previousExperience,
      salaryStructure,
      action: 'submit',
      options: 1,
      phoneNumber,
      totalExperience,
      company: getCurrentCompany(),
      tenantId: getCurrentTenant(),
      documentTypeA,
      documentTypeB,
      documentTypeC,
      documentTypeD,
      documentTypeE,
    };

    // send welcome messages
    if (!isSentEmail) {
      addFirstMessage();
    }

    dispatch({
      type: 'newCandidateForm/submitPhase1Effect',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(type !== 'generate-link');
        setOpenModalEmail(type === 'generate-link');
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            isMarkAsDone: type === 'generate-link',
            isSentEmail: type !== 'generate-link',
            processStatus:
              currentStep === ONBOARDING_STEPS.DOCUMENT_VERIFICATION
                ? PROFILE_VERIFICATION
                : processStatus,
          },
        });
      }
    });
    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledDocumentVerification: true,
      },
    });

    return 'DONE';
  };

  const handleValueChange = (e) => {
    const value = Object.values(e).find((x) => x);
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        privateEmail: value,
      },
    });
  };

  const handleMarkAsDone = async () => {
    if (processStatus !== 'SENT-PROVISIONAL-OFFER') {
      await handleSendEmail('generate-link');
    }
    const link = await dispatch({
      type: 'newCandidateForm/generateLink',
      payload: {
        candidate,
        firstName,
        privateEmail,
      },
    });
    if (link.statusCode === 200) {
      // setGeneratedLink(link.data.url);
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          generateLink: link.data.url,
          isMarkAsDone: true,
        },
      });

      setOpenModal(true);
    }
  };

  const firstInit = () => {
    validateFields();
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
    if (_id) {
      firstInit();
    }
  }, [_id]);

  useLayoutEffect(() => {
    if (!isFirstLoad) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate: _id,
          tenantId: getCurrentTenant(),
          documentTypeA,
          documentTypeB,
          documentTypeC,
          documentTypeD,
          documentTypeE,
        },
      });
    }
    setIsFirstLoad(false);
  }, [
    JSON.stringify(documentTypeA),
    JSON.stringify(documentTypeB),
    JSON.stringify(documentTypeC),
    JSON.stringify(documentTypeD),
    JSON.stringify(documentTypeE),
  ]);

  const getItemByType = (type) => {
    return tempData[mapType[type]];
  };

  if (loadingFetchCandidate) return <Skeleton />;
  const disabled = processStatus !== DRAFT;

  return (
    <Row gutter={[24, 24]} className={styles.DocumentVerification}>
      <Col sm={24} xl={16}>
        <div className={styles.leftWrapper}>
          <Row className={styles.eliContainer} gutter={[24, 24]}>
            <Title />
            {documentLayout
              .filter((x) => ['A', 'B', 'C'].includes(x.type))
              .map((x) => {
                return (
                  <CollapseFieldsTypeABC
                    disabled={disabled}
                    layout={x}
                    items={getItemByType(x.type)}
                  />
                );
              })}

            <CollapseFieldsTypeD />

            <CollapseFieldsTypeE
              processStatus={processStatus}
              disabled={disabled}
              layout={documentLayout.find((x) => x.type === 'E')}
              items={getItemByType('E')}
            />

            {_renderBottomBar()}
          </Row>
        </div>
      </Col>
      <Col xs={24} xl={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <NoteComponent />
          </Col>
          <Col span={24}>
            {(processStatus === DRAFT || processStatus === PROFILE_VERIFICATION) && (
              <SendEmail
                openModalEmail={openModalEmail}
                closeModalEmail={closeModalEmail}
                loading4={loading4}
                handleSendEmail={handleSendEmail}
                handleSendFormAgain={handleSendFormAgain}
                isSentEmail={isSentEmail}
                generateLink={generateLink}
                handleMarkAsDone={handleMarkAsDone}
                firstName={firstName}
                middleName={middleName}
                lastName={lastName}
                handleValueChange={handleValueChange}
                privateEmail={privateEmail}
                processStatusFilled={processStatus}
                processStatus={processStatus}
                filledDocumentVerification={filledDocumentVerification}
                valueToFinalOffer={valueToFinalOffer}
                changeValueToFinalOffer={changeValueToFinalOffer}
                dispatch={dispatch}
                candidate={candidate}
              />
            )}
          </Col>
          <Col span={24}>
            <MessageBox />
          </Col>
        </Row>
      </Col>
      <CustomModal
        open={openModal}
        closeModal={closeModal}
        content={
          <ModalContentComponent
            closeModal={closeModal}
            isSentEmail={isSentEmail}
            isMarkAsDone={isMarkAsDone}
            tempData={tempData}
            privateEmail={privateEmail}
          />
        }
      />
    </Row>
  );
};
export default connect(
  ({
    newCandidateForm,
    loading,
    currentStep = '',
    user: { companiesOfUser = [] },
    conversation: { conversationList = [] } = {},
  }) => ({
    currentStep,
    newCandidateForm,
    companiesOfUser,
    conversationList,
    loading4: loading.effects['newCandidateForm/submitPhase1Effect'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(DocumentVerification);
