import { Button, Col, Row, Typography } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { every } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { SPECIFY, TYPE_QUESTION } from '@/components/Question/utils';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { Page } from '../../../../../NewCandidateForm/utils';
import NoteComponent from '../NoteComponent';
import MessageBox from '../MessageBox';
import FieldsComponent from './components/FieldsComponent';
import Header from './components/Header';
import styles from './index.less';

// Thứ tự Fields Work Location Job Title Department Reporting Manager
@connect(
  ({
    optionalQuestion: {
      messageError,
      data: { _id, settings },
    },
    candidatePortal: { data, tempData, checkMandatory, localStep, isCandidateAcceptDOJ } = {},
    loading,
  }) => ({
    messageError,
    _id,
    settings,
    checkMandatory,
    data,
    tempData,
    localStep,
    isCandidateAcceptDOJ,
    loadingUpdateCandidate: loading.effects['candidatePortal/updateByCandidateEffect'],
  }),
)
class JobDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('localStep' in props) {
      return {
        localStep: props.localStep,
      };
    }
    return null;
  }

  componentDidMount() {
    // window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    const {
      data: { dateOfJoining = '' },
      dispatch,
      checkMandatory,
      isCandidateAcceptDOJ = true,
    } = this.props;

    if (dateOfJoining && isCandidateAcceptDOJ) {
      dispatch({
        type: 'candidatePortal/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledJobDetail: true,
          },
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, checkMandatory, data, tempData } = this.props;

    const { dateOfJoining = '' } = data;
    const { dateOfJoining: tempDOJ = '' } = tempData;

    let valid = false;
    if (dateOfJoining) {
      valid = true;
    } else if (tempDOJ) {
      valid = true;
    } else valid = false;

    if (prevProps.checkMandatory.filledJobDetail !== valid) {
      dispatch({
        type: 'candidatePortal/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledJobDetail: valid,
          },
        },
      });
    }
  }

  _handleSelect = (value, name) => {
    const { dispatch, data } = this.props;
    const { dateOfJoining } = data;

    let newDateOfJoining = dateOfJoining;

    if (name === 'dateOfJoining') {
      newDateOfJoining = value;
      // notification.success({
      //   message: 'New Joining Date has been saved and the HR has been notified.',
      // });
      dispatch({
        type: 'candidatePortal/saveTemp',
        payload: {
          dateOfJoining: newDateOfJoining,
        },
      });
    }
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

  onClickSubmit = async () => {
    const {
      dispatch,
      data: { _id, dateOfJoining = '', isVerifiedJobDetail },
      tempData: { dateOfJoining: tempDOJ = '' } = {},
      data,
      checkMandatory,
      settings,
      _id: id,
    } = this.props;
    const messageErr = this.checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (id !== '' && settings && settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id,
          settings,
        },
      });
    }

    const converted = tempDOJ || dateOfJoining;

    await dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        dateOfJoining: converted,
        candidate: _id,
        tenantId: getCurrentTenant(),
        isVerifiedJobDetail,
        isAcceptedJoiningDate: true,
      },
    });
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        // localStep: localStep + 1,
        data: {
          ...data,
          dateOfJoining: converted,
        },
        checkMandatory: {
          ...checkMandatory,
          filledSalaryStructure: true,
        },
      },
    });

    history.push('/candidate-portal/dashboard');
  };

  onClickPrev = () => {
    const { localStep } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  onCancel = () => {
    history.push('/candidate-portal/dashboard');
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledJobDetail } = checkMandatory;
    return filledJobDetail ? (
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

  handleDisabled = () => {
    const {
      checkMandatory,
      data: { isVerifiedJobDetail = false, isVerifiedBasicInfo = false } = {},
    } = this.props;
    const { filledJobDetail } = checkMandatory;
    return !filledJobDetail || !isVerifiedJobDetail || !isVerifiedBasicInfo;
  };

  _renderBottomBar = () => {
    const { checkMandatory, loadingUpdateCandidate = false } = this.props;
    const { filledJobDetail, isCandidateAcceptDOJ } = checkMandatory;

    const className = () => {
      if (isCandidateAcceptDOJ) {
        return '';
      }

      if (filledJobDetail) return '';
      return styles.bottomBar__button__disabled;
    };

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={8}>
            {/* <div className={styles.bottomBar__status}>{this._renderStatus()}</div> */}
          </Col>
          <Col span={16}>
            <div className={styles.bottomBar__button}>
              <Button
                type="secondary"
                // onClick={this.onClickPrev}
                onClick={this.onCancel}
                className={styles.bottomBar__button__secondary}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={this.onClickSubmit}
                className={`${styles.bottomBar__button__primary} ${className()}`}
                disabled={this.handleDisabled()}
                loading={loadingUpdateCandidate}
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  // checkbox verify this form
  onVerifyThisForm = (e) => {
    const {
      target: { checked = false },
    } = e;
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        isVerifiedJobDetail: checked,
      },
    });
  };

  render() {
    const Tab = {
      positionTab: {
        title: formatMessage({ id: 'component.jobDetail.positionTab' }),
        name: 'position',
      },
      classificationTab: {
        title: formatMessage({ id: 'component.jobDetail.classificationTab' }),
        name: 'employeeType',
      },
    };
    const HRField = [
      {
        title: 'workLocation',
        name: `${formatMessage({ id: 'component.jobDetail.workLocation' })}`,
        id: 1,
      },
      {
        title: 'department',
        name: `${formatMessage({ id: 'component.jobDetail.department' })}`,
        id: 2,
      },
      {
        title: 'title',
        name: 'Job Title',
        id: 3,
      },
      {
        title: 'reportingManager',
        name: `${formatMessage({ id: 'component.jobDetail.reportingManager' })}`,
        id: 4,
      },
      {
        title: 'grade',
        name: `Grade`,
        id: 5,
      },
    ];
    const candidateField = [
      {
        title: `candidatesNoticePeriod`,
        name: formatMessage({ id: 'component.jobDetail.candidateNoticePeriod' }),
        id: 1,
      },
      {
        title: 'prefferedDateOfJoining',
        name: 'Please select your preferred Date of Joining',
        id: 2,
      },
      {
        title: 'dateOfJoining', // candidate changed
        name: 'Date of joining',
        id: 3,
      },
    ];

    const Note = {
      title: formatMessage({ id: 'component.noteComponent.title' }),
      data: (
        <Typography.Text>
          Please verify the job details that have been added. In case of incorrect details, please
          send a note in the text box below.
        </Typography.Text>
      ),
    };
    const { data = {}, data: { isVerifiedJobDetail } = {} || {} } = this.props;
    return (
      <div>
        <Row gutter={[24, 0]}>
          <Col lg={24} xl={16}>
            <div className={styles.JobDetailsComponent}>
              <Header />
              <FieldsComponent
                Tab={Tab}
                data={data}
                HRField={HRField}
                candidateField={candidateField}
                _handleSelect={this._handleSelect}
              />
              <Row className={styles.belowPart}>
                <Col span={24}>
                  <AnswerQuestion page={Page.Job_Details} />
                </Col>
                <Col span={24} className={styles.verifyCheckbox}>
                  <Checkbox checked={isVerifiedJobDetail} onChange={this.onVerifyThisForm}>
                    I have verified that the above details are correct
                  </Checkbox>
                </Col>
              </Row>
            </div>
            {this._renderBottomBar()}
          </Col>
          <Col className={styles.RightComponents} lg={24} xl={8}>
            <div className={styles.rightWrapper}>
              <Row>
                <NoteComponent note={Note} />
                <MessageBox />
              </Row>
            </div>
          </Col>
        </Row>
        {/* )} */}
      </div>
    );
  }
}

export default JobDetails;
