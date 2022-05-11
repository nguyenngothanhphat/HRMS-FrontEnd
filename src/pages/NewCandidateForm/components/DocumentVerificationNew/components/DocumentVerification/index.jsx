/* eslint-disable no-param-reassign */
import { Button, Col, notification, Row, Skeleton, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomModal from '@/components/CustomModal';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
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

const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const DocumentVerification = (props) => {
  const {
    newCandidateForm: {
      tempData,
      checkMandatory,
      checkMandatory: { filledDocumentVerification = false } = {},
      data,
      tempData: {
        _id,
        processStatus = '',
        documentChecklistSetting = [],
        ticketID = '',
        isSentEmail = false,
        assignTo: {
          generalInfo: { firstName: hrFN = '', middleName: hrMN = '', lastName: hrLN = '' } = {} ||
            {},
          _id: hrId = '',
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
        documentList = [],
        identityProof = {},
        addressProof = {},
        educational = {},
        identityProof: { checkedList: checkedListA = [] } = {},
        addressProof: { checkedList: checkedListB = [] } = {},
        educational: { checkedList: checkedListC = [] } = {},
      } = {} || {},
    },
    dispatch,
    currentStep = 0,
    companiesOfUser = [],
    conversationList = [],
    loading4,
    loadingUpdateByHR,
    loadingFetchCandidate,
    companyLocationList = [],
  } = props;

  const { DRAFT, PROFILE_VERIFICATION } = NEW_PROCESS_STATUS;

  const [openModal, setOpenModal] = useState(false);
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [checkRadioSendMail, setCheckRadioSendMail] = useState(0);
  const [refreshBlockE, setRefreshBlockE] = useState(false);
  const [updating, setUpdating] = useState(false);

  const setSettings = (settings) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: settings,
      },
    });
  };

  const validateFields = () => {
    let validation = true;
    documentChecklistSetting.forEach((item) => {
      if (item.type === 'D' && item.data.length > 0) {
        const aliases = item.data
          .map((v) => v.alias)
          .filter((f) => f !== null && f !== undefined && f !== '');
        if (aliases.length !== item.data.length) validation = false;
      }
      if (item.type === 'E' && item.data.length > 0) {
        if (!item.employer) validation = false;
      }
    });

    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledDocumentVerification: validation,
      },
    });
  };

  // GET DATA FROM SERVER
  const getDataFromServer = () => {
    setUpdating(true);

    const arrToAdjust =
      processStatus === DRAFT
        ? JSON.parse(JSON.stringify(data.documentChecklistSetting))
        : JSON.parse(JSON.stringify(tempData.documentChecklistSetting));

    // -----------------------------------------------------------------------------------------
    const arrA = arrToAdjust.length > 0 && arrToAdjust[0].data.filter((x) => x.value === true);
    const arrB = arrToAdjust.length > 0 && arrToAdjust[1].data.filter((x) => x.value === true);
    const arrC = arrToAdjust.length > 0 && arrToAdjust[2].data.filter((x) => x.value === true);

    // FINAL LIST OF CHECKED CHECKBOXES
    const listSelectedA = arrA.map((x) => x.alias);
    const listSelectedB = arrB.map((x) => x.alias);
    const listSelectedC = arrC.map((x) => x.alias);

    // SAVE TO REDUX
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        identityProof: {
          ...identityProof,
          checkedList: listSelectedA,
        },
        addressProof: {
          ...addressProof,
          checkedList: listSelectedB,
        },
        educational: {
          ...educational,
          checkedList: listSelectedC,
        },
      },
    });

    // set first value for [newPoe - the final poe]
    // setState({ newPoe: listSelectedEFinal });
    setTimeout(() => {
      setUpdating(false);
    }, 50);
  };

  // generate object of each block for send email
  const generateForSendEmail = (proof, checkedList) => {
    const tempProof = JSON.parse(JSON.stringify(proof));

    tempProof.forEach((x) => {
      const { alias = '' } = x;
      let check = false;
      checkedList.forEach((value1) => {
        if (alias === value1) {
          check = true;
        }
        return null;
      });
      if (check) x.value = true;
      else x.value = false;
      return null;
    });
    return tempProof;
  };

  // generate documentChecklistSetting
  const generatedocumentChecklistSettings = (
    docsListE,
    checkedListAProp,
    checkedListBProp,
    checkedListCProp,
  ) => {
    let identityProofTemp = [];
    let addressProofTemp = [];
    let educationalTemp = [];

    documentChecklistSetting.forEach((doc) => {
      if (doc.type === 'A') {
        identityProofTemp = [...doc.data];
      }
      if (doc.type === 'B') {
        addressProofTemp = [...doc.data];
      }
      if (doc.type === 'C') {
        educationalTemp = [...doc.data];
      }
    });

    // value for documentChecklistSetting field
    const arrA = generateForSendEmail(identityProofTemp, checkedListAProp);
    const arrB = generateForSendEmail(addressProofTemp, checkedListBProp);
    const arrC = generateForSendEmail(educationalTemp, checkedListCProp);

    let documentCLS = [
      {
        type: 'A',
        name: 'Identity Proof',
        data: arrA,
      },
      {
        type: 'B',
        name: 'Address Proof',
        data: arrB,
      },
      {
        type: 'C',
        name: 'Educational',
        data: arrC,
      },
    ];

    if (docsListE.length >= 1) {
      if (docsListE[0].data.length > 0) {
        documentCLS = documentCLS.concat(docsListE);
      }
    }

    return documentCLS;
  };

  const handleUpdateByHR = (docsListE, checkedListAProp, checkedListBProp, checkedListCProp) => {
    const documentChecklistSettingTemp = generatedocumentChecklistSettings(
      docsListE,
      checkedListAProp,
      checkedListBProp,
      checkedListCProp,
    );

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate: _id,
        documentChecklistSetting: documentChecklistSettingTemp,
        currentStep:
          processStatus === DRAFT || processStatus === PROFILE_VERIFICATION ? 2 : currentStep,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        currentStep:
          processStatus === DRAFT || processStatus === PROFILE_VERIFICATION ? 2 : currentStep,
      },
    });
  };

  // SEND FORM VIA EMAIL AGAIN
  const handleSendFormAgain = () => {
    setOpenModalEmail(true);
  };

  const disableEdit = () => {
    if (processStatus === PROFILE_VERIFICATION) {
      return true;
    }
    return false;
  };

  const getVariableNameByType = (typeProp) => {
    switch (typeProp) {
      case 'A':
        return 'identityProof';

      case 'B':
        return 'addressProof';

      case 'C':
        return 'educational';

      default:
        return '';
    }
  };
  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK A,B,C
  const handleChange = (checkedList, item) => {
    const { type = '' } = item;

    const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

    const typeName = getVariableNameByType(type);
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        [typeName]: {
          ...[typeName],
          checkedList,
        },
      },
    });

    if (type === 'A') {
      handleUpdateByHR(docsListE, checkedList, checkedListB, checkedListC);
    } else if (type === 'B') {
      handleUpdateByHR(docsListE, checkedListA, checkedList, checkedListC);
    } else if (type === 'C') {
      handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedList);
    }
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
        <CEO Name>
        C.E.O, ${companyName}`,
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
    const docsListD = documentChecklistSetting.filter((doc) => doc.type === 'D') || [];
    const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

    const result = generatedocumentChecklistSettings(
      docsListE,
      checkedListA,
      checkedListB,
      checkedListC,
      docsListD,
    );

    setSettings(result);

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
      documentChecklistSetting,
      action: 'submit',
      options: 1,
      phoneNumber,
      totalExperience,
      company: getCurrentCompany(),
      tenantId: getCurrentTenant(),
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

        getDataFromServer();

        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            isMarkAsDone: type === 'generate-link',
            isSentEmail: type !== 'generate-link',
            processStatus: currentStep === 2 ? PROFILE_VERIFICATION : processStatus,
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

  // get document list by country
  const getDocumentListByCountry = (list) => {
    let workLocation1 = workLocation;
    if (typeof workLocation === 'string') {
      workLocation1 = companyLocationList.find((w) => w._id === workLocation);
    }
    if (workLocation1) {
      return list.map((item) => {
        const { data: dataX = [] } = item;
        const newData = dataX.filter(({ country = [] }) => {
          return (
            country.includes(workLocation1?.headQuarterAddress?.country?._id) ||
            country.includes(workLocation1?.headQuarterAddress?.country) ||
            country.length === 0
          );
        });

        return {
          ...item,
          data: newData,
        };
      });
    }
    return list;
  };

  // for block E
  const addBlockE = () => {
    const documentListByCountry = getDocumentListByCountry(
      JSON.parse(JSON.stringify(documentList)),
    );
    const fieldDataTypeE = documentListByCountry.find((doc) => doc.type === 'E')?.data || [];

    const newDoc = {
      type: 'E',
      name: 'Previous Employment',
      employer: '',
      startDate: '',
      endDate: '',
      toPresent: false,
      data: fieldDataTypeE,
    };

    let newDocumentList = JSON.parse(JSON.stringify(documentChecklistSetting));
    const forCheckE = newDocumentList.filter((doc) => doc.type === 'E');

    if (forCheckE.length === 1 && forCheckE[0].data.length === 0) {
      newDocumentList = newDocumentList.map((doc) => {
        if (doc.type === 'E') {
          return newDoc;
        }
        return doc;
      });
    } else {
      newDocumentList.push(newDoc);
    }

    const docsListE = newDocumentList.filter((doc) => doc.type === 'E') || [];

    setSettings(newDocumentList);

    handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC);
  };

  const handleChangeNameBlockE = (value, index) => {
    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    // const newDocument = [...checkedListD];
    const documentCLSTypeOthers = documentCLS.filter((doc) => doc.type !== 'E');
    const documentCLSTypeE = documentCLS.filter((doc) => doc.type === 'E');

    documentCLSTypeE[index].employer = value;

    setSettings([...documentCLSTypeOthers, ...documentCLSTypeE]);
    handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC);
  };

  const handleCheckBlockE = (list, checkedList, index) => {
    const documentListByCountry = getDocumentListByCountry(
      JSON.parse(JSON.stringify(documentList)),
    );
    const newList = documentListByCountry.find((doc) => doc.type === 'E')?.data || [];

    newList.forEach((field) => {
      if (checkedList.includes(field.alias)) {
        field.value = true;
      }
    });

    // const newDocument = [...checkedListD];
    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    const documentCLSTypeOthers = documentCLS.filter((doc) => doc.type !== 'E');
    const documentCLSTypeE = documentCLS.filter((doc) => doc.type === 'E');

    documentCLSTypeE[index].data = [...newList];

    setSettings([...documentCLSTypeOthers, ...documentCLSTypeE]);
    handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC);
  };

  const removeBlockE = (index) => {
    setRefreshBlockE(true);

    // const newDocument = [...checkedListD];
    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    const documentCLSTypeOthers = documentCLS.filter((doc) => doc.type !== 'E');
    const documentCLSTypeE = documentCLS.filter((doc) => doc.type === 'E');

    documentCLSTypeE.splice(index, 1);

    setSettings([...documentCLSTypeOthers, ...documentCLSTypeE]);
    handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC);
    setTimeout(() => {
      setRefreshBlockE(false);
    }, 100);
  };

  // BLOCK A,B,C ADDING NEW FIELD
  const addNewField = async (name, type) => {
    if (name) {
      let newDocument = [];
      if (type === 'A') {
        newDocument = [...checkedListA];
        // newDocument = [...checkedListA, name];
      }
      if (type === 'B') {
        // newDocument = [...checkedListB, name];
        newDocument = [...checkedListB];
      }
      if (type === 'C') {
        newDocument = [...checkedListC];
        // newDocument = [...checkedListC, name];
      }

      const newDoc = {
        key: camelize(name),
        alias: name,
        value: false,
        new: true,
      };

      const newDocumentList = [...getDocumentListByCountry(documentChecklistSetting)];
      newDocumentList.forEach((doc) => {
        if (doc.type === type) {
          doc.data.push(newDoc);
        }
      });

      const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

      const typeName = getVariableNameByType(type);

      setSettings(newDocumentList);
      const payload = {
        [typeName]: {
          ...[typeName],
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });

      if (type === 'A') {
        handleUpdateByHR(docsListE, newDocument, checkedListB, checkedListC);
      }
      if (type === 'B') {
        handleUpdateByHR(docsListE, checkedListA, newDocument, checkedListC);
      }
      if (type === 'C') {
        handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument);
      }
    }
  };

  const removeNewField = async (key, type) => {
    let newDocument = [];
    if (type === 'A') {
      newDocument = checkedListA.filter((val) => val.key !== key);
    }
    if (type === 'B') {
      newDocument = checkedListB.filter((val) => val.key !== key);
    }
    if (type === 'C') {
      newDocument = checkedListC.filter((val) => val.key !== key);
    }
    const documentCLSTByCountry = getDocumentListByCountry(documentChecklistSetting);
    const newDocumentList = [...documentCLSTByCountry];
    newDocumentList.forEach((doc) => {
      if (doc.type === type) {
        doc.data = doc.data.filter((v) => v.key !== key);
      }
    });

    const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

    let payload = {};
    const typeName = getVariableNameByType(type);
    setSettings(newDocumentList);
    payload = {
      [typeName]: {
        ...[typeName],
        checkedList: newDocument,
      },
    };
    await dispatch({
      type: 'newCandidateForm/saveTemp',
      payload,
    });

    if (type === 'A') {
      handleUpdateByHR(docsListE, newDocument, checkedListB, checkedListC);
    }
    if (type === 'B') {
      handleUpdateByHR(docsListE, checkedListA, newDocument, checkedListC);
    }
    if (type === 'C') {
      handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument);
    }
  };

  const firstInit = () => {
    getDataFromServer();
    const listA = getDocumentListByCountry(documentChecklistSetting);
    const listB = getDocumentListByCountry(documentList);

    setSettings(listA);
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentList: listB,
      },
    });
    validateFields();
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
    if (_id) {
      firstInit();
    }
  }, [_id]);

  useEffect(() => {
    if (_id) {
      validateFields();
    }
  }, [JSON.stringify()]);

  // main
  const documentCLSTByCountry = getDocumentListByCountry(documentChecklistSetting);
  // type A, B, C
  const documentCLSByCountryTypeABC = documentCLSTByCountry.filter((doc) =>
    ['A', 'B', 'C'].includes(doc.type),
  );

  // type E
  const documentCLSTByCountryTypeE = documentCLSTByCountry.filter((doc) =>
    ['E'].includes(doc.type),
  );

  if (loadingFetchCandidate) return <Skeleton />;
  return (
    <Row gutter={[24, 24]} className={styles.DocumentVerification}>
      <Col span={16} sm={24} md={24} lg={24} xl={16}>
        <div className={styles.leftWrapper}>
          <Row className={styles.eliContainer} gutter={[24, 24]}>
            <Title />
            {!updating &&
              documentCLSByCountryTypeABC
                .filter((x) => ['A', 'B', 'C'].includes(x.type))
                .map((item) => {
                  return (
                    <CollapseFieldsTypeABC
                      addNewField={addNewField}
                      item={item}
                      loading={loadingUpdateByHR}
                      handleChange={handleChange}
                      handleRemoveDocument={removeNewField}
                      disabled={disableEdit()}
                      documentChecklistSetting={documentChecklistSetting}
                    />
                  );
                })}

            <CollapseFieldsTypeD />

            {(processStatus === DRAFT || documentCLSTByCountryTypeE.length > 0) && (
              <CollapseFieldsTypeE
                handleChangeName={handleChangeNameBlockE}
                handleCheck={handleCheckBlockE}
                processStatus={processStatus}
                removeBlockE={removeBlockE}
                addBlockE={addBlockE}
                disabled={disableEdit()}
                previousEmployment={documentCLSTByCountryTypeE}
                refresh={refreshBlockE}
              />
            )}

            {_renderBottomBar()}
          </Row>
        </div>
      </Col>
      <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
        <div>
          <NoteComponent />

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

          <Row>
            <MessageBox />
          </Row>
        </div>
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
    location: { companyLocationList = [] } = {},
    user: { companiesOfUser = [] },
    conversation: { conversationList = [] } = {},
  }) => ({
    currentStep,
    newCandidateForm,
    companyLocationList,
    companiesOfUser,
    conversationList,
    loading4: loading.effects['newCandidateForm/submitPhase1Effect'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(DocumentVerification);
