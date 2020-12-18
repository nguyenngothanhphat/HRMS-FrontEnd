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
      inProgressRequest = [],
      relievingDetails: { isSent, exitPackage: { waitList = [] } = {} } = {},
      list1On1 = [],
    } = {},
    loading,
  }) => ({
    offboarding,
    inProgressRequest,
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
    };
  }

  componentDidMount = () => {
    const { dispatch, inProgressRequest = [], companyId = '' } = this.props;
    if (inProgressRequest.length > 0) {
      const inProgress = inProgressRequest[0]; // only one offboarding request
      const { _id = '' } = inProgress;
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

  // render package waitList
  renderPackageList = () => {
    const { waitList = [] } = this.props;
    return waitList.map((item, index) => {
      const { packageName = '' } = item;
      return (
        <Col span={8}>
          <Document name={packageName} onClick={() => this.onFileClick(index)} percent={30} />
        </Col>
      );
    });
  };

  onFileClick = (index) => {
    this.setState({
      showAnswerModal: true,
      selectedDocument: index,
    });
  };

  onCloseModal = () => {
    this.setState({
      showAnswerModal: false,
      selectedDocument: -1,
    });
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

  render() {
    const {
      isScheduled = true,
      scheduleTime = '24.09.2020 | 4:00 PM',
      submitted = false,
      loadingFetchPackage,
      waitList = [],
    } = this.props;

    const { showAnswerModal, selectedDocument } = this.state;
    const scheduled1On1 = this.getNewest1On1();
    const { meetingDate = '', meetingTime = '' } = scheduled1On1;
    const formattedMeetingTime = `${moment(meetingDate)
      .locale('en')
      .format('DD.MM.YYYY')} | ${meetingTime}`;

    return (
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
                  You will soon be receiving an exit interview package. Do go through the check list
                  and submit it before the exit interview
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

        <div className={styles.belowContainer}>
          {isScheduled && (
            <div className={styles.submitDocuments}>
              <div className={styles.abovePart}>
                <span className={styles.title}>
                  Please ensure that you fill the documents below and Submit them to the HR before
                  your exit interview.
                </span>
              </div>
              <div>
                <Row justify="end" gutter={['20', '0']}>
                  {!loadingFetchPackage && this.renderPackageList()}
                </Row>
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
                  <span className={styles.submitButton}>Submit to HR</span>
                </div>
              )}
            </div>
          )}
        </div>

        {!loadingFetchPackage && selectedDocument !== -1 && (
          <AnswerModal
            visible={showAnswerModal}
            onClose={this.onCloseModal}
            submitText="Submit"
            selectedDocument={selectedDocument}
          />
        )}
      </div>
    );
  }
}
export default NextStep;
