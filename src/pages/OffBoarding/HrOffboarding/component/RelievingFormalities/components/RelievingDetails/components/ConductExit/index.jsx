import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import viewTemplateIcon from '@/assets/view-template-icon.svg';
import externalLinkIcon from '@/assets/external-link.svg';
import removeIcon from '@/assets/remove-off-boarding.svg';
import ScheduleInterview from './components/ScheduleInterview';
import FeedbackForm from './components/FeedbackForm';
import FeedbackFormContent from './components/FeedbackFormContent';
import styles from './index.less';

@connect(({ loading, offboarding: { listMeetingTime = [] } = {} }) => ({
  listMeetingTime,
  loadingCreateSchedule: loading.effects['offboarding/createScheduleInterview'],
}))
class ConductExit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isOpenFeedbackForm: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/getMeetingTime',
    });
  }

  handleModalScheduleInterview = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      isOpenFeedbackForm: false,
    });
  };

  handleOpenFeedbackForm = () => {
    this.setState({
      isOpenFeedbackForm: true,
    });
  };

  renderFeedbackForm = () => {
    const { isOpenFeedbackForm } = this.state;
    return (
      <FeedbackForm
        content={<FeedbackFormContent />}
        visible={isOpenFeedbackForm}
        handleCancelEdit={this.handleCancel}
      />
    );
  };

  handleSendSchedule = (values) => {
    const { dispatch, myRequest = {} } = this.props;
    const { manager: { _id: meetingWith } = {}, _id: offBoardingRequest } = myRequest;
    const payload = { meetingWith, offBoardingRequest, ...values };
    dispatch({
      type: 'offboarding/createScheduleInterview',
      payload,
      isEmployee: true,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleModalScheduleInterview();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { listMeetingTime, loadingCreateSchedule } = this.props;
    return (
      <>
        <div className={styles.conductExit}>
          <p className={styles.conductExit__title}>
            {formatMessage({ id: 'pages.relieving.conductExitInterview' })}
          </p>
          <p>{formatMessage({ id: 'pages.relieving.conductExitParagraph' })}</p>
          <div className={styles.conductExit__action}>
            <div className={styles.template}>
              <div className={styles.template__content}>
                <img src={templateIcon} alt="template-icon" />
                <span>Feedback form</span>
              </div>
              <div className={styles.template__action}>
                <img className={styles.edit__icon} src={editIcon} alt="edit-icon" />
              </div>
            </div>
            <Button
              className={styles.conductExit__btnSchedule}
              onClick={this.handleModalScheduleInterview}
            >
              {formatMessage({ id: 'pages.relieving.scheduleInterview' })}
            </Button>
          </div>
          <ScheduleInterview
            loadingCreateSchedule={loadingCreateSchedule}
            listMeetingTime={listMeetingTime}
            modalContent={formatMessage({ id: 'pages.relieving.scheduleInterview' })}
            visible={visible}
            handleCancel={this.handleCancel}
            handleSendSchedule={this.handleSendSchedule}
          />
        </div>
        <div className={styles.conductExit}>
          <div className={styles.conductExit__head}>
            <span className={styles.conductExit__head__title}>
              {formatMessage({ id: 'pages.relieving.exitInterviewScheduledWith' })} Venkat
            </span>
            <div className={styles.conductExit__head__action}>
              <img
                src={viewTemplateIcon}
                alt="view-template-icon"
                onClick={() => this.handleOpenFeedbackForm()}
              />
              <img src={externalLinkIcon} alt="external-link-icon" />
              <img src={removeIcon} alt="view-template-icon" />
            </div>
          </div>
          <div>
            <span className={styles.conductExit__schedule}>Scheduled on : 22.05.20 | 12PM</span>
          </div>
        </div>
        {this.renderFeedbackForm()}
      </>
    );
  }
}

export default ConductExit;
