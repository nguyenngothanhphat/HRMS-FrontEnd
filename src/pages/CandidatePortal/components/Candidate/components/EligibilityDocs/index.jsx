/* eslint-disable no-param-reassign */
import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { every } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import CustomModal from '@/components/CustomModal';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { SPECIFY, TYPE_QUESTION } from '@/components/Question/utils';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { Page } from '../../../../../NewCandidateForm/utils';
import MessageBox from '../MessageBox';
// import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import CollapseFields from './components/CollapseFields';
// import SendEmail from './components/SendEmail';
import ModalContentComponent from './components/ModalContentComponent';
import PreviousEmployment from './components/PreviousEmployment';
import Title from './components/Title';
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
    candidatePortal: {
      data,
      data: { isVerifiedBasicInfo, isVerifiedJobDetail, checkMandatory = {} } = {},
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
    isVerifiedBasicInfo,
    isVerifiedJobDetail,
    loading: loading.effects['upload/uploadFile'],
    loading1: loading.effects['candidatePortal/sendEmailByCandidate'],
    loading2: loading.effects['candidatePortal/fetchCandidateById'],
    loadingFile:
      loading.effects['candidatePortal/fetchDocumentByCandidate'] ||
      loading.effects['candidatePortal/fetchWorkHistory'],
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

  componentDidMount = async () => {
    // window.scrollTo({ top: 77, behavior: 'smooth' });
    // Back to top of the page
    // this.fetchCandidateAgain();
    this.processData();
    const { data: { processStatus = '' } = {} } = this.props;
    if (![NEW_PROCESS_STATUS.PROFILE_VERIFICATION].includes(processStatus)) {
      this.setState({
        isSentEmail: true,
      });
    }
  };

  fetchCandidateAgain = () => {
    const { dispatch, candidate } = this.props;

    // fetch data candidate by id to update the newest data (especially the Email HR)
    dispatch({
      type: 'candidatePortal/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
  };

  processData = async () => {
    const { candidate = {}, dispatch } = this.props;
    if (candidate) {
      const res = await dispatch({
        type: 'candidatePortal/fetchDocumentByCandidate',
        payload: {
          candidate: candidate._id,
          tenantId: getCurrentTenant(),
        },
      });
      const documentList = res.statusCode === 200 ? res.data : [];

      const res1 = await dispatch({
        type: 'candidatePortal/fetchWorkHistory',
        payload: {
          candidate: candidate._id,
          tenantId: getCurrentTenant(),
        },
      });

      if (res1.statusCode === 200) {
        const workHistory = res1.data;

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

        let docList = [
          { type: 'A', name: 'Identity Proof', data: [...groupA] },
          { type: 'B', name: 'Address Proof', data: [...groupB] },
          { type: 'C', name: 'Educational', data: [...groupC] },
        ];
        if (groupD.length > 0) {
          docList = [
            ...docList,
            { type: 'D', name: 'Technical Certifications', data: [...groupD] },
          ];
        }
        docList = [...docList, ...groupMultiE];

        await dispatch({
          type: 'candidatePortal/saveOrigin',
          payload: {
            documentListToRender: [...docList],
          },
        });
      }
    }
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
          type: 'candidatePortal/addAttachmentCandidate',
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
              type: 'candidatePortal/saveOrigin',
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
          type: 'candidatePortal/addAttachmentCandidate',
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
              type: 'candidatePortal/saveOrigin',
              payload: {
                documentListToRender: [...otherDocs, ...arrToAdjust],
              },
            });
          }
        });
      }
    }
  };

  handleCanCelIcon = async (index, id, docList) => {
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
        type: 'candidatePortal/saveOrigin',
        payload: {
          documentListToRender: arrToAdjust,
        },
      });
    }
  };

  handleCanCelIconForTypeE = (index, id, docList, docListEFilter) => {
    const { dispatch } = this.props;

    const otherDocs = docList.filter((d) => d.type !== 'E');
    const arrToAdjust = JSON.parse(JSON.stringify(docListEFilter));
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
        type: 'candidatePortal/saveOrigin',
        payload: {
          documentListToRender: [...otherDocs, ...arrToAdjust],
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
      type: 'candidatePortal/sendEmailByCandidate',
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
      // candidate,
    } = this.props;
    const { generalInfo = {} } = generatedBy;
    const { workEmail: email = '' } = generalInfo;
    this.setState({ isSending: true });
    // fetch data candidate by id to update the newest data (especially the Email HR)
    // dispatch({
    //   type: 'candidatePortal/fetchCandidateById',
    //   payload: {
    //     candidate: candidate._id,
    //     tenantId: getCurrentTenant(),
    //     rookieID: candidate.ticketID,
    //   },
    // }).then((response) => {
    //   const { generatedBy: { generalInfo: newGeneralInfo = {} } = {} } = response.data;
    //   const { workEmail: newestEmailHr = '' } = newGeneralInfo;

    //   if (newestEmailHr === email) {
    // if true, the email is still not change
    dispatch({
      type: 'candidatePortal/sendEmailByCandidate',
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
    // } else {
    //   // else, it means the email was changed/assigned to other HR while the candidate is updating document files.
    //   this.setState({ hrEmail: newestEmailHr, isSentEmail: true });
    //   notification.warning({
    //     message: 'The Email HR was changed/re-assigned. Please send mail again !',
    //   });
    // }
    //   this.setState({ isSending: false });
    // });
  };

  handleSendEmail = () => {
    const { hrEmail } = this.state;
    const { dispatch, _id, settings } = this.props;
    const messageErr = this.checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
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
      type: 'candidatePortal/saveOrigin',
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
      type: 'candidatePortal/saveOrigin',
      payload: {
        generatedBy: {
          ...generatedBy,
          user: { ...user, email: val.email },
        },
      },
    });
  };

  closeModal = () => {
    history.push('/candidate-portal/dashboard');
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
        if (
          !doc1.attachment &&
          doc1.isCandidateUpload
          // || (!doc1.attachment && doc1.isMandatoryBySystem)
        ) {
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

  checkAllFieldsValidate = () => {
    const { settings, dispatch } = this.props;
    const valid = settings?.map((question) => {
      const employeeAnswers = question.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = question?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (question.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = question?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };

  _renderBottomBar = () => {
    const { isVerifiedBasicInfo, isVerifiedJobDetail } = this.props;
    const { loading1 } = this.props;
    const { isSending, isSentEmail } = this.state;
    const checkFull = this.checkFull();
    const isVerifiedProfile = isVerifiedBasicInfo && isVerifiedJobDetail;
    const submitButton = (
      <Button
        type="primary"
        htmlType="submit"
        onClick={this.handleSendEmail}
        className={`${styles.bottomBar__button__primary} ${
          !checkFull ? styles.bottomBar__button__disabled : ''
        }`}
        disabled={!checkFull || !isVerifiedProfile}
        loading={loading1 || isSending}
      >
        {isSentEmail ? 'Submit Again' : 'Submit'}
      </Button>
    );
    return (
      <div className={styles.bottomBar}>
        <AnswerQuestion page={Page.Eligibility_documents} />

        <Row align="middle">
          <Col span={8}>
            {/* <div className={styles.bottomBar__status}>{this._renderStatus()}</div> */}
          </Col>
          <Col span={16}>
            <div className={styles.bottomBar__button}>
              {isVerifiedProfile ? (
                submitButton
              ) : (
                <Tooltip title="You must finish the Review Profile task first!">
                  {submitButton}
                </Tooltip>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const {
      loading,
      data: {
        attachments,
        documentListToRender,
        validateFileSize,
        // generatedBy,
        processStatus,
      } = {},
    } = this.props;
    const {
      openModal,
      // isSentEmail,
    } = this.state;
    // const { generalInfo: { workEmail } = {} || {} } = generatedBy || {};
    // const {  } = user;
    // console.log(processStatus);

    // if (((loading2 && !isSending) || loadingFile))
    //   return (
    //     <div className={styles.viewLoading}>
    //       <Skeleton />
    //     </div>
    //   );
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
              {documentListToRender.length > 0 && (
                <PreviousEmployment
                  onValuesChange={this.onValuesChange}
                  handleCancelIcon={this.handleCanCelIconForTypeE}
                  handleFile={this.handleFileForTypeE}
                  loading={loading}
                  attachments={attachments}
                  validateFileSize={validateFileSize}
                  checkLength={this.checkLength}
                  processStatus={processStatus}
                  renderData={this.processData}
                />
              )}
            </div>
            {this._renderBottomBar()}
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={Note} />
            <MessageBox />
            {/* {documentListToRender.length > 0 ? (
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
            )} */}
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
