/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-param-reassign */
import { Button, Col, Row, Skeleton, Typography } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, PROCESS_STATUS } from '@/utils/onboarding';
import NoteComponent from '../../../NoteComponent';
import CloseCandidateModal from './components/CloseCandidateModal';
import CollapseField from './components/CollapseField';
import PreviousEmployment from './components/PreviousEmployment';
import styles from './index.less';

@connect(
  ({
    newCandidateForm: {
      tempData,
      tempData: { documentsByCandidate = [] } = {},
      data: {
        // documentsByCandidateRD = [],
        privateEmail = '',
        candidate = '',
        processStatus,
        workHistory = [],
      },
      currentStep,
      data = {},
    },
    loading,
  }) => ({
    tempData,
    documentsByCandidate,
    data,
    workHistory,
    privateEmail,
    candidate,
    currentStep,
    processStatus,
    loading1: loading.effects['newCandidateForm/sendDocumentStatusEffect'],
    loadingGetById: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)
class BackgroundRecheck extends Component {
  static getDerivedStateFromProps(props) {
    return {
      currentStep: props.currentStep,
    };
  }

  constructor(props) {
    super(props);
    // const {
    //   tempData: { backgroundRecheck: { documentList: docsListProp = [] } = {} } = {},
    // } = this.props;
    this.state = {
      docsList: [],
      feedbackStatus: '',
      openModal: false,
      modalTitle: '',
    };
  }

  componentDidMount = async () => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
    const { data: { _id = '' } = {} } = this.props;

    if (_id) {
      this.firstInit();
    }
  };

  componentDidUpdate = async (prevProps) => {
    const { docsList } = this.state;
    const { tempData: { documentsByCandidateRD = '' } = {}, data: { _id = '' } = {} } = this.props;

    if (_id && docsList.length === 0 && documentsByCandidateRD.length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        docsList: documentsByCandidateRD,
      });
    }

    const { dispatch, candidate, tempData: { documentsByCandidate = [] } = {} } = this.props;
    if (
      _id &&
      documentsByCandidate.length > 0 &&
      JSON.stringify(documentsByCandidate) !==
        JSON.stringify(prevProps.tempData.documentsByCandidate || [])
    ) {
      await dispatch({
        type: 'newCandidateForm/fetchWorkHistory',
        payload: {
          candidate,
          tenantId: getCurrentTenant(),
        },
      }).then((res) => {
        if (res.statusCode === 200) {
          this.processDocumentData(documentsByCandidate);
        }
      });
    }

    if (_id && _id !== prevProps.data._id) {
      this.firstInit();
    }
  };

  firstInit = async () => {
    const { dispatch, candidate, processStatus = '', documentsByCandidate = [] } = this.props;
    // const { PROVISIONAL_OFFER_DRAFT, SENT_PROVISIONAL_OFFERS, PENDING } = PROCESS_STATUS;
    const { PROFILE_VERIFICATION, DOCUMENT_VERIFICATION } = NEW_PROCESS_STATUS;

    if (documentsByCandidate.length > 0) {
      await dispatch({
        type: 'newCandidateForm/fetchWorkHistory',
        payload: {
          candidate,
          tenantId: getCurrentTenant(),
        },
      }).then((res) => {
        if (res.statusCode === 200) {
          this.processDocumentData(documentsByCandidate);
        }
      });
    }

    if (
      // processStatus === PROVISIONAL_OFFER_DRAFT ||
      // processStatus === SENT_PROVISIONAL_OFFERS ||
      // processStatus === PENDING
      processStatus === PROFILE_VERIFICATION ||
      processStatus === DOCUMENT_VERIFICATION
    ) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          // currentStep: 3,
          tenantId: getCurrentTenant(),
        },
      });
    }
  };

  processDocumentData = (documentList) => {
    const { workHistory = [], dispatch } = this.props;
    const groupA = [];
    const groupB = [];
    const groupC = [];
    const groupD = [];

    documentList.forEach((item) => {
      const { candidateGroup } = item;
      item.isValidated = true;
      switch (candidateGroup) {
        case 'A':
          groupA.push(item);
          break;
        case 'B':
          groupB.push(item);
          break;
        case 'C':
          groupC.push(item);
          break;
        case 'D':
          if (item.isCandidateUpload) item.displayName += '*';
          groupD.push(item);
          break;
        default:
          break;
      }
    });

    // const countGroupE = documentChecklistSetting.filter((doc) => doc.type === 'E').length || 0;
    let groupMultiE = [];

    groupMultiE = workHistory.map((em) => {
      let groupE = [];
      documentList.forEach((item) => {
        const { candidateGroup, employer } = item;
        item.isValidated = true;
        if (candidateGroup === 'E' && employer === em.employer) {
          groupE = [...groupE, item];
        }
      });
      return {
        type: 'E',
        name: 'Previous Employment',
        employer: em.employer,
        toPresent: em.toPresent,
        startDate: em.startDate,
        endDate: em.endDate,
        workHistoryId: em._id,
        data: [...groupE],
      };
    });

    const docsList = [
      { type: 'A', name: 'Identity Proof', data: [...groupA] },
      { type: 'B', name: 'Address Proof', data: [...groupB] },
      { type: 'C', name: 'Educational', data: [...groupC] },
      { type: 'D', name: 'Technical Certifications', data: [...groupD] },
      ...groupMultiE,
    ];

    this.setState({
      docsList,
    });

    dispatch({
      type: 'newCandidateForm/saveOrigin',
      payload: {
        documentsByCandidateRD: docsList,
      },
    });

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentsByCandidateRD: docsList,
      },
    });

    dispatch({
      type: 'newCandidateForm/updateBackgroundRecheck',
      payload: docsList,
    });
  };

  sendDocumentStatus = (doc) => {
    const { candidate = '', dispatch } = this.props;
    // const { verifiedDocs = [], resubmitDocs = [], ineligibleDocs = [] } = this.state;
    const { _id = '', candidateDocumentStatus = '' } = doc;
    let newCandidateDocumentStatus = 0;
    switch (candidateDocumentStatus) {
      case 'VERIFIED': {
        newCandidateDocumentStatus = 1;
        break;
      }
      case 'RE-SUBMIT': {
        newCandidateDocumentStatus = 2;
        break;
      }
      case 'INELIGIBLE': {
        newCandidateDocumentStatus = 3;
        break;
      }
      default: {
        break;
      }
    }
    dispatch({
      type: 'newCandidateForm/checkDocumentEffect',
      payload: {
        candidate,
        document: _id,
        candidateDocumentStatus: newCandidateDocumentStatus,
        tenantId: getCurrentTenant(),
      },
    });
  };

  handleVerifyDocuments = async () => {
    const { dispatch, candidate } = this.props;
    if (!dispatch) {
      return;
    }
    const res = await dispatch({
      type: 'newCandidateForm/sendDocumentStatusEffect',
      payload: {
        candidate,
        options: 2,
        tenantId: getCurrentTenant(),
      },
    });

    const { statusCode } = res;
    if (statusCode !== 200) {
      return;
    }
    this.setState({
      modalTitle: 'Sent re-submit mail to candidate',
      openModal: true,
    });
  };

  closeCandidate = async () => {
    const { dispatch, candidate } = this.props;
    if (!dispatch) {
      return;
    }
    const res = await dispatch({
      type: 'newCandidateForm/closeCandidate',
      payload: {
        candidate,
      },
    });
    const { statusCode } = res;
    if (statusCode !== 200) {
      return;
    }
    this.setState({
      modalTitle: 'Closed candidate',
      openModal: true,
    });
  };

  // handleCheckDocument = (event, indexGroupDoc, document) => {
  //   const { tempData, dispatch } = this.props;
  //   const { documentsByCandidateRD } = tempData;
  //   // const { documentsByCandidateRD, dispatch } = this.props;
  //   const candidateDocumentStatus = event.target.value;

  //   const docsByCandidateRDCheck = documentsByCandidateRD;

  //   const checkedDocument = {
  //     ...document,
  //     candidateDocumentStatus,
  //   };
  //   const typeIndex = docsByCandidateRDCheck.findIndex((item, index) => index === indexGroupDoc);
  //   const checkLength = docsByCandidateRDCheck[typeIndex].data.length;
  //   if (checkLength > 0) {
  //     const findIndexDoc = docsByCandidateRDCheck[typeIndex].data.findIndex(
  //       (doc) => doc._id === document._id,
  //     );
  //     docsByCandidateRDCheck[typeIndex].data[findIndexDoc] = checkedDocument;

  //     // ------------------- MODIFY
  //     const newDocumentList = [];
  //     docsByCandidateRDCheck.map((item) => {
  //       const { data = [] } = item;
  //       data.map((documentItem) => {
  //         newDocumentList.push(documentItem);
  //         return null;
  //       });
  //       return null;
  //     });

  //     if (newDocumentList.length === 0) {
  //       return;
  //     }
  //     let status = 'VERIFIED';
  //     const newVerifiedDocs = [];
  //     const newResubmitDocs = [];
  //     const newIneligibleDocs = [];

  //     newDocumentList.forEach((doc) => {
  //       const { candidateDocumentStatus: candidateDocStatus = '' } = doc;
  //       if (candidateDocStatus === 'RE-SUBMIT') {
  //         status = 'RE-SUBMIT';
  //         newResubmitDocs.push(doc);
  //         this.sendDocumentStatus(doc);
  //         return null;
  //       }
  //       if (candidateDocStatus === 'INELIGIBLE') {
  //         status = 'INELIGIBLE';
  //         newIneligibleDocs.push(doc);
  //         this.sendDocumentStatus(doc);
  //         return null;
  //       }
  //       newVerifiedDocs.push(doc);
  //       this.sendDocumentStatus(doc);
  //       return null;
  //     });

  //     // -------------------  END MODIFY
  //     this.setState({
  //       docsList: [...docsByCandidateRDCheck],
  //       feedbackStatus: status,
  //     });

  //     dispatch({
  //       type: 'newCandidateForm/saveOrigin',
  //       payload: {
  //         documentsByCandidateRD: docsByCandidateRDCheck,
  //       },
  //     });
  //   }
  // };

  renderCollapseFields = () => {
    const { docsList: documentsCandidateList = [] } = this.state;
    const { loadingGetById = false } = this.props;
    if (loadingGetById) {
      return <Skeleton active />;
    }

    return (
      <>
        {documentsCandidateList.map((document) => {
          if (document.type !== 'E') {
            return (
              <CollapseField
                item={document}
                // handleCheckDocument={this.handleCheckDocument}
              />
            );
          }
          return '';
        })}
        <PreviousEmployment
          docList={documentsCandidateList}
          // handleCheckDocument={this.handleCheckDocument}
        />
      </>
    );
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  onClickPrev = () => {
    // const { currentStep } = this.state;
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     currentStep: currentStep - 1,
    //   },
    // });
  };

  onClickNext = async () => {
    // const { currentStep } = this.state;
    const { dispatch, candidate } = this.props;

    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     currentStep: currentStep + 1,
    //   },
    // });

    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        // currentStep: currentStep + 1,
        processStatus: PROCESS_STATUS.ELIGIBLE_CANDIDATES,
      },
    });
  };

  _renderBottomBar = () => {
    // const { feedbackStatus } = this.state;
    const { docsList } = this.state;
    const checkStatus = this.checkStatus(docsList);
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col className={styles.bottomBar__button} span={24}>
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
                checkStatus !== 1 ? styles.bottomBar__button__disabled : ''
              }`}
              disabled={checkStatus !== 1}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  checkStatus = (docsListState) => {
    const newVerifiedDocs = [];
    const newResubmitDocs = [];
    const newIneligibleDocs = [];

    const docsListFilter = docsListState.map((item) => {
      const { data = [] } = item;
      let newData = [];
      data.forEach((doc) => {
        if (doc.isCandidateUpload) {
          newData = [...newData, doc];
        }
      });
      return {
        ...item,
        data: newData,
      };
    });

    const newDocumentList = [];
    docsListFilter.map((item) => {
      const { data = [] } = item;
      data.map((documentItem) => {
        newDocumentList.push(documentItem);
        return null;
      });
      return null;
    });

    newDocumentList.forEach((doc) => {
      const { candidateDocumentStatus: candidateDocStatus = '' } = doc;
      if (candidateDocStatus === 'RE-SUBMIT') {
        newResubmitDocs.push(doc);
      }
      if (candidateDocStatus === 'INELIGIBLE') {
        newIneligibleDocs.push(doc);
      }
      if (candidateDocStatus === 'VERIFIED') {
        newVerifiedDocs.push(doc);
      }
    });

    if (newVerifiedDocs.length > 0 && newVerifiedDocs.length === newDocumentList.length) {
      return 1;
    }
    if (newIneligibleDocs.length > 0) {
      return 3;
    }
    if (newResubmitDocs.length > 0) {
      return 2;
    }

    return 4;
  };

  render() {
    const { docsList, feedbackStatus, openModal, modalTitle } = this.state;
    const { privateEmail, loading1 } = this.props;
    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          The candidate must upload all required documents. And, the HR must approve the documents
          and mark candidate as eligible.
          <br />
          <br />
          Post this approval, the remaining processes will open for onboarding.
        </Typography.Text>
      ),
    };
    return (
      <div className={styles.backgroundRecheck}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <p className={styles.backgroundRecheck__title}>Document Verification</p>
            <p className={styles.backgroundRecheck__subTitle}>
              All documents supporting candidate's employment eligibility will be displayed here
            </p>
            <div className={styles.backgroundRecheck__left}>
              <>{this.renderCollapseFields()}</>
            </div>

            {this._renderBottomBar()}
          </Col>
          <Col className={styles.backgroundRecheck__right} xs={24} sm={24} md={24} lg={8} xl={8}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            {/* <Row className={styles.stepRow}>
              <Feedback checkStatus={this.checkStatus} docsList={docsList} />
            </Row> */}

            {/** //////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* {feedbackStatus === 'RE-SUBMIT' && (
              <Row className={styles.stepRow}>
                <SendEmail
                  title="Send final offer to the candidate"
                  formatMessage={formatMessage}
                  handleSendEmail={this.handleSendEmail}
                  isSentEmail={false}
                  privateEmail={privateEmail}
                  loading={loading1}
                  // email={privateEmail}
                />
              </Row>
            )} */}
            {/** //////////////////////////////////////////////////////////////////////////////////////////////////// */}

            {/* <Row className={styles.stepRow}>
              <button className={styles.close}>close candidature</button>
            </Row> */}
            {/* {feedbackStatus === 'INELIGIBLE' && (
              <Row className={styles.stepRow}>
                <div className={styles.closeWrapper}>
                  <h3>Acceptance of background check by HR</h3>
                  <p>The background check has been rejected by HR</p>
                  <button type="button" className={styles.close} onClick={this.closeCandidate}>
                    close candidature
                  </button>
                </div>
              </Row>
            )} */}
          </Col>
        </Row>

        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<CloseCandidateModal closeModal={this.closeModal} title={modalTitle} />}
        />
      </div>
    );
  }
}
export default BackgroundRecheck;
