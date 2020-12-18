import React, { PureComponent } from 'react';
import { Spin, Row, Col } from 'antd';
import { connect } from 'umi';
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
    } = {},

    loading,
  }) => ({
    offboarding,
    inProgressRequest,
    companyId,
    waitList,
    isSent,
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

  render() {
    const {
      isScheduled = true,
      scheduleTime = '24.09.2020 | 4:00 PM',
      submitted = false,
      loadingFetchPackage,
      waitList = [],
    } = this.props;

    const { showAnswerModal, selectedDocument } = this.state;

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
                {!isScheduled && (
                  <p>The HR will soon send an invitation for your final exit interview.</p>
                )}
                {isScheduled && (
                  <div className={styles.scheduledBox}>
                    <p style={{ fontWeight: 'bold' }}>Your exit interview has been scheduled</p>
                    <p className={styles.scheduleTime}>{scheduleTime}</p>
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
