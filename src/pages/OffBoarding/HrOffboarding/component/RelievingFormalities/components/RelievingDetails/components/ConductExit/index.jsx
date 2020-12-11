import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import viewTemplateIcon from '@/assets/view-template-icon.svg';
import externalLinkIcon from '@/assets/external-link.svg';
import removeIcon from '@/assets/remove-off-boarding.svg';
import ModalSet1On1 from '@/components/ModalSet1On1';
import moment from 'moment';
import FeedbackForm from './components/FeedbackForm';
import FeedbackFormContent from './components/FeedbackFormContent';
import styles from './index.less';

@connect(({ loading, offboarding: { listMeetingTime = [], relievingDetails = {} } = {} }) => ({
  listMeetingTime,
  relievingDetails,
  loading: loading.effects['offboarding/create1On1'],
}))
class ConductExit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyModal: '',
      isOpenFeedbackForm: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/getMeetingTime',
    });
  }

  handleCancel = () => {
    this.setState({
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

  handleSendSchedule = ({ meetingDate, meetingTime }) => {
    const {
      dispatch,
      currentUser: { employee: { _id: myId = '' } = {} } = {},
      relievingDetails: {
        _id: offBoardingRequest = '',
        employee: { _id: meetingWith = '' } = {},
      } = {},
    } = this.props;
    const payload = {
      meetingDate,
      meetingTime,
      meetingWith,
      offBoardingRequest,
      ownerComment: myId,
      isRelieving: true,
    };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
      isEmployee: true,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleModalSet1On1();
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest,
          },
        });
      }
    });
  };

  handleModalSet1On1 = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      keyModal: !visible ? '' : Date.now(),
    });
  };

  render() {
    const { visible, keyModal } = this.state;
    const { listMeetingTime = [], loading, itemSchedule = {} } = this.props;
    const {
      _id: idSchedule = '',
      meetingWith: { generalInfo: { firstName = '' } = {} } = {},
      meetingDate = '',
      meetingTime = '',
    } = itemSchedule;
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
              onClick={this.handleModalSet1On1}
              disabled={idSchedule}
            >
              {formatMessage({ id: 'pages.relieving.scheduleInterview' })}
            </Button>
          </div>
        </div>
        {idSchedule && (
          <div className={styles.conductExit}>
            <div className={styles.conductExit__head}>
              <span className={styles.conductExit__head__title}>
                {formatMessage({ id: 'pages.relieving.exitInterviewScheduledWith' })} {firstName}
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
              <span className={styles.conductExit__schedule}>
                Scheduled on : {moment(meetingDate).format('YYYY/MM/DD')} &nbsp; | &nbsp;{' '}
                <span>{meetingTime}</span>
              </span>
            </div>
          </div>
        )}

        {this.renderFeedbackForm()}
        <ModalSet1On1
          visible={visible}
          handleCancel={this.handleModalSet1On1}
          handleSubmit={this.handleSendSchedule}
          listMeetingTime={listMeetingTime}
          title={formatMessage({ id: 'pages.relieving.scheduleInterview' })}
          hideMeetingWith
          key={keyModal}
          loading={loading}
        />
      </>
    );
  }
}

export default ConductExit;
