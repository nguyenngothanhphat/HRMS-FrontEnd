/* eslint-disable no-param-reassign */
import CustomModal from '@/components/CustomModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Button, Col, Row, Spin, Typography } from 'antd';
import { map } from 'lodash';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import NoteComponent from '../NoteComponent';
import PROCESS_STATUS from '../utils';
import CollapseFieldsType1 from './components/CollapseFieldsType1';
import CollapseFieldsType2 from './components/CollapseFieldsType2';
import ModalContentComponent from './components/ModalContentComponent';
import SendEmail from './components/SendEmail';
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
class BackgroundCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      newPoe: [],
      identityProof: {},
      addressProof: {},
      educational: {},
      technicalCertification: {},
      refreshBlockD: false,
      // documentChecklistSetting: {},
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
    this.getDataFromServer();
    this.checkBottomBar();
    window.scrollTo({ top: 77, behavior: 'smooth' });
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
    //     technicalCertification: {
    //       poe: [],
    //     },
    //   },
    // });
    // this.handleUpdateByHR();
  }

  // GET DATA FROM SERVER
  getDataFromServer = () => {
    const {
      data = {},
      tempData: {
        identityProof = {},
        addressProof = {},
        educational = {},
        technicalCertification = {},
        // candidate: candidateId = '',
      },
      tempData,
      dispatch,
    } = this.props;

    // save step
    const { candidate = '', processStatus } = data;
    const { PROVISIONAL_OFFER_DRAFT, SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;

    if (processStatus === PROVISIONAL_OFFER_DRAFT || processStatus === SENT_PROVISIONAL_OFFERS) {
      if (dispatch && candidate) {
        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep: 3,
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
    let originalArrD =
      arrToAdjust.length > 0 &&
      arrToAdjust.map((value) => {
        const { type = '', data: dataD = {} } = value;
        if (type === 'D') return dataD.map((x) => x);
        return null;
      });
    originalArrD = originalArrD.filter((value) => value !== null);
    this.setState({
      identityProof: arrToAdjust[0].data,
      addressProof: arrToAdjust[1].data,
      educational: arrToAdjust[2].data,
      technicalCertification: originalArrD,
    });

    // -----------------------------------------------------------------------------------------
    const arrA = arrToAdjust.length > 0 && arrToAdjust[0].data.filter((x) => x.value === true);
    const arrB = arrToAdjust.length > 0 && arrToAdjust[1].data.filter((x) => x.value === true);
    const arrC = arrToAdjust.length > 0 && arrToAdjust[2].data.filter((x) => x.value === true);

    let arrD =
      arrToAdjust.length > 0 &&
      arrToAdjust.map((value) => {
        const { type = '', data: dataD = {} } = value;
        if (type === 'D') return dataD.filter((x) => x.value === true);
        return null;
      });

    arrD = arrD.filter((value) => value !== null);

    // GET 'EMPLOYER' FIELDS
    let employerName = arrToAdjust.map((value) => {
      const { type = '', employer = '' } = value;
      if (type === 'D') return employer;
      return null;
    });
    employerName = employerName.filter((value) => value !== null);

    // FINAL LIST OF CHECKED CHECKBOXES
    const listSelectedA = arrA.map((x) => x.alias);
    const listSelectedB = arrB.map((x) => x.alias);
    const listSelectedC = arrC.map((x) => x.alias);
    const listSelectedD = arrD.map((value) => value && value.map((x) => x.alias));

    const listSelectedDFinal = listSelectedD.map((value, index) => {
      return {
        employer: employerName[index],
        checkedList: value,
      };
    });

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
        technicalCertification: {
          ...technicalCertification,
          poe: listSelectedDFinal,
        },
      },
    });

    // set first value for [newPoe - the final poe]
    this.setState({ newPoe: listSelectedDFinal });
  };

  handleUpdateByHR = (newPoeFinal, checkedListA, checkedListB, checkedListC) => {
    const { data, currentStep } = this.props;
    const { dispatch } = this.props;
    const { _id } = data;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      newPoeFinal,
      checkedListA,
      checkedListB,
      checkedListC,
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
    const { tempData, newPoe } = this.state;
    const { type = '' } = item;

    const { identityProof = {}, addressProof = {}, educational = {} } = tempData;

    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
        },
      } = {},
    } = this.props;

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
      this.handleUpdateByHR(newPoe, checkedList, checkedListB, checkedListC);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedList, checkedListC);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListB, checkedList);
    }
  };

  // HANDLE CHANGE WHEN CLICK ALL CHECKBOXES OF BLOCK A,B,C
  handleCheckAll = (e, checkedList, item) => {
    const { tempData, newPoe } = this.state;
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
        },
      } = {},
    } = this.props;

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
      this.handleUpdateByHR(newPoe, checkedListNew, checkedListB, checkedListC);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListNew, checkedListC);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListB, checkedListNew);
    }
  };

  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK D
  handleChangeForD = (checkedList, orderNumber, employerName, workDuration) => {
    // console.log('employerName', employerName);
    const { dispatch } = this.props;
    const { newPoe: newPoeState } = this.state;
    let newPoeFinal = [];
    if (newPoeState.length < orderNumber) {
      const newPoe1 = newPoeState;
      const addPoe = {
        employer: employerName,
        workDuration,
        checkedList,
      };
      newPoe1.push(addPoe);
      newPoeFinal = newPoe1;
    } else {
      const newPoe1 = newPoeState.map((value, index) =>
        orderNumber === index + 1
          ? {
              ...value,
              employer: employerName,
              checkedList,
              workDuration,
            }
          : value,
      );
      newPoeFinal = newPoe1;
    }
    this.setState({
      newPoe: newPoeFinal,
    });
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        technicalCertification: {
          poe: newPoeFinal,
        },
      },
    });

    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
        },
      } = {},
    } = this.props;

    this.handleUpdateByHR(newPoeFinal, checkedListA, checkedListB, checkedListC);
  };

  // HANDLE EMPLOYER NAME CHANGES
  handleEmployerName = (employerName, orderNumber) => {
    const { dispatch } = this.props;
    const { newPoe: newPoeState } = this.state;
    let newPoeFinal = [];

    const newPoe1 = newPoeState.map((value, index) =>
      orderNumber === index + 1
        ? {
            ...value,
            employer: employerName,
          }
        : value,
    );
    newPoeFinal = newPoe1;
    this.setState({
      newPoe: newPoeFinal,
    });

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        technicalCertification: {
          poe: newPoeFinal,
        },
      },
    });

    if (employerName.length > 0) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: false,
        },
      });
    }
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
        },
      } = {},
    } = this.props;
    this.handleUpdateByHR(newPoeFinal, checkedListA, checkedListB, checkedListC);
  };

  changeValueToFinalOffer = (e) => {
    const { dispatch, tempData, checkMandatory } = this.props;
    // console.log('e', e.target.value);
    if (e.target.value === 1) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            valueToFinalOffer: 1,
          },
          checkMandatory: {
            ...checkMandatory,
            filledBackgroundCheck: true,
          },
        },
      });
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
            filledBackgroundCheck: false,
          },
        },
      });
    }
  };

  checkBottomBar = () => {
    const {
      tempData: { valueToFinalOffer, checkStatus },
      checkMandatory,
      dispatch,
    } = this.props;
    if (valueToFinalOffer === 1) {
      checkStatus.filledBackgroundCheck = true;
      // console.log('a');
    } else {
      checkStatus.filledBackgroundCheck = false;
      // console.log('b');
    }
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledBackgroundCheck: checkStatus.filledBackgroundCheck,
        },
      },
    });
  };

  // added
  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledBackgroundCheck } = checkMandatory;
    return !filledBackgroundCheck ? (
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
    const { checkMandatory } = this.props;
    const { filledBackgroundCheck } = checkMandatory;
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
                className={`${styles.bottomBar__button__primary} ${
                  !filledBackgroundCheck ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBackgroundCheck}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
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
  generateDocumentCheckListSettings = (newPoeFinal, checkedListA, checkedListB, checkedListC) => {
    const { identityProof, addressProof, educational, technicalCertification } = this.state;

    // value for documentChecklistSetting field
    const arrA = this.generateForSendEmail(identityProof, checkedListA);
    const arrB = this.generateForSendEmail(addressProof, checkedListB);
    const arrC = this.generateForSendEmail(educational, checkedListC);
    const arrD = newPoeFinal.map((value) => {
      const { checkedList = [] } = value;
      return this.generateForSendEmail(technicalCertification[0], checkedList);
    });

    const employerNameD = newPoeFinal.map((value) => {
      const { employer = [] } = value;
      return employer;
    });

    let documentChecklistSetting = [
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
    const documentChecklistSettingD = arrD.map((value, index) => {
      return {
        type: 'D',
        name: 'Technical Certifications',
        employer: employerNameD[index],
        data: value,
      };
    });

    // console.log('documentChecklistSettingD', documentChecklistSettingD);
    documentChecklistSetting = documentChecklistSetting.concat(documentChecklistSettingD);
    return documentChecklistSetting;
  };

  // EMAILS
  handleSendEmail = () => {
    const { dispatch } = this.props;
    const { newPoe } = this.state;

    const {
      tempData: {
        department,
        workLocation,
        reportingManager,
        title,
        employeeType,
        _id,
        fullName,
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
        },
      } = {},
    } = this.props;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      newPoe,
      checkedListA,
      checkedListB,
      checkedListC,
    );

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting,
      },
    });

    const payload = {
      candidate: _id,
      fullName,
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

    dispatch({
      type: 'candidateInfo/submitPhase1Effect',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: true,
          refreshBlockD: true,
        });
        this.getDataFromServer();
        // refresh block D (IMPORTANT)
        setTimeout(() => {
          this.setState({
            refreshBlockD: false,
          });
        }, 100);

        dispatch({
          type: 'candidateInfo/saveTemp',
          payload: {
            isMarkAsDone: false,
            isSentEmail: true,
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
  };

  handleValueChange = (e) => {
    const { dispatch } = this.props;
    const value = Object.values(e).find((x) => x);
    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        privateEmail: value,
      },
    });
  };

  handleMarkAsDone = (user) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        generateLink: user.generateLink,
        isMarkAsDone: true,
      },
    });
    this.setState({
      openModal: true,
    });
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
    const { currentStep } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
        valueToFinalOffer: 1,
      },
    });
  };

  // if clicking on ADD EMPLOYER DETAILS button, add a new object of newPoe
  hasAddEmployerDetail = () => {
    const { newPoe } = this.state;
    const newPoe1 = newPoe.concat(newPoe[0]);
    this.setState({
      newPoe: newPoe1,
    });
  };

  // add/delete block D
  deleteBlockD = (findX) => {
    this.setState({
      refreshBlockD: true,
    });
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertification: { poe = [] } = {},
        },
      } = {},
      dispatch,
    } = this.props;

    const newPoeAfterDeleted = poe.filter((value, index) => index + 1 !== findX);
    // console.log('newPoeAfterDeleted', newPoeAfterDeleted);

    this.setState({
      newPoe: newPoeAfterDeleted,
    });

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        technicalCertification: {
          poe: newPoeAfterDeleted,
        },
      },
    });

    this.handleUpdateByHR(newPoeAfterDeleted, checkedListA, checkedListB, checkedListC);

    // refresh block D (IMPORTANT)
    setTimeout(() => {
      this.setState({
        refreshBlockD: false,
      });
    }, 100);
  };

  addBlockD = () => {
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertification: { poe = [] } = {},
        },
      } = {},
      dispatch,
    } = this.props;
    const newElement = {
      employer: '',
      checkedList: [],
    };
    const newPoeAfterAdded = poe.concat(newElement);
    this.setState({
      newPoe: newPoeAfterAdded,
    });
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        technicalCertification: {
          poe: newPoeAfterAdded,
        },
      },
    });
    this.handleUpdateByHR(newPoeAfterAdded, checkedListA, checkedListB, checkedListC);
  };

  // main
  render() {
    const {
      candidateInfo: {
        tempData,
        tempData: {
          documentList,
          isSentEmail,
          generateLink,
          fullName,
          valueToFinalOffer,
          checkValidation,
          isMarkAsDone,

          technicalCertification: { poe = [] } = {},
        },
        data: { privateEmail },
      } = {},
      processStatus,
      loading4,
      loadingUpdateByHR,
    } = this.props;

    const { openModal, identityProof, addressProof, educational, refreshBlockD } = this.state;
    return (
      <div>
        <Row gutter={[24, 0]} className={styles.BackgroundCheckNew}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              {/* <Warning formatMessage={formatMessage} /> */}
              <Title />
              {identityProof.length > 0 &&
                addressProof.length > 0 &&
                educational.length > 0 &&
                poe.length !== 0 && // only render when poe has already got the data
                documentList.length > 0 &&
                documentList.map((item) => {
                  const { type = '', name = '', data = [] } = item;
                  const title = `Type ${type}: ${name}`;
                  if (type !== 'D' && data.length !== 0) {
                    return (
                      <CollapseFieldsType1
                        title={title}
                        item={item}
                        checkBoxesData={data}
                        handleChange={this.handleChange}
                        handleCheckAll={this.handleCheckAll}
                        processStatus={processStatus}
                        loadingUpdateByHR={loadingUpdateByHR}
                        disabled={this.disableEdit()}
                      />
                    );
                  }
                  if (type === 'D') {
                    return refreshBlockD ? (
                      <div className={styles.refreshBlockD}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <CollapseFieldsType2
                        title={title}
                        item={item}
                        checkBoxesData={data}
                        handleChange={this.handleChangeForD}
                        handleCheckAll={this.handleCheckAll}
                        processStatus={processStatus}
                        hasAddEmployerDetail={this.hasAddEmployerDetail}
                        handleEmployerName={this.handleEmployerName}
                        deleteBlockD={this.deleteBlockD}
                        addBlockD={this.addBlockD}
                        disabled={this.disableEdit()}
                      />
                    );
                  }
                  return '';
                })}

              {this._renderBottomBar()}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={note} />
            {processStatus === 'DRAFT' && (
              <SendEmail
                loading4={loading4}
                handleSendEmail={this.handleSendEmail}
                handleChangeEmail={this.handleChangeEmail}
                handleSendFormAgain={this.handleSendFormAgain}
                isSentEmail={isSentEmail}
                generateLink={generateLink}
                handleMarkAsDone={this.handleMarkAsDone}
                fullName={fullName}
                handleValueChange={this.handleValueChange}
                privateEmail={privateEmail}
                processStatus={processStatus}
                checkValidation={checkValidation}
                valueToFinalOffer={valueToFinalOffer}
                changeValueToFinalOffer={this.changeValueToFinalOffer}
              />
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
export default BackgroundCheck;
