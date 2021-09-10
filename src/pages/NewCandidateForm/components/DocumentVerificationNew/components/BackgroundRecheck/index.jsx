/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-param-reassign */
import { Button, Checkbox, Col, Row, Skeleton, Typography, Space } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import MessageBox from '@/pages/CandidatePortal/components/Candidate/components/MessageBox';
import StepsComponent from '@/pages/NewCandidateForm/components/StepsComponent';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import NoteComponent from '../../../NoteComponent';
// import CloseCandidateModal from './components/CloseCandidateModal';
import CollapseField from './components/CollapseField';
import PreviousEmployment from './components/PreviousEmployment';
import styles from './index.less';
import { Page } from '../../../../utils';

@connect(
  ({
    newCandidateForm: {
      tempData,
      tempData: { documentsByCandidate = [] } = {},
      data: { candidate = '', processStatus, workHistory = [] },
      currentStep,
      data = {},
    },
    loading,
  }) => ({
    tempData,
    documentsByCandidate,
    data,
    workHistory,
    candidate,
    currentStep,
    processStatus,
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
    this.state = {
      docsList: [],
      checkedAllDocs: false,
      // openModal: false,
      // modalTitle: '',
    };
  }

  componentDidMount = async () => {
    window.scrollTo({ top: 77, behavior: 'smooth' });
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
    const { dispatch, candidate, documentsByCandidate = [] } = this.props;

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

  // closeCandidate = async () => {
  //   const { dispatch, candidate } = this.props;
  //   if (!dispatch) {
  //     return;
  //   }
  //   const res = await dispatch({
  //     type: 'newCandidateForm/closeCandidate',
  //     payload: {
  //       candidate,
  //     },
  //   });
  //   const { statusCode } = res;
  //   if (statusCode !== 200) {
  //     return;
  //   }
  //   this.setState({
  //     modalTitle: 'Closed candidate',
  //     openModal: true,
  //   });
  // };

  // closeModal = () => {
  //   this.setState({
  //     openModal: false,
  //   });
  // };

  renderCollapseFields = () => {
    const { docsList: documentsCandidateList = [] } = this.state;
    const { loadingGetById = false, processStatus = '' } = this.props;
    if (loadingGetById) {
      return <Skeleton active />;
    }

    return (
      <>
        {documentsCandidateList.map((document) => {
          if (document.type !== 'E') {
            return <CollapseField item={document} processStatus={processStatus} />;
          }
          return '';
        })}
        <PreviousEmployment docList={documentsCandidateList} processStatus={processStatus} />
      </>
    );
  };

  renderMarkAllDocument = () => {
    const { checkedAllDocs } = this.state;
    return (
      <div className={styles.markAllDocs}>
        <Checkbox disabled={checkedAllDocs} className={styles.checkbox} onChange={this.onCheckbox}>
          <div className={styles.markAllDocs__text}>Mark all documents as verified</div>
        </Checkbox>
      </div>
    );
  };

  onCheckbox = (e) => {
    const { dispatch, candidate } = this.props;
    const { checked } = e.target;
    this.setState({ checkedAllDocs: checked });

    if (checked) {
      dispatch({
        type: 'newCandidateForm/verifyAllDocuments',
        payload: {
          candidate,
        },
      });
    }
  };

  onClickPrev = () => {
    const {
      tempData: { ticketID = '' },
    } = this.props;
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.JOB_DETAILS}`);
  };

  onClickNext = async () => {
    const { currentStep } = this.state;
    const {
      dispatch,
      candidate,
      processStatus = '',
      tempData: { ticketID = '' },
    } = this.props;

    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        currentStep: NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION ? 3 : currentStep,
        processStatus: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep:
              processStatus === NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION ? 3 : currentStep,
          },
        });
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            processStatus: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
          },
        });
        history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.SALARY_STRUCTURE}`);
      }
    });
  };

  _renderBottomBar = () => {
    const { docsList } = this.state;
    const checkStatus = this.checkStatus(docsList);
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col className={styles.bottomBar__button} span={24}>
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
                  checkStatus !== 1 ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={checkStatus !== 1}
              >
                Next
              </Button>
            </Space>
            <RenderAddQuestion page={Page.Eligibility_documents} />
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
    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around{' '}
          <span className={styles.textNote}>9-12 standard</span> working days for the entire process
          to complete.
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
              {this.renderCollapseFields()}
              {this.renderMarkAllDocument()}
            </div>

            {this._renderBottomBar()}
          </Col>
          <Col className={styles.backgroundRecheck__right} xs={24} sm={24} md={24} lg={8} xl={8}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row className={styles.stepRow}>
              <StepsComponent />
            </Row>
            <Row>
              <MessageBox />
            </Row>
          </Col>
        </Row>

        {/* <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<CloseCandidateModal closeModal={this.closeModal} title={modalTitle} />}
        /> */}
      </div>
    );
  }
}
export default BackgroundRecheck;
