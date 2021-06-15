/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Row, Col, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { map } from 'lodash';
import CustomModal from '@/components/CustomModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { AreaChartOutlined } from '@ant-design/icons';
import { TypedRule } from 'tslint/lib/rules';
import SendEmail from './components/SendEmail';
// import Warning from './components/Warning';
import NoteComponent from '../NoteComponent';
import Title from './components/Title';
import PROCESS_STATUS from '../utils';
import ModalContentComponent from './components/ModalContentComponent';
import CollapseFieldsType1 from './components/CollapseFieldsType1';
import CollapseFieldsType3 from './components/CollapseFieldsType3';
import CollapseFieldsType2 from './components/CollapseFieldsType2';

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
      previousEmployment: {},
      refreshBlockE: false,
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
    //     previousEmployment: {
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
        technicalCertifications = {},
        previousEmployment = {},
        candidate: candidateId = '',
        documentChecklistSetting = [],
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
    let originalArrE =
      arrToAdjust.length > 0 &&
      arrToAdjust.map((value) => {
        const { type = '', data: dataE = {} } = value;
        if (type === 'E') return dataE.map((x) => x);
        return null;
      });
    originalArrE = originalArrE.filter((value) => value !== null);
    this.setState({
      identityProof: arrToAdjust[0].data,
      addressProof: arrToAdjust[1].data,
      educational: arrToAdjust[2].data,
      previousEmployment: originalArrE,
    });

    // -----------------------------------------------------------------------------------------
    const arrA = arrToAdjust.length > 0 && arrToAdjust[0].data.filter((x) => x.value === true);
    const arrB = arrToAdjust.length > 0 && arrToAdjust[1].data.filter((x) => x.value === true);
    const arrC = arrToAdjust.length > 0 && arrToAdjust[2].data.filter((x) => x.value === true);
    const arrD = documentChecklistSetting.find((val) => val.type === 'D').data || [];

    let arrE =
      arrToAdjust.map((value) => {
        const { type = '', data: dataE = {} } = value;
        if (type === 'E') return dataE.filter((x) => x.value === true);
        return null;
      }) || [];

    arrE = arrE.filter((value) => value !== null);

    // GET 'EMPLOYER' FIELDS
    const employerData = arrToAdjust.filter((emp) => emp.type === 'E');

    // FINAL LIST OF CHECKED CHECKBOXES
    const listSelectedA = arrA.map((x) => x.alias);
    const listSelectedB = arrB.map((x) => x.alias);
    const listSelectedC = arrC.map((x) => x.alias);

    const listSelectedD = arrD.map((x) => x.alias);
    const listSelectedE = arrE.map((value) => value && value.map((x) => x.alias));

    const listSelectedEFinal = listSelectedE.map((value, index) => {
      return {
        employer: employerData[index].employer,
        checkedList: value,
        startDate: employerData[index].startDate,
        endDate: employerData[index].endDate,
        toPresent: employerData[index].toPresent,
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
        technicalCertifications: {
          ...technicalCertifications,
          checkedList: listSelectedD,
        },
        previousEmployment: {
          ...previousEmployment,
          poe: listSelectedEFinal,
        },
      },
    });

    // set first value for [newPoe - the final poe]
    this.setState({ newPoe: listSelectedEFinal });
  };

  handleUpdateByHR = (newPoeFinal, checkedListA, checkedListB, checkedListC, checkedListD) => {
    const { data, currentStep } = this.props;
    const { dispatch } = this.props;
    const { _id } = data;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      newPoeFinal,
      checkedListA,
      checkedListB,
      checkedListC,
      checkedListD,
    );
    console.log('documentChecklistSetting', documentChecklistSetting);

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
          technicalCertifications: { checkedList: checkedListD = [] } = {},
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
      this.handleUpdateByHR(newPoe, checkedList, checkedListB, checkedListC, checkedListD);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedList, checkedListC, checkedListD);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListB, checkedList, checkedListD);
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
          technicalCertifications: { checkedList: checkedListD = [] } = {},
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
      this.handleUpdateByHR(newPoe, checkedListNew, checkedListB, checkedListC, checkedListD);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListNew, checkedListC, checkedListD);
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
      this.handleUpdateByHR(newPoe, checkedListA, checkedListB, checkedListNew, checkedListD);
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

  // HANDLE CHANGE WHEN CLICK CHECKBOXES OF BLOCK E
  handleChangeForE = (checkedList, orderNumber, employerName, workDuration) => {
    // console.log('employerName', employerName);
    const { startDate = '', endDate = '', toPresent = false } = workDuration;
    const { dispatch } = this.props;
    const { newPoe: newPoeState } = this.state;
    let newPoeFinal = [];
    if (newPoeState.length < orderNumber) {
      const newPoe1 = newPoeState;
      const addPoe = {
        employer: employerName,
        startDate,
        endDate,
        toPresent,
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
              startDate,
              endDate,
              toPresent,
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
        previousEmployment: {
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
          technicalCertifications: { checkedList: checkedListD = [] } = {},
        },
      } = {},
    } = this.props;

    this.handleUpdateByHR(newPoeFinal, checkedListA, checkedListB, checkedListC, checkedListD);
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
        previousEmployment: {
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
          technicalCertifications: { checkedList: checkedListD = [] } = {},
        },
      } = {},
    } = this.props;
    this.handleUpdateByHR(newPoeFinal, checkedListA, checkedListB, checkedListC, checkedListD);
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
  generateDocumentCheckListSettings = (
    newPoeFinal,
    checkedListA,
    checkedListB,
    checkedListC,
    checkedListD,
  ) => {
    const { identityProof, addressProof, educational, previousEmployment } = this.state;

    // value for documentChecklistSetting field
    const arrA = this.generateForSendEmail(identityProof, checkedListA);
    const arrB = this.generateForSendEmail(addressProof, checkedListB);
    const arrC = this.generateForSendEmail(educational, checkedListC);

    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    }

    const arrD = checkedListD.map((val) => {
      return {
        key: camelize(val),
        alias: val,
        value: true,
      };
    });

    const arrE = newPoeFinal.map((value) => {
      const { checkedList = [] } = value;
      return this.generateForSendEmail(previousEmployment[0], checkedList);
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
      {
        type: 'D',
        name: 'Technical Certifications',
        data: arrD,
      },
    ];

    const documentChecklistSettingE = arrE.map((value, index) => {
      return {
        type: 'E',
        name: 'Previous Employment',
        employer: newPoeFinal[index].employer,
        startDate: newPoeFinal[index].startDate,
        endDate: newPoeFinal[index].endDate,
        toPresent: newPoeFinal[index].toPresent,
        data: value,
      };
    });

    // console.log('documentChecklistSettingE', documentChecklistSettingE);
    documentChecklistSetting = documentChecklistSetting.concat(documentChecklistSettingE);
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
          technicalCertifications: { checkedList: checkedListD = [] } = {},
        },
      } = {},
    } = this.props;

    const documentChecklistSetting = this.generateDocumentCheckListSettings(
      newPoe,
      checkedListA,
      checkedListB,
      checkedListC,
      checkedListD,
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
          refreshBlockE: true,
        });
        this.getDataFromServer();
        // refresh block D (IMPORTANT)
        setTimeout(() => {
          this.setState({
            refreshBlockE: false,
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

  // add/delete block E
  deleteBlockE = (findX) => {
    this.setState({
      refreshBlockE: true,
    });
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},

          previousEmployment: { poe = [] } = {},
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
        previousEmployment: {
          poe: newPoeAfterDeleted,
        },
      },
    });

    this.handleUpdateByHR(
      newPoeAfterDeleted,
      checkedListA,
      checkedListB,
      checkedListC,
      checkedListD,
    );

    // refresh block D (IMPORTANT)
    setTimeout(() => {
      this.setState({
        refreshBlockE: false,
      });
    }, 100);
  };

  addBlockE = () => {
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},

          previousEmployment: { poe = [] } = {},
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
        previousEmployment: {
          poe: newPoeAfterAdded,
        },
      },
    });
    this.handleUpdateByHR(newPoeAfterAdded, checkedListA, checkedListB, checkedListC, checkedListD);
  };

  // for block D
  addDocumentName = (name) => {
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},
          technicalCertifications = {},
          previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const newDocument = [...checkedListD, name];

    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    }

    const newDoc = {
      key: camelize(name),
      alias: name,
      value: true,
    };

    const newDocumentList = [...documentChecklistSetting];
    documentChecklistSetting.forEach((doc) => {
      if (doc.type === 'D') {
        doc.data.push(newDoc);
      }
    });

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting: newDocumentList,
        technicalCertifications: {
          ...technicalCertifications,
          checkedList: newDocument,
        },
      },
    });
    this.handleUpdateByHR(poe, checkedListA, checkedListB, checkedListC, newDocument);
  };

  removeDocumentName = (index) => {
    const {
      candidateInfo: {
        tempData: {
          identityProof: { checkedList: checkedListA = [] } = {},
          addressProof: { checkedList: checkedListB = [] } = {},
          educational: { checkedList: checkedListC = [] } = {},
          technicalCertifications: { checkedList: checkedListD = [] } = {},
          technicalCertifications = {},
          previousEmployment: { poe = [] } = {},
          documentChecklistSetting = [],
        },
      } = {},
      dispatch,
    } = this.props;

    const newDocument = [...checkedListD];
    newDocument.splice(index, 1);

    const newDocumentList = [...documentChecklistSetting];
    documentChecklistSetting.forEach((doc) => {
      if (doc.type === 'D') {
        doc.data.splice(index, 1);
      }
    });

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        documentChecklistSetting: newDocumentList,
        technicalCertifications: {
          ...technicalCertifications,
          checkedList: newDocument,
        },
      },
    });
    this.handleUpdateByHR(poe, checkedListA, checkedListB, checkedListC, newDocument);
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
          documentChecklistSetting = {},
          previousEmployment: { poe = [] } = {},
        },
        data: { privateEmail },
      } = {},
      processStatus,
      loading4,
      loadingUpdateByHR,
    } = this.props;

    const { openModal, identityProof, addressProof, educational, refreshBlockE } = this.state;
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
                documentList.length > 0 &&
                documentList.map((item) => {
                  const { type = '', name = '', data = [] } = item;
                  const title = `Type ${type}: ${name}`;
                  if (type !== 'D' && type !== 'E' && data.length !== 0) {
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
                  return '';
                })}

              {documentChecklistSetting.map((item) => {
                const { type = '', name = '' } = item;
                const title = `Type ${type}: ${name}`;

                if (type === 'D') {
                  return (
                    <CollapseFieldsType3
                      title={title}
                      item={item}
                      addDocumentName={this.addDocumentName}
                      removeDocumentName={this.removeDocumentName}
                      // handleChange={this.handleChangeForD}
                      disabled={this.disableEdit()}
                    />
                  );
                }

                return '';
              })}

              {poe.length !== 0 && // only render when poe has already got the data
                documentList.length > 0 &&
                documentList.map((item) => {
                  const { type = '', name = '', data = [] } = item;
                  const title = `Type ${type}: ${name}`;

                  if (type === 'E') {
                    return refreshBlockE ? (
                      <div className={styles.refreshBlockE}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <CollapseFieldsType2
                        title={title}
                        item={item}
                        checkBoxesData={data}
                        handleChange={this.handleChangeForE}
                        handleCheckAll={this.handleCheckAll}
                        processStatus={processStatus}
                        hasAddEmployerDetail={this.hasAddEmployerDetail}
                        handleEmployerName={this.handleEmployerName}
                        deleteBlockE={this.deleteBlockE}
                        addBlockE={this.addBlockE}
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
