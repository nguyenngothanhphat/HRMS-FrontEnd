import React, { PureComponent } from 'react';
import { Spin, Row, Col } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import Document from './Document';
import AnswerModal from '../AnswerModal';
import styles from './index.less';

@connect(
  ({
    offboarding,
    user: { currentUser: { company: { _id: companyId = '' } = {} } = {} } = {},
    offboarding: {
      acceptedRequest = [],
      relievingDetails: { isSent, exitPackage: { waitList = [] } = {} } = {},
      list1On1 = [],
    } = {},
    loading,
  }) => ({
    offboarding,
    acceptedRequest,
    companyId,
    waitList,
    isSent,
    list1On1,
    loadingFetchPackage: loading.effects['offboarding/fetchRelievingDetailsById'],
  }),
)
class NextStep extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAnswerModal: false,
      selectedDocument: -1,
      isExitInterviewForm: false,
    };
  }

  fetchData = () => {
    const { dispatch, acceptedRequest = [], companyId = '' } = this.props;
    if (acceptedRequest.length > 0) {
      const accepted = acceptedRequest[0]; // only one offboarding request
      const { _id = '' } = accepted;
      dispatch({
        type: 'offboarding/fetchRelievingDetailsById',
        payload: {
          id: _id,
          company: companyId,
          packageType: '',
        },
      });

      dispatch({
        type: 'offboarding/getList1On1',
        payload: {
          offBoardingRequest: _id,
        },
      });
    }
  };

  componentDidMount = () => {
    this.fetchData();
  };

  calculateCompletePercent = (settings) => {
    let count = 0;
    const total = settings.length;
    settings.forEach((value) => {
      const { employeeAnswers = [] } = value;
      if (employeeAnswers.length > 0) count += 1;
    });
    return Math.round((count / total) * 100);
  };

  // check if document are filled
  checkFilledDocument = () => {
    const { waitList = [] } = this.props;
    let checkFilledDocument = true;
    waitList.forEach((item) => {
      const { settings = [] } = item;
      const percent = this.calculateCompletePercent(settings);
      if (percent !== 100) checkFilledDocument = false;
    });
    return checkFilledDocument;
  };

  // render package waitList
  renderPackageList = () => {
    const { waitList = [] } = this.props;
    return waitList.map((item, index) => {
      const { packageName = '', settings = [] } = item;
      const percent = this.calculateCompletePercent(settings);
      return (
        <Col span={8}>
          <Document name={packageName} onClick={() => this.onFileClick(index)} percent={percent} />
        </Col>
      );
    });
  };

  onFileClick = (index) => {
    this.setState({
      showAnswerModal: true,
      selectedDocument: index,
      isExitInterviewForm: index === 0,
    });
  };

  onCloseModal = (type = '') => {
    this.setState({
      showAnswerModal: false,
    });
    setTimeout(() => {
      this.setState({
        selectedDocument: -1,
      });
    }, 200);

    if (type === 'submit') {
      setTimeout(() => {
        this.fetchData();
      }, 400);
    }
  };

  getNewest1On1 = () => {
    const { list1On1 = [] } = this.props;
    let activeList = list1On1.filter((req) => {
      const { status = '' } = req;
      if (status === 'ACTIVE') {
        return req;
      }
      return null;
    });
    activeList = activeList.filter((req) => req !== null);
    if (activeList.length > 0) return activeList[activeList.length - 1];
    return [];
  };

  // on submit to hr button
  onSubmitToHRClicked = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/submitToHr',
    });
  };

  renderMailExit = (checkFilledDocument) => {
    const {
      isScheduled = true,
      submitted = false,
      loadingFetchPackage,
      waitList = [],
    } = this.props;
    const { showAnswerModal, selectedDocument, isExitInterviewForm } = this.state;
    return (
      <div className={styles.belowContainer}>
        {isScheduled && (
          <div className={styles.submitDocuments}>
            <div>
              <Row gutter={[24, 24]}>{!loadingFetchPackage && this.renderPackageList()}</Row>
              {loadingFetchPackage && (
                <div className={styles.loadingSpin}>
                  <Spin />
                </div>
              )}
            </div>

            {!loadingFetchPackage && waitList.length > 0 && (
              <div className={styles.submitFiles}>
                {submitted ? (
                  <span className={styles.submittedTime}>Submitted on 22.12.2020</span>
                ) : (
                  <span />
                )}
                <span
                  className={`${styles.submitButton} ${
                    !checkFilledDocument ? styles.disableButton : ''
                  }`}
                  onClick={checkFilledDocument ? this.onSubmitToHRClicked : null}
                >
                  Submit to HR
                </span>
              </div>
            )}
          </div>
        )}
        {!loadingFetchPackage && selectedDocument !== -1 && (
          <AnswerModal
            visible={showAnswerModal}
            onClose={this.onCloseModal}
            submitText="Submit"
            selectedDocument={selectedDocument}
            isExitInterviewForm={isExitInterviewForm}
          />
        )}
      </div>
    );
  };

  render() {
    const scheduled1On1 = this.getNewest1On1();
    const { meetingDate = '', meetingTime = '' } = scheduled1On1;
    const formattedMeetingTime = `${moment(meetingDate)
      .locale('en')
      .format('DD.MM.YYYY')} | ${meetingTime}`;

    const checkFilledDocument = this.checkFilledDocument();
    return (
      <div className={styles.root}>
        <div className={styles.NextStep}>
          <div className={styles.aboveContainer}>
            <div className={styles.abovePart}>
              <span className={styles.title}>Next steps....</span>
            </div>
            <div className={styles.stepBoxes}>
              <div className={styles.eachBox}>
                <div className={styles.indexNumber}>
                  <span>1</span>
                </div>
                <div className={styles.content1}>
                  <p>
                    You will soon be receiving an exit interview package. Do go through the check
                    list and submit it before the exit interview
                  </p>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.eachBox}>
                <div className={styles.indexNumber}>
                  <span>2</span>
                </div>
                <div className={styles.content2}>
                  {meetingDate === '' && meetingTime === '' && (
                    <p>The HR will soon send an invitation for your final exit interview.</p>
                  )}
                  {meetingDate !== '' && meetingTime !== '' && (
                    <div className={styles.scheduledBox}>
                      <p style={{ fontWeight: 'bold' }}>Your exit interview has been scheduled</p>
                      <p className={styles.scheduleTime}>{formattedMeetingTime}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mailExit}>
          <div className={styles.titleBelow}>
            <span className={styles.title}>Mail Exit interview package</span>
          </div>
          {this.renderMailExit(checkFilledDocument)}
        </div>
      </div>
    );
  }
}
export default NextStep;
