/* eslint-disable no-param-reassign */
import CustomModal from '@/components/CustomModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
// import Warning from './components/Warning';
import { Button, Col, notification, Row, Typography } from 'antd';
import { map } from 'lodash';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import NoteComponent from '../NoteComponent';
import CollapseFieldsTypeABC from './components/CollapseFieldsTypeABC';
import CollapseFieldsTypeD from './components/CollapseFieldsTypeD';
import CollapseFieldsTypeE from './components/CollapseFieldsTypeE';
import ModalContentComponent from './components/ModalContentComponent';
import SendEmail from './components/SendEmail';
import { Page } from '../../utils';
import Title from './components/Title';
import styles from './styles.less';

const note = {
  title: 'Note',
  data: (
    <>
      <Typography.Text>
        The candidate must upload all required documents. And, the<span> HR must approve </span>the
        documents and mark candidate as eligible.
      </Typography.Text>
      <br />
      <Typography.Paragraph className={styles.boldText}>
        Post this approval, the remaining processes will open for onboarding.
      </Typography.Paragraph>
    </>
  ),
};
const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};
@connect(
  ({
    candidateInfo,
    loading,
    candidateInfo: { tempData, checkMandatory, data, tableData, currentStep },
  }) => ({
    tempData,
    data,
    tableData,
    currentStep,
    checkMandatory,
    candidateInfo,
    loading4: loading.effects['candidateInfo/submitPhase1Effect'],
    loadingUpdateByHR: loading.effects['candidateInfo/updateByHR'],
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
    };
  }

  // HMMMM
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
    const {
      dispatch,
      data: { candidate },
    } = this.props;
    this.getDataFromServer();
    this.checkBottomBar();
    window.scrollTo({ top: 77, behavior: 'smooth' });
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        pageName: Page.Eligibility_documents,
        candidate,
        data: {},
      },
    });
  };

  componentWillUnmount() {
    const { dispatch, tempData = {}, processStatus = [] } = this.props;
    if (processStatus === 'SENT-PROVISIONAL-OFFER') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          ...tempData,
          checkValidation: undefined,
          isSentEmail: true,
        },
      });
    } else if (processStatus === 'DRAFT') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          ...tempData,
          checkValidation: undefined,
          isSentEmail: false,
        },
      });
    }

    // dispatch({
    //   type: 'candidateInfo/saveTemp',
    //   payload: {
    //     previousEmployment: {
    //       poe: [],
    //     },
    //   },
    // });
    // this.handleUpdateByHR();
  }

  componentDidUpdate = (prevProps) => {
    const { tempData: { documentChecklistSetting = [] } = {}, dispatch } = this.props;

    if (
      JSON.stringify(prevProps.tempData.documentChecklistSetting) !==
      JSON.stringify(documentChecklistSetting)
    ) {
      let validation = true;
      documentChecklistSetting.forEach((item) => {
        if (item.type === 'D') {
          const aliases = item.data
            .map((v) => v.alias)
            .filter((f) => f !== null && f !== undefined && f !== '');
          if (aliases.length !== item.data.length) validation = false;
        }
        if (item.type === 'E') {
          if (!item.employer) validation = false;
        }
      });

      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: validation,
        },
      });
    }
  };

  // GET DATA FROM SERVER
  getDataFromServer = () => {
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
    const { candidate = '', processStatus } = data;
    const { privateEmail } = tempData;
    const { PROVISIONAL_OFFER_DRAFT, SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;

    if (processStatus === PROVISIONAL_OFFER_DRAFT || processStatus === SENT_PROVISIONAL_OFFERS) {
      if (dispatch && candidate) {
        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep: 3,
            privateEmail,
            tenantId: getCurrentTenant(),
          },
        });
      }
    }

    const arrToAdjust =
      processStatus === 'DRAFT'
        ? JSON.parse(JSON.stringify(data.documentChecklistSetting))
        : JSON.parse(JSON.stringify(tempData.documentChecklistSetting));

    // console.log('arrToAdjust', arrToAdjust);
    // const arrToAdjust = JSON.parse(JSON.stringify(data.documentChecklistSetting));

    // -----------------------------------------------------------------------------------------
    // initial value for send email/generate link
    // let originalArrE =
    //   arrToAdjust.length > 0 &&
    //   arrToAdjust.map((value) => {
    //     const { type = '', data: dataE = {} } = value;
    //     if (type === 'E') return dataE.map((x) => x);
    //     return null;
    //   });
    // originalArrE = originalArrE.filter((value) => value !== null);
    this.setState({
      identityProof: arrToAdjust[0].data,
      addressProof: arrToAdjust[1].data,
      educational: arrToAdjust[2].data,
      // previousEmployment: originalArrE,
    });

    // -----------------------------------------------------------------------------------------
    const arrA = arrToAdjust.length > 0 && arrToAdjust[0].data.filter((x) => x.value === true);
    const arrB = arrToAdjust.length > 0 && arrToAdjust[1].data.filter((x) => x.value === true);
    const arrC = arrToAdjust.length > 0 && arrToAdjust[2].data.filter((x) => x.value === true);
    // const arrD = documentChecklistSetting.find((val) => val.type === 'D')?.data || [];

    // let arrE =
    //   arrToAdjust.map((value) => {
    //     const { type = '', data: dataE = {} } = value;
    //     if (type === 'E') return dataE.filter((x) => x.value === true);
    //     return null;
    //   }) || [];

    // arrE = arrE.filter((value) => value !== null);

    // GET 'EMPLOYER' FIELDS
    // const employerData = arrToAdjust.filter((emp) => emp.type === 'E');

    // FINAL LIST OF CHECKED CHECKBOXES
    const listSelectedA = arrA.map((x) => x.alias);
    const listSelectedB = arrB.map((x) => x.alias);
    const listSelectedC = arrC.map((x) => x.alias);

    // const listSelectedD = arrD.map((x) => x.alias);
    // const listSelectedE = arrE.map((value) => value && value.map((x) => x.alias));

    // const listSelectedEFinal = listSelectedE.map((value, index) => {
    //   return {
    //     employer: employerData[index].employer,
    //     checkedList: value,
    //     startDate: employerData[index].startDate,
    //     endDate: employerData[index].endDate,
    //     toPresent: employerData[index].toPresent,
    //   };
    // });
    // SAVE TO REDUX
    dispatch({
      type: 'candidateInfo/saveTemp',
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
        // technicalCertifications: {
        //   ...technicalCertifications,
        //   checkedList: listSelectedD,
        // },
        // previousEmployment: {
        //   ...previousEmployment,
        //   poe: listSelectedEFinal,
        // },
      },
    });

    // set first value for [newPoe - the final poe]
    // this.setState({ newPoe: listSelectedEFinal });
  };

  handleUpdateByHR = (docsListE, checkedListA, checkedListB, checkedListC, docsListD) => {
    const { data, currentStep } = this.props;
    const { dispatch } = this.props;
    const { _id } = data;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      docsListE,
      checkedListA,
      checkedListB,
      checkedListC,
      docsListD,
    );
    // console.log('documentChecklistSetting', documentChecklistSetting);

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate: _id,
        documentChecklistSetting,
        currentStep,
        tenantId: getCurrentTenant(),
      },
    });
  };

  // SEND FORM VIA EMAIL AGAIN
  handleSendFormAgain = () => {
    const { dispatch } = this.props;
    const { tempData: { isSentEmail } = {} } = this.state;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        isSentEmail: !isSentEmail,
      },
    });
    this.setState({ openModalEmail: true });
  };

  disableEdit = () => {
    const {
      data: { processStatus = '' },
    } = this.props;
    // PROVISIONAL_OFFER_DRAFT
    const { FINAL_OFFERS_DRAFT, SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;
    if (processStatus === FINAL_OFFERS_DRAFT || processStatus === SENT_PROVISIONAL_OFFERS) {
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
      candidateInfo: {
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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
      candidateInfo: {
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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

  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK D
  // handleChangeForD = (list) => {
  //   const { newPoe } = this.state;

  //   const {
  //     candidateInfo: {
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
  //     type: 'candidateInfo/saveTemp',
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
    const { SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;
    if (e.target.value === 1) {
      if (processStatus === SENT_PROVISIONAL_OFFERS) {
        notification.warning({
          message: 'Waiting for candidate to upload the required documents.',
        });
      } else {
        dispatch({
          type: 'candidateInfo/save',
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
        type: 'candidateInfo/save',
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

  checkBottomBar = () => {
    const {
      tempData: { valueToFinalOffer, checkStatus },
      checkMandatory,
      dispatch,
    } = this.props;
    if (valueToFinalOffer === 1) {
      checkStatus.filledDocumentVerification = true;
      // console.log('a');
    } else {
      checkStatus.filledDocumentVerification = false;
      // console.log('b');
    }
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledDocumentVerification: checkStatus.filledDocumentVerification,
        },
      },
    });
  };

  // added
  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledDocumentVerification } = checkMandatory;
    return !filledDocumentVerification ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    // const { checkMandatory } = this.props;
    // const { filledDocumentVerification } = checkMandatory;
    // console.log(filledDocumentVerification);
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
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
                className={`${styles.bottomBar__button__primary} `}
                // ${
                //   !filledDocumentVerification ? styles.bottomBar__button__disabled : ''
                // }

                // disabled={!filledDocumentVerification}
              >
                Send
              </Button>
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

    documentCLS = documentCLS.concat(docsListD);
    documentCLS = documentCLS.concat(docsListE);

    // const documentChecklistSettingE = docsListE.map((value) => {
    //   return {
    //     ...value,
    //   };
    // });

    return documentCLS;
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
      } = {},
    } = this.props;

    const {
      candidateInfo: {
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

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      docsListE,
      checkedListA,
      checkedListB,
      checkedListC,
      docsListD,
    );

    dispatch({
      type: 'candidateInfo/saveTemp',
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
      employeeType: employeeType._id,
      department: department._id,
      title: title._id,
      workLocation: workLocation._id,
      reportingManager: reportingManager._id,
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

    await dispatch({
      type: 'candidateInfo/submitPhase1Effect',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: type !== 'generate-link',
          openModalEmail: type === 'generate-link',
        });
        this.getDataFromServer();

        dispatch({
          type: 'candidateInfo/saveTemp',
          payload: {
            isMarkAsDone: type === 'generate-link',
            isSentEmail: type !== 'generate-link',
          },
        });
      }
    });
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        checkValidation: true,
      },
    });

    return 'DONE';
  };

  handleValueChange = (e) => {
    const { dispatch } = this.props;
    const value = Object.values(e).find((x) => x);
    dispatch({
      type: 'candidateInfo/saveTemp',
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
      type: 'candidateInfo/generateLink',
      payload: {
        candidate,
        firstName,
        privateEmail,
      },
    });
    if (link.statusCode === 200) {
      // setGeneratedLink(link.data.url);
      dispatch({
        type: 'candidateInfo/saveTemp',
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
    const { currentStep } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  onClickNext = () => {
    const { currentStep, dispatch } = this.props;
    const { checkRadioSendMail } = this.state;
    if (checkRadioSendMail === 0) {
      this.setState({ openModalEmail: true });
    } else {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          currentStep: currentStep + 1,
          valueToFinalOffer: 1,
        },
      });
    }
  };

  // for block E
  addBlockE = () => {
    const {
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting: newDocumentList,
      },
    });
    this.handleUpdateByHR(docsListE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  handleChangeNameBlockE = (value, index) => {
    const {
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting: [...documentCLSTypeOthers, ...documentCLSTypeE],
      },
    });
    this.handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  handleCheckBlockE = (list, checkedList, index) => {
    const {
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting: [...documentCLSTypeOthers, ...documentCLSTypeE],
      },
    });
    this.handleUpdateByHR(documentCLSTypeE, checkedListA, checkedListB, checkedListC, docsListD);
  };

  removeBlockE = (index) => {
    this.setState({ refreshBlockE: true });
    const {
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
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
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
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
      candidateInfo: {
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
            value: false,
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
      type: 'candidateInfo/saveTemp',
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
      candidateInfo: {
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
      type: 'candidateInfo/saveTemp',
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
    const { tempData = {} } = this.props;
    const { workLocation = {} } = tempData;

    if (workLocation) {
      return list.map((item) => {
        const { data = [] } = item;
        const newData = data.filter(({ country = [] }) => {
          return (
            country.includes(workLocation?.headQuarterAddress?.country?._id) ||
            country.includes(workLocation?.headQuarterAddress?.country) ||
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
      candidateInfo: {
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument, docsListD);
    }
  };

  removeNewField = async (key, type) => {
    const {
      candidateInfo: {
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
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
        type: 'candidateInfo/saveTemp',
        payload,
      });
      this.handleUpdateByHR(docsListE, checkedListA, checkedListB, newDocument, docsListD);
    }
  };

  // main
  render() {
    const { refreshBlockE } = this.state;
    const {
      dispatch,
      candidateInfo: {
        tempData,
        tempData: {
          isSentEmail,
          generateLink,
          firstName,
          middleName,
          lastName,
          valueToFinalOffer,
          checkValidation,
          isMarkAsDone,
          documentChecklistSetting = [],
        },
        data: { privateEmail, processStatus: processStatusFilled = '', candidate = '' },
      } = {},
      processStatus,
      loading4,
      loadingUpdateByHR,
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

    return (
      <div>
        <Row gutter={[24, 0]} className={styles.DocumentVerification}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              {/* <Warning formatMessage={formatMessage} /> */}
              <Title />
              {identityProof.length > 0 &&
                addressProof.length > 0 &&
                educational.length > 0 &&
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

              <CollapseFieldsTypeD
                certifications={documentCLSTypeD}
                addCertification={this.addCertification}
                changeCertification={this.handleChangeCertification}
                removeCertification={this.removeCertification}
                processStatus={processStatus}
                // handleChange={this.handleChangeForD}
                disabled={this.disableEdit()}
              />

              <CollapseFieldsTypeE
                handleChangeName={this.handleChangeNameBlockE}
                handleCheck={this.handleCheckBlockE}
                processStatus={processStatus}
                removeBlockE={this.removeBlockE}
                addBlockE={this.addBlockE}
                disabled={this.disableEdit()}
                previousEmployment={documentCLSTByCountryTypeE}
                refresh={refreshBlockE}
              />
              <div className={styles.bottomBar} style={{ marginBottom: '20px' }}>
                <Row>
                  <Col>
                    <RenderAddQuestion />
                  </Col>
                </Row>
              </div>
              {this._renderBottomBar()}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={note} />

            {processStatus === PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT ||
            processStatusFilled === PROCESS_STATUS.SENT_PROVISIONAL_OFFERS ? (
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
                processStatusFilled={processStatusFilled}
                processStatus={processStatusFilled}
                checkValidation={checkValidation}
                valueToFinalOffer={valueToFinalOffer}
                changeValueToFinalOffer={this.changeValueToFinalOffer}
                dispatch={dispatch}
                candidate={candidate}
              />
            ) : (
              ''
            )}
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
