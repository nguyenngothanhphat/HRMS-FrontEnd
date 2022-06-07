import React, { Component } from 'react';
import { Button, Modal, Row, Col, Tooltip } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/templateIcon.svg';
import editIcon from '@/assets/editMailExit.svg';
import viewTemplateIcon from '@/assets/viewTemplateIcon.svg';
import externalLinkIcon from '@/assets/externalLinkIcon.svg';
import removeIcon from '@/assets/removeIcon.svg';
import ModalSet1On1 from '@/components/ModalSet1On1';
import moment from 'moment';
import { checkTime } from '@/utils/utils';
import ModalAddComment1On1 from '@/components/ModalAddComment1On1';
import FeedbackForm from './components/FeedbackForm';
import FeedbackFormContent from './components/FeedbackFormContent';
import RelievingTemplates from '../RelievingTemplates';
import ModalContent from '../RelievingTemplates/components/ModalContent';
import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: { listMeetingTime = [], relievingDetails = {} } = {},
    user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {},
  }) => ({
    listMeetingTime,
    relievingDetails,
    loading: loading.effects['offboarding/create1On1'],
    myId,
    loadingAddComment: loading.effects['offboarding/complete1On1'],
  }),
)
class ConductExit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyModal: '',
      isOpenFeedbackForm: false,
      isOpenModalEdit: false,
      mode: '',
      openModalAddComment: false,
      keyModalAddComment: '',
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
    const {
      relievingDetails: { exitInterviewFeedbacks: { waitList = [] } = {} } = {},
    } = this.props;
    let itemFeedBack = {};
    if (waitList.length > 0) {
      [itemFeedBack] = waitList;
    }
    return (
      <FeedbackForm
        content={
          <FeedbackFormContent itemFeedBack={itemFeedBack} handleCancelEdit={this.handleCancel} />
        }
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
        this.handleCancelModalSet1On1();
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest,
          },
        });
      }
    });
  };

  handleOpenModalSet1On1 = () => {
    this.setState({
      visible: true,
      keyModal: Date.now(),
    });
  };

  handleCancelModalSet1On1 = () => {
    this.setState({
      visible: false,
      keyModal: '',
    });
  };

  modalWarning = (text = 'Comment') => {
    Modal.warning({
      title: `${text} after date, time meeting 1 on 1`,
    });
  };

  handleAddComment = () => {
    const { openModalAddComment } = this.state;
    this.setState({
      openModalAddComment: !openModalAddComment,
      keyModalAddComment: !openModalAddComment ? '' : Date.now(),
    });
  };

  submitAddComment = (payload) => {
    const { dispatch, relievingDetails: { _id: offBoardingRequest = '' } = {} } = this.props;
    dispatch({
      type: 'offboarding/complete1On1',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest,
          },
        });
        this.handleAddComment();
      }
    });
  };

  handleClickEdit = (mode) => {
    this.setState({
      mode,
      isOpenModalEdit: true,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenModalEdit: false,
      mode: '',
    });
  };

  renderModalEditTemplate = () => {
    const { isOpenModalEdit, mode } = this.state;
    const {
      relievingDetails: { exitInterviewFeedbacks: { waitList = [] } = {} } = {},
    } = this.props;
    let itemFeedBack = {};
    if (waitList.length > 0) {
      [itemFeedBack] = waitList;
    }
    return (
      <RelievingTemplates
        mode={mode}
        visible={isOpenModalEdit}
        template={itemFeedBack}
        content={
          <ModalContent
            handleEditSave={this.handleCancelEdit}
            packageType="EXIT-INTERVIEW-FEEDBACKS"
            template={itemFeedBack}
            mode={mode}
          />
        }
        handleCancelEdit={this.handleCancelEdit}
      />
    );
  };

  render() {
    const { visible, keyModal, keyModalAddComment, openModalAddComment } = this.state;
    const {
      listMeetingTime = [],
      loading,
      itemSchedule = {},
      myId = '',
      relievingDetails: { exitInterviewFeedbacks: { waitList = [] } = {} } = {},
      loadingAddComment,
    } = this.props;
    const {
      _id: idSchedule = '',
      meetingWith: { generalInfo: { firstName = '' } = {} } = {},
      meetingDate = '',
      meetingTime = '',
      ownerComment: { _id: ownerCommentId = '' } = {},
    } = itemSchedule;
    const checkOwner = myId === ownerCommentId;
    const check = checkTime(meetingDate, meetingTime);
    let itemFeedBack = {};
    if (waitList.length > 0) {
      [itemFeedBack] = waitList;
    }

    return (
      <>
        <div className={styles.conductExit}>
          <div className={styles.conductExit__title}>
            {formatMessage({ id: 'pages.relieving.conductExitInterview' })}
          </div>

          <div className={styles.conductExit__header}>
            <p className={styles.paragraph}>
              {formatMessage({ id: 'pages.relieving.conductExitParagraph' })}
            </p>
            <Row gutter={[21, 12]} className={styles.conductExit__header__action}>
              <Col span={12}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img src={templateIcon} alt="template-icon" />
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleClickEdit('View')}
                    >
                      {itemFeedBack?.packageName}
                    </span>
                  </div>
                  <div
                    className={styles.template__action}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClickEdit('Edit')}
                  >
                    <img className={styles.edit__icon} src={editIcon} alt="edit-icon" />
                  </div>
                </div>
              </Col>
              <Col span={12} className={styles.buttonAction}>
                <Button className={styles.btnSchedule} onClick={this.handleOpenModalSet1On1}>
                  <div>{formatMessage({ id: 'pages.relieving.scheduleInterview' })}</div>
                </Button>
              </Col>
            </Row>
          </div>

          {idSchedule && (
            <div className={styles.conductExit__bottom}>
              <Row gutter={[21, 12]}>
                <Col span={18}>
                  <div className={styles.conductExit__bottom__header}>
                    <span className={styles.conductExit__bottom__title}>
                      {formatMessage({ id: 'pages.relieving.exitInterviewScheduledWith' })}{' '}
                      {firstName}
                    </span>
                  </div>
                  <div>
                    <span className={styles.conductExit__bottom__schedule}>
                      Scheduled on: {moment(meetingDate).format('DD.MM.YYYY')} &nbsp; | &nbsp;{' '}
                      <span>{meetingTime}</span>
                    </span>
                  </div>
                </Col>
                <Col span={6}>
                  {checkOwner && (
                    <div className={styles.conductExit__bottom__action}>
                      <Tooltip
                        className={styles.tooltip}
                        placement="topRight"
                        title="Feedback Form"
                      >
                        <img
                          src={viewTemplateIcon}
                          alt="view-template-icon"
                          onClick={
                            check
                              ? this.handleOpenFeedbackForm
                              : () => this.modalWarning('Feedback')
                          }
                        />
                      </Tooltip>
                      <Tooltip className={styles.tooltip} placement="topRight" title="Add Comment">
                        <img
                          src={externalLinkIcon}
                          alt="external-link-icon"
                          onClick={
                            check ? this.handleAddComment : () => this.modalWarning('Comment')
                          }
                        />
                      </Tooltip>
                      <Tooltip className={styles.tooltip} placement="topRight" title="Delete">
                        <img src={removeIcon} alt="view-template-icon" />
                      </Tooltip>
                    </div>
                  )}
                </Col>
              </Row>
              {/* <span className={styles.conductExit__bottom__title}>
                  {formatMessage({ id: 'pages.relieving.exitInterviewScheduledWith' })} {firstName}
                </span>
                {checkOwner && (
                  <div className={styles.conductExit__bottom__action}>
                    <img
                      src={viewTemplateIcon}
                      alt="view-template-icon"
                      onClick={
                        check ? this.handleOpenFeedbackForm : () => this.modalWarning('Feedback')
                      }
                    />
                    <img
                      src={externalLinkIcon}
                      alt="external-link-icon"
                      onClick={check ? this.handleAddComment : () => this.modalWarning('Comment')}
                    />
                    <img src={removeIcon} alt="view-template-icon" />
                  </div>
                )} */}
            </div>
          )}
        </div>

        {this.renderFeedbackForm()}
        <ModalSet1On1
          visible={visible}
          handleCancel={this.handleCancelModalSet1On1}
          handleSubmit={this.handleSendSchedule}
          listMeetingTime={listMeetingTime}
          title={formatMessage({ id: 'pages.relieving.scheduleInterview' })}
          hideMeetingWith
          key={keyModal}
          loading={loading}
        />
        <ModalAddComment1On1
          key={keyModalAddComment}
          visible={openModalAddComment}
          data={itemSchedule}
          handleCancel={this.handleAddComment}
          handleSubmit={this.submitAddComment}
          loading={loadingAddComment}
        />
        {this.renderModalEditTemplate()}
      </>
    );
  }
}

export default ConductExit;
