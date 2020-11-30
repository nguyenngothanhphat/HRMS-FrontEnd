import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import viewTemplateIcon from '@/assets/view-template-icon.svg';
import externalLinkIcon from '@/assets/external-link.svg';
import removeIcon from '@/assets/remove-off-boarding.svg';
import ScheduleInterview from '../ScheduleInterview';
import FeedbackForm from './components/FeedbackForm';
import styles from './index.less';

class ConductExit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isOpenFeedbackForm: false,
    };
  }

  openScheduleInterview = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOpenFeedbackForm = () => {
    this.setState({
      isOpenFeedbackForm: true,
    });
  };

  renderFeedbackForm = () => {
    const { isOpenFeedbackForm } = this.state;
    return <FeedbackForm visible={isOpenFeedbackForm} />;
  };

  render() {
    const { visible } = this.state;
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
              onClick={this.openScheduleInterview}
            >
              {formatMessage({ id: 'pages.relieving.scheduleInterview' })}
            </Button>
          </div>
          <ScheduleInterview
            modalContent={formatMessage({ id: 'pages.relieving.scheduleInterview' })}
            visible={visible}
            handleCancel={this.handleCancel}
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
