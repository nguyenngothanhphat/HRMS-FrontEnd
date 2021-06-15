/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import { Row, Col, Typography, Skeleton, Button } from 'antd';
import { formatMessage, connect } from 'umi';
import CustomModal from '@/components/CustomModal';
import { getCurrentTenant } from '@/utils/authority';
import NoteComponent from '../NoteComponent';
import Feedback from './components/Feedback';
import CollapseField from './components/CollapseField';
import styles from './index.less';
import SendEmail from '../PreviewOffer/components/SendEmail';
import CloseCandidateModal from './components/CloseCandidateModal';
import PROCESS_STATUS from '../utils';

@connect(
  ({
    candidateInfo: {
      tempData,
      data: {
        // documentsByCandidate = [],
        // documentsByCandidateRD = [],
        privateEmail = '',
        candidate = '',
        processStatus,
      },
      currentStep,
    },
    loading,
  }) => ({
    tempData,
    privateEmail,
    candidate,
    currentStep,
    processStatus,
    loading1: loading.effects['candidateInfo/sendDocumentStatusEffect'],
    loadingGetById: loading.effects['candidateInfo/fetchCandidateByRookie'],
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
      resubmitDocs: [],
      ineligibleDocs: [],
      verifiedDocs: [],
      openModal: false,
      modalTitle: '',
    };
  }

  componentDidMount() {
    const { dispatch, candidate, processStatus = '' } = this.props;
    const { PROVISIONAL_OFFER_DRAFT, SENT_PROVISIONAL_OFFERS, PENDING } = PROCESS_STATUS;
    const { tempData: { backgroundRecheck: { documentList: docsListProp = [] } = {} } = {} } =
      this.props;

    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    this.setState({
      docsList: docsListProp,
    });
    // this.processDocumentData(docsListProp);

    if (
      processStatus === PROVISIONAL_OFFER_DRAFT ||
      processStatus === SENT_PROVISIONAL_OFFERS ||
      processStatus === PENDING
    ) {
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

  componentDidUpdate() {
    const { docsList } = this.state;
    const { tempData: { documentsByCandidateRD = '' } = {} } = this.props;
    // if (!prevProps.tempData.documentsByCandidateRD && documentsByCandidateRD) {
    if (docsList.length === 0 && documentsByCandidateRD.length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        docsList: documentsByCandidateRD,
      });
    }
    // }
  }

  processDocumentData = (documentArr) => {
    const { dispatch } = this.props;
    const groupA = [];
    const groupB = [];
    const groupC = [];
    const groupE = [];
    documentArr.map((item) => {
      const { candidateGroup } = item;
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
        case 'E':
          groupE.push(item);
          break;
        default:
          break;
      }
      return null;
    });
    const documentsCandidateList = [
      { type: 'A', name: 'Identity Proof', data: [...groupA] },
      { type: 'B', name: 'Address Proof', data: [...groupB] },
      { type: 'C', name: 'Educational', data: [...groupC] },
      { type: 'E', name: 'Previous Employment', data: [...groupE] },
    ];

    this.setState({
      docsList: documentsCandidateList,
    });

    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        documentsByCandidateRD: documentsCandidateList,
      },
    });

    dispatch({
      type: 'candidateInfo/updateBackgroundRecheck',
      payload: documentsCandidateList,
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
      type: 'candidateInfo/checkDocumentEffect',
      payload: {
        candidate,
        document: _id,
        candidateDocumentStatus: newCandidateDocumentStatus,
        tenantId: getCurrentTenant(),
      },
    });
  };

  handleSendEmail = async () => {
    const { dispatch, candidate } = this.props;
    if (!dispatch) {
      return;
    }
    const res = await dispatch({
      type: 'candidateInfo/sendDocumentStatusEffect',
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
      type: 'candidateInfo/closeCandidate',
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

  handleCheckDocument = (event, indexGroupDoc, document) => {
    const { tempData, dispatch } = this.props;
    const { documentsByCandidateRD } = tempData;
    // const { documentsByCandidateRD, dispatch } = this.props;
    const candidateDocumentStatus = event.target.value;
    const docsByCandidateRDCheck = documentsByCandidateRD;
    const checkedDocument = {
      ...document,
      candidateDocumentStatus,
    };
    const typeIndex = docsByCandidateRDCheck.findIndex((item, index) => index === indexGroupDoc);
    const checkLength = docsByCandidateRDCheck[typeIndex].data.length;
    if (checkLength > 0) {
      const findIndexDoc = docsByCandidateRDCheck[typeIndex].data.findIndex(
        (doc) => doc._id === document._id,
      );
      docsByCandidateRDCheck[typeIndex].data[findIndexDoc] = checkedDocument;

      // ------------------- MODIFY
      const newDocumentList = [];
      docsByCandidateRDCheck.map((item) => {
        const { data = [] } = item;
        data.map((documentItem) => {
          newDocumentList.push(documentItem);
          return null;
        });
        return null;
      });

      if (newDocumentList.length === 0) {
        return;
      }
      let status = 'VERIFIED';
      const newVerifiedDocs = [];
      const newResubmitDocs = [];
      const newIneligibleDocs = [];

      newDocumentList.forEach((doc) => {
        const { candidateDocumentStatus: candidateDocStatus = '' } = doc;
        if (candidateDocStatus === 'RE-SUBMIT') {
          status = 'RE-SUBMIT';
          newResubmitDocs.push(doc);
          this.sendDocumentStatus(doc);
          return null;
        }
        if (candidateDocStatus === 'INELIGIBLE') {
          status = 'INELIGIBLE';
          newIneligibleDocs.push(doc);
          this.sendDocumentStatus(doc);
          return null;
        }
        newVerifiedDocs.push(doc);
        this.sendDocumentStatus(doc);
        return null;
      });

      // -------------------  END MODIFY
      this.setState({
        docsList: [...docsByCandidateRDCheck],
        feedbackStatus: status,
        verifiedDocs: newVerifiedDocs,
        resubmitDocs: newResubmitDocs,
        ineligibleDocs: newIneligibleDocs,
      });

      dispatch({
        type: 'candidateInfo/saveOrigin',
        payload: {
          documentsByCandidateRD: docsByCandidateRDCheck,
        },
      });
    }
  };

  renderCollapseFields = () => {
    const { docsList: documentsCandidateList = [] } = this.state;
    const { loadingGetById = false } = this.props;
    if (documentsCandidateList.length === 0 || loadingGetById) {
      return <Skeleton active />;
    }

    return documentsCandidateList.map((document, index) => {
      return (
        <CollapseField
          item={document}
          index={index}
          //   docList={documentListToRender}
          handleCheckDocument={this.handleCheckDocument}
        />
      );
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  onClickPrev = () => {
    const { currentStep } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  onClickNext = () => {
    const { currentStep } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
      },
    });
  };

  _renderBottomBar = () => {
    // const { feedbackStatus } = this.state;
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.greenText}>
              {/* * All mandatory details must be filled to proceed */}
            </div>
          </Col>
          <Col className={styles.bottomBar__button} span={8}>
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
                this.checkStatus() !== 1 ? styles.bottomBar__button__disabled : ''
              }`}
              disabled={this.checkStatus() !== 1}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  checkStatus = () => {
    const { docsList = [] } = this.state;
    const newVerifiedDocs = [];
    const newResubmitDocs = [];
    const newIneligibleDocs = [];

    const newDocumentList = [];
    docsList.map((item) => {
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
            <Row className={styles.stepRow}>
              <Feedback feedbackStatus={feedbackStatus} docsList={docsList} />
            </Row>
            {feedbackStatus === 'RE-SUBMIT' && (
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
            )}
            {/* <Row className={styles.stepRow}>
              <button className={styles.close}>close candidature</button>
            </Row> */}
            {feedbackStatus === 'INELIGIBLE' && (
              <Row className={styles.stepRow}>
                <div className={styles.closeWrapper}>
                  <h3>Acceptance of background check by HR</h3>
                  <p>The background check has been rejected by HR</p>
                  <button type="button" className={styles.close} onClick={this.closeCandidate}>
                    close candidature
                  </button>
                </div>
              </Row>
            )}
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
