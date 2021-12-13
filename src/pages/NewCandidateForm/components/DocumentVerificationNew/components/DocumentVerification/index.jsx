/* eslint-disable no-param-reassign */
// import Warning from './components/Warning';
import { Button, Col, notification, Row, Skeleton, Space } from 'antd';
import { map } from 'lodash';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import CustomModal from '@/components/CustomModal';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import NoteComponent from '../../../NewNoteComponent';
import CollapseFieldsTypeABC from './components/CollapseFieldsTypeABC';
import CollapseFieldsTypeD from './components/CollapseFieldsTypeD';
import CollapseFieldsTypeE from './components/CollapseFieldsTypeE';
import ModalContentComponent from './components/ModalContentComponent';
import SendEmail from './components/SendEmail';
import MessageBox from '../../../MessageBox';
import { Page } from '../../../../utils';
import Title from './components/Title';
import styles from './styles.less';

const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};
@connect(
  ({
    newCandidateForm,
    loading,
    newCandidateForm: {
      tempData,
      checkMandatory,
      data,
      tableData,
      tempData: { ticketID = '' },
    },
    currentStep = '',
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [] },
    conversation: { conversationList = [] } = {},
  }) => ({
    tempData,
    data,
    tableData,
    currentStep,
    ticketID,
    checkMandatory,
    newCandidateForm,
    listLocationsByCompany,
    companiesOfUser,
    conversationList,
    loading4: loading.effects['newCandidateForm/submitPhase1Effect'],
    loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)
class DocumentVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openModalEmail: false,
      identityProof: {},
      addressProof: {},
      educational: {},
      checkRadioSendMail: 0,
      refreshBlockE: false,
      updating: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('tempData' in props) {
      return {
        tempData: props.tempData,
        data: props.data || {},
      };
    }
    return null;
  }

  componentDidMount = () => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
    const {
      data: { _id = '' },
    } = this.props;

    if (_id) {
      this.firstInit();
    }
  };

  componentDidUpdate = (prevProps) => {
    const {
      tempData: { documentChecklistSetting = [] } = {} || {},
      data: { _id = '' },
    } = this.props;

    if (
      _id &&
      JSON.stringify(prevProps.tempData.documentChecklistSetting) !==
        JSON.stringify(documentChecklistSetting)
    ) {
      this.validateFields();
    }

    if (_id && _id !== prevProps.data._id) {
      this.firstInit();
    }
  };

  firstInit = () => {
    const { tempData: { documentChecklistSetting = [], documentList = [] } = {} || {}, dispatch } =
      this.props;

    this.getDataFromServer();
    const listA = this.getDocumentListByCountry(documentChecklistSetting);
    const listB = this.getDocumentListByCountry(documentList);
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: listA,
        documentList: listB,
      },
    });
    this.validateFields();
  };

  validateFields = () => {
    const { tempData: { documentChecklistSetting = [] } = {}, dispatch } = this.props;
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
  getDataFromServer = () => {
    this.setState({ updating: true });
    const {
      data = {},
      tempData: {
        identityProof = {},
        addressProof = {},
        educational = {},
        // technicalCertifications = {},
        // previousEmployment = {},
        // candidate: candidateId = '',
        // documentChecklistSetting = [],
      },
      tempData,
      dispatch,
    } = this.props;

    // save step
    const { processStatus } = data;

    const arrToAdjust =
      processStatus === NEW_PROCESS_STATUS.DRAFT
        ? JSON.parse(JSON.stringify(data.documentChecklistSetting))
        : JSON.parse(JSON.stringify(tempData.documentChecklistSetting));

    this.setState({
      identityProof: arrToAdjust[0].data,
      addressProof: arrToAdjust[1].data,
      educational: arrToAdjust[2].data,
    });

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
    // this.setState({ newPoe: listSelectedEFinal });
    setTimeout(() => {
      this.setState({ updating: false });
    }, 50);
  };

  handleUpdateByHR = (docsListE, checkedListA, checkedListB, checkedListC, docsListD) => {
    const { data, currentStep } = this.props;
    const { dispatch } = this.props;
    const { _id, processStatus = '' } = data;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      docsListE,
      checkedListA,
      checkedListB,
      checkedListC,
      docsListD,
    );

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate: _id,
        documentChecklistSetting,
        currentStep:
          processStatus === NEW_PROCESS_STATUS.DRAFT ||
          processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION
            ? 2
            : currentStep,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        currentStep:
          processStatus === NEW_PROCESS_STATUS.DRAFT ||
          processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION
            ? 2
            : currentStep,
      },
    });
  };

  // SEND FORM VIA EMAIL AGAIN
  handleSendFormAgain = () => {
    // const { dispatch } = this.props;
    // const { tempData: { isSentEmail } = {} } = this.state;
    // dispatch({
    //   type: 'newCandidateForm/saveTemp',
    //   payload: {
    //     isSentEmail: !isSentEmail,
    //   },
    // });
    this.setState({ openModalEmail: true });
  };

  disableEdit = () => {
    const {
      data: { processStatus = '' },
    } = this.props;

    const { PROFILE_VERIFICATION } = NEW_PROCESS_STATUS;
    if (processStatus === PROFILE_VERIFICATION) {
      return true;
    }
    return false;
  };

  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK A,B,C
  handleChange = (checkedList, item) => {
    const { dispatch } = this.props;
    const { tempData } = this.state;
    const { type = '' } = item;

    const { identityProof = {}, addressProof = {}, educational = {} } = tempData;

    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // technicalCertifications: { checkedList: checkedListD = [] } = {},
          documentChecklistSetting: docsList = [],
        },
      } = {},
    } = this.props;

    const docsListD = docsList.filter((doc) => doc.type === 'D') || [];
    const docsListE = docsList.filter((doc) => doc.type === 'E') || [];

    if (type === 'A') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          identityProof: {
            ...identityProof,
            checkedList,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedList, checkedListB, checkedListC, docsListD);
    } else if (type === 'B') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          addressProof: {
            ...addressProof,
            checkedList,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedList, checkedListC, docsListD);
    } else if (type === 'C') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          educational: {
            ...educational,
            checkedList,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedList, docsListD);
    }
  };

  // HANDLE CHANGE WHEN CLICK ALL CHECKBOXES OF BLOCK A,B,C
  handleCheckAll = (e, checkedList, item) => {
    const { tempData } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational } = tempData;
    const { data: arr = [], type = '' } = item;
    if (e.target.checked) {
      map(arr, (data) => {
        data.value = true;
      });
    } else {
      map(arr, (data) => {
        data.value = false;
      });
    }

    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          documentChecklistSetting: docsList = [],
        },
      } = {},
    } = this.props;

    const docsListD = docsList.filter((doc) => doc.type === 'D') || [];
    const docsListE = docsList.filter((doc) => doc.type === 'E') || [];

    const checkedListNew = e.target.checked ? arr.map((data) => data.alias) : [];
    if (type === 'A') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          identityProof: {
            ...identityProof,
            checkedList: checkedListNew,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedListNew, checkedListB, checkedListC, docsListD);
    } else if (type === 'B') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          addressProof: {
            ...addressProof,
            checkedList: checkedListNew,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListNew, checkedListC, docsListD);
    } else if (type === 'C') {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          educational: {
            ...educational,
            checkedList: checkedListNew,
          },
        },
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListNew, docsListD);
    }
  };

  handleCheckAllBlockE = (checked) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          documentChecklistSetting: docsList = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const docsListOther = docsList.filter((doc) => doc.type !== 'E') || [];
    const docsListD = docsList.filter((doc) => doc.type === 'D') || [];
    let docsListE = JSON.parse(JSON.stringify(docsList.filter((doc) => doc.type === 'E')) || []);
    docsListE = docsListE.map((doc) => {
      const { data = [] } = doc;
      return {
        ...doc,
        data: data.map((item) => {
          return {
            ...item,
            value: checked,
          };
        }),
      };
    });

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: [...docsListOther, ...docsListE],
      },
    });
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK D
  // handleChangeForD = (list) => {
  //   const { newPoe } = this.state;

  //   const {
  //     newCandidateForm: {
  //       tempData: {
  //         identityProof: { checkedList: checkedListA = [] } = {},
  //         addressProof: { checkedList: checkedListB = [] } = {},
  //         educational: { checkedList: checkedListC = [] } = {},
  //         technicalCertifications = {},
  //       },
  //     } = {},
  //     dispatch,
  //   } = this.props;

  //   dispatch({
  //     type: 'newCandidateForm/saveTemp',
  //     payload: {
  //       technicalCertifications: {
  //         ...technicalCertifications,
  //         checkedList: list,
  //       },
  //     },
  //   });

  //   this.handleUpdateByHR(newPoe, checkedListA, checkedListB, checkedListC, list);
  // };

  changeValueToFinalOffer = (e) => {
    const { dispatch, tempData, checkMandatory, data: { processStatus = '' } = {} } = this.props;
    const { PROFILE_VERIFICATION } = NEW_PROCESS_STATUS;
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
    this.setState({ checkRadioSendMail: e.target.value });
  };

  _renderBottomBar = () => {
    const {
      tempData: { isSentEmail = false } = {},
      checkMandatory: { filledDocumentVerification = false } = {},
    } = this.props;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Space size={24}>
                <Button
                  type="secondary"
                  onClick={this.onClickPrev}
                  className={styles.bottomBar__button__secondary}
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={this.onClickNext}
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
    );
  };

  closeModalEmail = () => {
    this.setState({
      openModalEmail: false,
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  // generate object of each block for send email
  generateForSendEmail = (proof, checkedList) => {
    const tempProof = JSON.parse(JSON.stringify(proof));

    // if (tempProof.length > 0) {
    tempProof.forEach((data) => {
      const { alias = '' } = data;
      let check = false;
      checkedList.forEach((value1) => {
        if (alias === value1) {
          check = true;
        }
        return null;
      });
      if (check) data.value = true;
      else data.value = false;
      return null;
    });
    return tempProof;
    // }
    // return {};
  };

  // generate documentCheckListSetting
  generateDocumentCheckListSettings = (
    docsListE,
    checkedListA,
    checkedListB,
    checkedListC,
    docsListD,
  ) => {
    let identityProof = [];
    let addressProof = [];
    let educational = [];

    const { tempData: { documentChecklistSetting = [] } = {} } = this.props;
    documentChecklistSetting.forEach((doc) => {
      if (doc.type === 'A') {
        identityProof = [...doc.data];
      }
      if (doc.type === 'B') {
        addressProof = [...doc.data];
      }
      if (doc.type === 'C') {
        educational = [...doc.data];
      }
    });

    // value for documentChecklistSetting field
    const arrA = this.generateForSendEmail(identityProof, checkedListA);
    const arrB = this.generateForSendEmail(addressProof, checkedListB);
    const arrC = this.generateForSendEmail(educational, checkedListC);

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
      // {
      //   type: 'D',
      //   name: 'Technical Certifications',
      //   data: arrD,
      // },
    ];

    // if (docsListD.length >= 1) {
    //   if (docsListD[0].data.length > 0) {
    documentCLS = documentCLS.concat(docsListD);
    //   }
    // }

    if (docsListE.length >= 1) {
      if (docsListE[0].data.length > 0) {
        documentCLS = documentCLS.concat(docsListE);
      }
    }

    return documentCLS;
  };

  // WELCOME MESSAGE
  addFirstMessage = async () => {
    const {
      tempData: {
        assignTo: {
          generalInfo: { firstName: hrFN = '', middleName: hrMN = '', lastName: hrLN = '' } = {} ||
            {},
          _id: hrId = '',
        } = {} || {},
        firstName: candidateFN = '',
        middleName: candidateMN = '',
        lastName: candidateLN = '',
        titleList = [],
        title,
      },
      companiesOfUser = [],
      conversationList = [],
    } = this.props;
    // get company name
    const currentCompany = companiesOfUser.find((c) => c._id === getCurrentCompany()) || {};
    const { name: companyName = '' } = currentCompany;
    // get candidate name
    let candidateName = `${candidateFN} ${candidateMN} ${candidateLN}`;
    if (!candidateMN) candidateName = `${candidateFN} ${candidateLN}`;
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
    const { dispatch } = this.props;
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
  handleSendEmail = async (type) => {
    const { dispatch } = this.props;
    // const { newPoe } = this.state;

    const {
      tempData: {
        department,
        workLocation,
        reportingManager,
        title,
        employeeType,
        _id,
        firstName,
        middleName,
        lastName,
        position,
        privateEmail,
        workEmail,
        previousExperience,
        salaryStructure,
        // company,
        processStatus,
        isSentEmail = false,
      } = {},
    } = this.props;

    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // technicalCertifications: { checkedList: checkedListD = [] } = {},
          documentChecklistSetting: docsList = [],
        },
        currentStep,
      } = {},
    } = this.props;

    const docsListD = docsList.filter((doc) => doc.type === 'D') || [];
    const docsListE = docsList.filter((doc) => doc.type === 'E') || [];

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      docsListE,
      checkedListA,
      checkedListB,
      checkedListC,
      docsListD,
    );

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting,
      },
    });

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
      company: getCurrentCompany(),
      tenantId: getCurrentTenant(),
    };

    // send welcome messages
    if (!isSentEmail) {
      this.addFirstMessage();
    }

    await dispatch({
      type: 'newCandidateForm/submitPhase1Effect',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: type !== 'generate-link',
          openModalEmail: type === 'generate-link',
        });
        this.getDataFromServer();

        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            isMarkAsDone: type === 'generate-link',
            isSentEmail: type !== 'generate-link',
            processStatus:
              currentStep === 2 ? NEW_PROCESS_STATUS.PROFILE_VERIFICATION : processStatus,
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

  handleValueChange = (e) => {
    const { dispatch } = this.props;
    const value = Object.values(e).find((x) => x);
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        privateEmail: value,
      },
    });
  };

  handleMarkAsDone = async () => {
    const { dispatch, tempData: { candidate, firstName, privateEmail, processStatus } = {} } =
      this.props;

    if (processStatus !== 'SENT-PROVISIONAL-OFFER') {
      await this.handleSendEmail('generate-link');
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

      this.setState({
        openModal: true,
      });
    }
  };

  // bottom bar
  onClickPrev = () => {
    const { ticketID = '' } = this.props;
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
  };

  onClickNext = () => {
    const { dispatch } = this.props;
    const { checkRadioSendMail } = this.state;
    if (checkRadioSendMail === 0) {
      this.setState({ openModalEmail: true });
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

  // for block E
  addBlockE = () => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
          documentList = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const documentListByCountry = this.getDocumentListByCountry(
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

    let newDocumentList = [...JSON.parse(JSON.stringify(documentChecklistSetting))];
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

    const docsListD = newDocumentList.filter((doc) => doc.type === 'D') || [];
    const docsListE = newDocumentList.filter((doc) => doc.type === 'E') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: newDocumentList,
      },
    });
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  handleChangeNameBlockE = (value, index) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    // const newDocument = [...checkedListD];
    const documentCLSTypeOthers = documentCLS.filter((doc) => doc.type !== 'E');
    const documentCLSTypeE = documentCLS.filter((doc) => doc.type === 'E');

    documentCLSTypeE[index].employer = value;

    const docsListD = documentCLSTypeOthers.filter((val) => val.type === 'D') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: [...documentCLSTypeOthers, ...documentCLSTypeE],
      },
    });
    this.handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  handleCheckBlockE = (list, checkedList, index) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          documentChecklistSetting = [],
          documentList = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const documentListByCountry = this.getDocumentListByCountry(
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

    const docsListD = documentCLSTypeOthers.filter((val) => val.type === 'D') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: [...documentCLSTypeOthers, ...documentCLSTypeE],
      },
    });
    this.handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  removeBlockE = (index) => {
    this.setState({ refreshBlockE: true });
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // technicalCertifications: { checkedList: checkedListD = [] } = {},
          // technicalCertifications = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    // const newDocument = [...checkedListD];
    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    const documentCLSTypeOthers = documentCLS.filter((doc) => doc.type !== 'E');
    const documentCLSTypeE = documentCLS.filter((doc) => doc.type === 'E');

    documentCLSTypeE.splice(index, 1);

    const docsListD = documentCLSTypeOthers.filter((val) => val.type === 'D') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: [...documentCLSTypeOthers, ...documentCLSTypeE],
      },
    });
    this.handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC, docsListD);
    setTimeout(() => {
      this.setState({ refreshBlockE: false });
    }, 100);
  };

  // for block D
  addCertification = () => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},
          technicalCertifications = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const newDocument = [...checkedListD];

    // const newDoc = {
    //   key: camelize(name),
    //   alias: name,
    //   value: true,
    // };

    const newDoc = {
      key: '',
      alias: '', // name
      value: false,
      mandatoryToSend: true,
      limited: false,
      issuedDate: '',
      validityDate: '',
    };

    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    documentCLS.forEach((doc) => {
      if (doc.type === 'D') {
        doc.data.push(newDoc);
      }
    });

    const docsListD = documentCLS.filter((doc) => doc.type === 'D') || [];
    const docsListE = documentCLS.filter((doc) => doc.type === 'E') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: documentCLS,
        technicalCertifications: {
          ...technicalCertifications,
          checkedList: newDocument,
        },
      },
    });
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  handleChangeCertification = ({ type, index, value }) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // technicalCertifications: { checkedList: checkedListD = [] } = {},
          technicalCertifications = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    // const newDocument = [...checkedListD, name];

    // const newDoc = {
    //   key: camelize(name),
    //   alias: name,
    //   value: true,
    // };
    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    let checkedList = [];
    const docsList = documentCLS.filter((doc) => doc.type !== 'D');
    const newDocumentList = JSON.parse(
      JSON.stringify(documentCLS.filter((doc) => doc.type === 'D')),
    );

    newDocumentList.forEach((doc) => {
      if (doc.type === 'D') {
        if (doc.data.length === 0)
          doc.data.push({
            key: '',
            alias: '',
            value: true,
          });
        const itemData = doc.data[index];
        if (type === 'mandatoryToSend') {
          itemData.value = value;
        } else itemData[type] = value;
        itemData.key = camelize(type === 'alias' ? value : itemData.alias);

        if (doc.value === true) {
          checkedList = [...checkedList, itemData.alias];
        }
      }
    });

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: [...docsList, ...newDocumentList],
        technicalCertifications: {
          ...technicalCertifications,
          checkedList,
        },
      },
    });

    const docsListE = documentCLS.filter((doc) => doc.type === 'E');
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, newDocumentList);
  };

  removeCertification = (index) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},
          technicalCertifications = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const newDocument = [...checkedListD];

    const documentCLS = JSON.parse(JSON.stringify(documentChecklistSetting));

    documentCLS.forEach((doc) => {
      if (doc.type === 'D') {
        doc.data.splice(index, 1);
      }
    });

    const docsListD = documentCLS.filter((val) => val.type === 'D') || [];
    const docsListE = documentCLS.filter((val) => val.type === 'E') || [];

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklistSetting: documentCLS,
        technicalCertifications: {
          ...technicalCertifications,
          checkedList: newDocument,
        },
      },
    });
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  // get document list by country
  getDocumentListByCountry = (list) => {
    const { tempData = {}, listLocationsByCompany = [] } = this.props;
    const { workLocation = {} } = tempData;
    let workLocation1 = workLocation;
    if (typeof workLocation === 'string') {
      workLocation1 = listLocationsByCompany.find((w) => w._id === workLocation);
    }
    if (workLocation1) {
      return list.map((item) => {
        const { data = [] } = item;
        const newData = data.filter(({ country = [] }) => {
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

  // BLOCK A,B,C ADDING NEW FIELD
  addNewField = async (name, type) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          // technicalCertifications: { checkedList: checkedListD = [] } = {},
          identityProof = {},
          addressProof = {},
          educational = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

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

    const documentCLSTByCountry = this.getDocumentListByCountry(documentChecklistSetting);
    const newDocumentList = [...documentCLSTByCountry];
    newDocumentList.forEach((doc) => {
      if (doc.type === type) {
        doc.data.push(newDoc);
      }
    });

    const docsListD = documentChecklistSetting.filter((doc) => doc.type === 'D') || [];
    const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

    let payload = {};

    if (type === 'A') {
      payload = {
        documentChecklistSetting: newDocumentList,
        identityProof: {
          ...identityProof,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, newDocument, checkedListB, checkedListC, docsListD);
    }
    if (type === 'B') {
      payload = {
        documentChecklistSetting: newDocumentList,
        addressProof: {
          ...addressProof,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, newDocument, checkedListC, docsListD);
    }
    if (type === 'C') {
      payload = {
        documentChecklistSetting: newDocumentList,
        educational: {
          ...educational,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument, docsListD);
    }
  };

  removeNewField = async (key, type) => {
    const {
      newCandidateForm: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          identityProof = {},
          addressProof = {},
          educational = {},
          // previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

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

    const documentCLSTByCountry = this.getDocumentListByCountry(documentChecklistSetting);
    const newDocumentList = [...documentCLSTByCountry];
    newDocumentList.forEach((doc) => {
      if (doc.type === type) {
        doc.data = doc.data.filter((v) => v.key !== key);
      }
    });

    const docsListD = documentChecklistSetting.filter((doc) => doc.type === 'D') || [];
    const docsListE = documentChecklistSetting.filter((doc) => doc.type === 'E') || [];

    let payload = {};

    if (type === 'A') {
      payload = {
        documentChecklistSetting: newDocumentList,
        identityProof: {
          ...identityProof,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, newDocument, checkedListB, checkedListC, docsListD);
    }
    if (type === 'B') {
      payload = {
        documentChecklistSetting: newDocumentList,
        addressProof: {
          ...addressProof,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, newDocument, checkedListC, docsListD);
    }
    if (type === 'C') {
      payload = {
        documentChecklistSetting: newDocumentList,
        educational: {
          ...educational,
          checkedList: newDocument,
        },
      };
      await dispatch({
        type: 'newCandidateForm/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument, docsListD);
    }
  };

  // main
  render() {
    const { refreshBlockE, updating } = this.state;
    const {
      dispatch,
      newCandidateForm: {
        tempData,
        tempData: {
          isSentEmail,
          generateLink,
          firstName,
          middleName,
          lastName,
          valueToFinalOffer,
          isMarkAsDone,
          documentChecklistSetting = [],
        },
        data: { privateEmail, processStatus = '', candidate = '' },
        checkMandatory: { filledDocumentVerification = false } = {},
      } = {},
      loading4,
      loadingUpdateByHR,
      loadingFetchCandidate,
    } = this.props;
    const documentCLSTByCountry = this.getDocumentListByCountry(documentChecklistSetting);
    // type A, B, C
    const documentCLSByCountryTypeABC = documentCLSTByCountry.filter((doc) =>
      ['A', 'B', 'C'].includes(doc.type),
    );

    // type D
    const documentCLSTypeD = documentChecklistSetting.find((doc) => doc.type === 'D');

    // type E
    const documentCLSTByCountryTypeE = documentCLSTByCountry.filter((doc) =>
      ['E'].includes(doc.type),
    );

    const { openModalEmail, openModal, identityProof, addressProof, educational } = this.state;

    if (loadingFetchCandidate) return <Skeleton />;
    return (
      <div>
        <Row gutter={[24, 0]} className={styles.DocumentVerification}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              {/* <Warning formatMessage={formatMessage} /> */}
              <Title />
              {!updating &&
                documentCLSByCountryTypeABC.map((item) => {
                  const { type = '', name = '', data = [] } = item;
                  const title = `Type ${type}: ${name}`;

                  if (['A', 'B', 'C'].includes(type)) {
                    return (
                      <CollapseFieldsTypeABC
                        title={title}
                        addNewField={this.addNewField}
                        item={item}
                        loading={loadingUpdateByHR}
                        type={type}
                        handleChange={this.handleChange}
                        handleRemoveDocument={this.removeNewField}
                        handleCheckAll={this.handleCheckAll}
                        processStatus={processStatus}
                        loadingUpdateByHR={loadingUpdateByHR}
                        disabled={this.disableEdit()}
                        checkBoxesData={data}
                        documentChecklistSetting={documentChecklistSetting}
                      />
                    );
                  }

                  return '';
                })}

              {(documentCLSTypeD?.data?.length > 0 ||
                processStatus === NEW_PROCESS_STATUS.DRAFT) && (
                <CollapseFieldsTypeD
                  certifications={documentCLSTypeD}
                  addCertification={this.addCertification}
                  changeCertification={this.handleChangeCertification}
                  removeCertification={this.removeCertification}
                  processStatus={processStatus}
                  // handleChange={this.handleChangeForD}
                  disabled={this.disableEdit()}
                />
              )}

              {(processStatus === NEW_PROCESS_STATUS.DRAFT ||
                documentCLSTByCountryTypeE.length > 0) && (
                <CollapseFieldsTypeE
                  handleChangeName={this.handleChangeNameBlockE}
                  handleCheck={this.handleCheckBlockE}
                  processStatus={processStatus}
                  removeBlockE={this.removeBlockE}
                  addBlockE={this.addBlockE}
                  disabled={this.disableEdit()}
                  previousEmployment={documentCLSTByCountryTypeE}
                  refresh={refreshBlockE}
                  handleCheckAll={this.handleCheckAllBlockE}
                />
              )}

              {this._renderBottomBar()}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent />

            {(processStatus === NEW_PROCESS_STATUS.DRAFT ||
              processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION) && (
              <SendEmail
                openModalEmail={openModalEmail}
                closeModalEmail={this.closeModalEmail}
                loading4={loading4}
                handleSendEmail={this.handleSendEmail}
                handleChangeEmail={this.handleChangeEmail}
                handleSendFormAgain={this.handleSendFormAgain}
                isSentEmail={isSentEmail}
                generateLink={generateLink}
                handleMarkAsDone={this.handleMarkAsDone}
                firstName={firstName}
                middleName={middleName}
                lastName={lastName}
                handleValueChange={this.handleValueChange}
                privateEmail={privateEmail}
                processStatusFilled={processStatus}
                processStatus={processStatus}
                filledDocumentVerification={filledDocumentVerification}
                valueToFinalOffer={valueToFinalOffer}
                changeValueToFinalOffer={this.changeValueToFinalOffer}
                dispatch={dispatch}
                candidate={candidate}
              />
            )}

            <Row>
              <MessageBox />
            </Row>
          </Col>
        </Row>
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={
            <ModalContentComponent
              closeModal={this.closeModal}
              isSentEmail={isSentEmail}
              isMarkAsDone={isMarkAsDone}
              tempData={tempData}
              privateEmail={privateEmail}
            />
          }
        />
      </div>
    );
  }
}
export default DocumentVerification;
