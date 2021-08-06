/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Typography, Row, Col, Button, Spin, notification } from 'antd';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import { getCurrentTenant } from '@/utils/authority';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import PreviousEmployment from './components/PreviousEmployment';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import SendEmail from './components/SendEmail';
import ModalContentComponent from './components/ModalContentComponent';
import { Page } from '../../../FormTeamMember/utils';
import styles from './index.less';

const Note = {
  title: 'Note',
  data: (
    <Typography.Text>
      Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
      working days for entire process to complete
    </Typography.Text>
  ),
};

@connect(
  ({
    optionalQuestion: {
      data: { _id, settings },
    },
    candidateProfile: {
      data,
      data: { checkMandatory = {} } = {},
      localStep,
      currentStep,
      tempData,
    } = {},
    loading,
    user: { currentUser: { candidate = {} } = {} },
  }) => ({
    _id,
    settings,
    data,
    localStep,
    currentStep,
    tempData,
    checkMandatory,
    candidate,
    loading: loading.effects['upload/uploadFile'],
    loading1: loading.effects['candidateProfile/sendEmailByCandidate'],
    loading2: loading.effects['candidateProfile/fetchCandidateById'],
  }),
)
class EligibilityDocs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      isSentEmail: false,
      isSending: false,
      hrEmail: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    window.scrollTo({ top: 77, behavior: 'smooth' });
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        pageName: Page.Eligibility_documents,
        // candidate: data.candidate,
        data: {},
      },
    }); // Back to top of the page
    this.processData();
    this.fetchCandidateAgain();
    const { data: { processStatus = '' } = {} } = this.props;
    if (
      [
        'ACCEPT-PROVISIONAL-OFFER',
        'APPROVED-FINAL-OFFER',
        'SENT-FINAL-OFFERS',
        'ACCEPT-FINAL-OFFER',
        'RENEGOTIATE-FINAL-OFFERS',
        'DISCARDED-PROVISONAL-OFFER',
        'REJECT-FINAL-OFFER-HR',
        'REJECT-FINAL-OFFER-CANDIDATE',
        'PENDING-BACKGROUND-CHECK',
        'PENDING-APPROVAL-FINAL-OFFER',
      ].includes(processStatus)
    ) {
      this.setState({
        isSentEmail: true,
      });
    }
  }

  fetchCandidateAgain = () => {
    const { dispatch, candidate } = this.props;

    // fetch data candidate by id to update the newest data (especially the Email HR)
    dispatch({
      type: 'candidateProfile/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
  };

  processData = async () => {
    const {
      data: { documentList = [], workHistory = [] },
      dispatch,
    } = this.props;

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

    const docList = [
      { type: 'A', name: 'Identity Proof', data: [...groupA] },
      { type: 'B', name: 'Address Proof', data: [...groupB] },
      { type: 'C', name: 'Educational', data: [...groupC] },
      { type: 'D', name: 'Technical Certifications', data: [...groupD] },
      ...groupMultiE,
    ];
    await dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        documentListToRender: [...docList],
      },
    });
  };

  handleFile = (res, index, id, docList) => {
    const { dispatch } = this.props;
    const arrToAdjust = JSON.parse(JSON.stringify(docList));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);
    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);
      const documentId = arrToAdjust[typeIndex].data[nestedIndex]._id;
      const { statusCode, data } = res;
      const Obj = arrToAdjust[typeIndex].data[nestedIndex];
      const attachment1 = data.find((x) => x);
      if (statusCode === 200) {
        dispatch({
          type: 'candidateProfile/addAttachmentCandidate',
          payload: {
            attachment: attachment1.id,
            document: documentId,
            tenantId: getCurrentTenant(),
          },
        }).then(({ data: { attachment } = {} }) => {
          if (attachment) {
            arrToAdjust[typeIndex].data.splice(nestedIndex, 1, {
              ...Obj,
              attachment,
            });
            dispatch({
              type: 'candidateProfile/saveOrigin',
              payload: {
                documentListToRender: arrToAdjust,
              },
            });
          }
        });
      }
    }
  };

  handleFileForTypeE = (res, index, id, docList, docListEFilter) => {
    const { dispatch } = this.props;

    const otherDocs = docList.filter((d) => d.type !== 'E');
    const arrToAdjust = JSON.parse(JSON.stringify(docListEFilter));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);

    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);

      const documentId = arrToAdjust[typeIndex].data[nestedIndex]._id;
      const { statusCode, data } = res;
      const Obj = arrToAdjust[typeIndex].data[nestedIndex];
      const attachment1 = data.find((x) => x);
      if (statusCode === 200) {
        dispatch({
          type: 'candidateProfile/addAttachmentCandidate',
          payload: {
            attachment: attachment1.id,
            document: documentId,
            tenantId: getCurrentTenant(),
          },
        }).then(({ data: { attachment } = {} }) => {
          if (attachment) {
            arrToAdjust[typeIndex].data.splice(nestedIndex, 1, {
              ...Obj,
              attachment,
            });

            dispatch({
              type: 'candidateProfile/saveOrigin',
              payload: {
                documentListToRender: [...otherDocs, ...arrToAdjust],
              },
            });
          }
        });
      }
    }
  };

  handleCanCelIcon = (index, id, docList) => {
    const { dispatch } = this.props;
    const arrToAdjust = JSON.parse(JSON.stringify(docList));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);
    const { isValidated } = docList;
    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);
      const attach = null;
      const Obj = arrToAdjust[typeIndex].data[nestedIndex];
      arrToAdjust[typeIndex].data.splice(nestedIndex, 1, {
        ...Obj,
        attachment: attach,
        isValidated: !isValidated,
      });
      dispatch({
        type: 'candidateProfile/saveOrigin',
        payload: {
          documentListToRender: arrToAdjust,
        },
      });
    }
  };

  sendEmailAgain = (email) => {
    const {
      data: { dateOfJoining, noticePeriod, firstName, middleName, lastName, workHistory = [] },
      dispatch,
    } = this.props;

    dispatch({
      type: 'candidateProfile/sendEmailByCandidate',
      payload: {
        dateOfJoining,
        options: 1,
        firstName,
        middleName,
        lastName,
        noticePeriod,
        hrEmail: email,
        workHistories: workHistory,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: true,
          isSentEmail: true,
        });
      }
    });
  };

  initSendMail = () => {
    const {
      data: {
        dateOfJoining,
        noticePeriod,
        firstName,
        middleName,
        lastName,
        generatedBy,
        workHistory = [],
      },
      dispatch,
      candidate,
    } = this.props;
    const { generalInfo = {} } = generatedBy;
    const { workEmail: email = '' } = generalInfo;
    this.setState({ isSending: true });
    // fetch data candidate by id to update the newest data (especially the Email HR)
    dispatch({
      type: 'candidateProfile/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    }).then((response) => {
      const { generatedBy: { generalInfo: newGeneralInfo = {} } = {} } = response.data;
      const { workEmail: newestEmailHr = '' } = newGeneralInfo;

      if (newestEmailHr === email) {
        // if true, the email is still not change
        dispatch({
          type: 'candidateProfile/sendEmailByCandidate',
          payload: {
            dateOfJoining,
            options: 1,
            firstName,
            middleName,
            lastName,
            noticePeriod,
            hrEmail: email,
            workHistories: workHistory,
            tenantId: getCurrentTenant(),
          },
        }).then(({ statusCode }) => {
          if (statusCode === 200) {
            this.setState({
              openModal: true,
              isSentEmail: true,
            });
          }
        });
      } else {
        // else, it means the email was changed/assigned to other HR while the candidate is updating document files.
        this.setState({ hrEmail: newestEmailHr, isSentEmail: true });
        notification.warning({
          message: 'The Email HR was changed/re-assigned. Please send mail again !',
        });
      }
      this.setState({ isSending: false });
    });
  };

  handleSendEmail = () => {
    const { hrEmail } = this.state;
    const { dispatch, _id, settings } = this.props;
    if (_id !== '' && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: _id,
          settings,
        },
      });
    }

    if (hrEmail) {
      this.sendEmailAgain(hrEmail);
    } else {
      this.initSendMail();
    }
  };

  handleSubmitAgain = () => {
    this.setState({
      isSentEmail: false,
    });
  };

  onValuesChange = (val, type) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        [type]: val,
      },
    });
  };

  onValuesChangeEmail = (val) => {
    const {
      data: { generatedBy },
      dispatch,
    } = this.props;
    const { user = {} } = generatedBy;
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        generatedBy: {
          ...generatedBy,
          user: { ...user, email: val.email },
        },
      },
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;
    this.setState({
      openModal: false,
    });
    dispatch({
      type: 'candidateProfile/refreshPage',
    });
  };

  checkLength = (url) => {
    if (url.length > 20) {
      const ext = url.split('.').pop();
      let fileName = url.split('.')[0];
      if (fileName.length > 15) {
        fileName = `${fileName.substring(0, 10)}...`;
        url = `${fileName}${ext}`;
      }
    }
    return url;
  };

  checkFull = () => {
    const { data: { workHistory = [], documentListToRender = [] } = {} } = this.props;
    let checkFull = true;
    documentListToRender.forEach((doc) => {
      doc.data.forEach((doc1) => {
        if (!doc1.attachment && !doc1.isMandatoryBySystem && doc1.isCandidateUpload) {
          checkFull = false;
        }
      });
    });
    workHistory.forEach((w) => {
      if (!w.startDate || (!w.toPresent && !w.endDate)) checkFull = false;
    });
    return checkFull;
  };

  _renderStatus = () => {
    return (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    );
  };

  onClickPrev = () => {
    const { dispatch, localStep } = this.props;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  onClickNext = () => {
    const { dispatch, localStep, _id, settings } = this.props;
    if (_id !== '' && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: _id,
          settings,
        },
      });
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
      },
    });
  };

  _renderBottomBar = () => {
    const { currentStep = 0 } = this.props;
    return (
      <div className={styles.bottomBar}>
        <Row style={{ margin: '0 16px 32px 16px' }}>
          <AnswerQuestion />
        </Row>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              <Button type="secondary" onClick={this.onClickPrev}>
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${styles.bottomBar__button__disabled}`}
                disabled={currentStep < 5}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const {
      loading,
      loading1,
      loading2,
      data: {
        attachments,
        documentListToRender,
        validateFileSize,
        generatedBy,
        processStatus,
      } = {},
    } = this.props;
    const { openModal, isSentEmail, isSending, hrEmail } = this.state;
    const {
      generalInfo: { workEmail },
    } = generatedBy;
    // const {  } = user;
    // console.log(processStatus);

    const checkFull = this.checkFull();

    if (loading2 && !isSending)
      return (
        <div className={styles.viewLoading}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.EligibilityDocs}>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Title />
              {documentListToRender.length > 0 &&
                documentListToRender.map((item, index) => {
                  // console.log(index);
                  if (item.type !== 'E') {
                    return (
                      <CollapseFields
                        onValuesChange={this.onValuesChange}
                        item={item && item}
                        index={index}
                        docList={documentListToRender}
                        handleCanCelIcon={this.handleCanCelIcon}
                        handleFile={this.handleFile}
                        loading={loading}
                        attachments={attachments}
                        validateFileSize={validateFileSize}
                        checkLength={this.checkLength}
                        processStatus={processStatus}
                      />
                    );
                  }
                  return '';
                })}

              {/* type E */}
              <PreviousEmployment
                onValuesChange={this.onValuesChange}
                handleCanCelIcon={this.handleCanCelIcon}
                handleFile={this.handleFileForTypeE}
                loading={loading}
                attachments={attachments}
                validateFileSize={validateFileSize}
                checkLength={this.checkLength}
                processStatus={processStatus}
                renderData={this.processData}
              />
            </div>
            {this._renderBottomBar()}
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={Note} />
            {documentListToRender.length > 0 ? (
              <>
                {hrEmail ? (
                  <SendEmail
                    loading={loading1 || isSending}
                    handleSendEmail={this.handleSendEmail}
                    email={hrEmail}
                    onValuesChangeEmail={this.onValuesChangeEmail}
                    isSentEmail={isSentEmail}
                    handleSubmitAgain={this.handleSubmitAgain}
                    // disabled={!(workDuration !== 0 && !isUndefined(workDuration))}
                    disabled={!checkFull}
                  />
                ) : (
                  <SendEmail
                    loading={loading1 || isSending}
                    handleSendEmail={this.handleSendEmail}
                    email={workEmail}
                    onValuesChangeEmail={this.onValuesChangeEmail}
                    isSentEmail={isSentEmail}
                    handleSubmitAgain={this.handleSubmitAgain}
                    // disabled={!(workDuration !== 0 && !isUndefined(workDuration))}
                    disabled={!checkFull}
                  />
                )}
              </>
            ) : (
              <StepsComponent />
            )}
          </Col>
        </Row>
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<ModalContentComponent closeModal={this.closeModal} />}
        />
      </div>
    );
  }
}

export default EligibilityDocs;
