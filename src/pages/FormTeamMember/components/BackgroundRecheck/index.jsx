/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import { Row, Col, Typography, Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import CustomModal from '@/components/CustomModal';
import NoteComponent from '../NoteComponent';
import Feedback from './components/Feedback';
import CollapseField from './components/CollapseField';
import styles from './index.less';
import SendEmail from '../PreviewOffer/components/SendEmail';
import CloseCandidateModal from './components/CloseCandidateModal';

@connect(
  ({
    candidateInfo: {
      tempData,
      data: {
        documentsByCandidate = [],
        documentsByCandidateRD = [],
        privateEmail = '',
        candidate = '',
      },
    },
  }) => ({
    tempData,
    documentsByCandidate,
    documentsByCandidateRD,
    privateEmail,
    candidate,
  }),
)
class BackgroundRecheck extends Component {
  constructor(props) {
    super(props);
    const {
      tempData: { backgroundRecheck: { documentList: docsListProp = [] } = {} } = {},
    } = this.props;
    this.state = {
      docsList: docsListProp,
      feedbackStatus: '',
      resubmitDocs: [],
      ineligibleDocs: [],
      verifiedDocs: [],
      openModal: false,
      modalTitle: '',
    };
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // const { docsList = [] } = this.state;
    const { tempData: { backgroundRecheck: { documentList = [] } = {} } = {} } = this.props;
    // this.processDocumentData();
    if (documentList.length === 0) {
      this.processDocumentData();
    }
  }

  processDocumentData = () => {
    // console.log('RUN');
    const { documentsByCandidate, dispatch } = this.props;
    const groupA = [];
    const groupB = [];
    const groupC = [];
    const groupD = [];
    documentsByCandidate.map((item) => {
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
        case 'D':
          groupD.push(item);
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
      { type: 'D', name: 'Technical Certifications', data: [...groupD] },
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
    // console.log(doc);
    const { candidate = '', dispatch } = this.props;
    const { verifiedDocs = [], resubmitDocs = [], ineligibleDocs = [] } = this.state;
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
    // verifiedDocs.forEach((doc) => {
    // });
    // console.log(doc);
    dispatch({
      type: 'candidateInfo/checkDocumentEffect',
      payload: {
        candidate,
        document: _id,
        candidateDocumentStatus: newCandidateDocumentStatus,
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
    const { documentsByCandidateRD, dispatch } = this.props;
    // console.log(document);
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
        this.sendDocumentStatus(doc);
        newVerifiedDocs.push(doc);
        return null;
      });

      // -------------------  END MODIFY

      // console.log('setState all');
      this.setState({
        docsList: docsByCandidateRDCheck,
        feedbackStatus: status,
        verifiedDocs: newVerifiedDocs,
        resubmitDocs: newResubmitDocs,
        ineligibleDocs: newIneligibleDocs,
      });

      // console.log(this.state.verifiedDocs);
      // console.log(this.state.resubmitDocs);
      // console.log(this.state.ineligibleDocs);

      dispatch({
        type: 'candidateInfo/saveOrigin',
        payload: {
          documentsByCandidateRD: docsByCandidateRDCheck,
        },
      });
    }
  };

  renderCollapseFields = (documentsCandidateList) => {
    if (documentsCandidateList.length === 0) {
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

  render() {
    const { docsList, feedbackStatus, openModal, modalTitle } = this.state;
    const { privateEmail } = this.props;
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
            <p className={styles.backgroundRecheck__title}>Background Check</p>
            <p className={styles.backgroundRecheck__subTitle}>
              All documents supporting candidate's employment eligibility will be displayed here
            </p>
            <div className={styles.backgroundRecheck__left}>
              <>{docsList.length > 0 && this.renderCollapseFields(docsList)}</>
            </div>
          </Col>
          <Col className={styles.backgroundRecheck__right} xs={24} sm={24} md={24} lg={8} xl={8}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row className={styles.stepRow}>
              <Feedback feedbackStatus={feedbackStatus} />
            </Row>
            {feedbackStatus === 'RE-SUBMIT' && (
              <Row className={styles.stepRow}>
                <SendEmail
                  title="Send final offer to the candidate"
                  formatMessage={formatMessage}
                  handleSendEmail={this.handleSendEmail}
                  isSentEmail={false}
                  privateEmail={privateEmail}
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
                  <button className={styles.close} onClick={this.closeCandidate}>
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
