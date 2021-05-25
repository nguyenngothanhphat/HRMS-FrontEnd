import React, { Component } from 'react';
import moment from 'moment';
import { Input, Button } from 'antd';
import { connect } from 'umi';
import editIcon from '@/assets/edit-off-boarding.svg';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import s from './index.less';

const { TextArea } = Input;

@connect(
  ({
    loading,
    offboarding: { myRequest = {} } = {},
    user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {},
  }) => ({
    loading: loading.effects['offboarding/complete1On1'],
    myRequest,
    myId,
  }),
)
class EditComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemComment: props.itemComment,
      q: props.itemComment.content,
      isEdit: false,
      selectButton: '',
      canBeRehired: props.itemComment.canBeRehired,
    };
  }

  handleChange = (e) => {
    this.setState({
      q: e.target.value,
    });
  };

  handleOpenEdit = () => {
    this.setState({ isEdit: true });
  };

  handleCloseEdit = () => {
    const { itemComment: { content: q = '' } = {} } = this.props;
    this.setState({ isEdit: false, q });
  };

  handleSubmit = () => {
    const { q, itemComment: { _id: id } = {}, canBeRehired } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/complete1On1',
      payload: {
        id,
        content: q,
        canBeRehired,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState(
          {
            isEdit: false,
          },
          () => {
            this.getList1On1();
          },
        );
      }
    });
  };

  getList1On1 = () => {
    const { dispatch, myRequest: { _id: code } = {} } = this.props;
    dispatch({
      type: 'offboarding/getList1On1',
      payload: {
        offBoardingRequest: code,
      },
    });
  };

  handleCanBeRehired = (e) => {
    const { target: { checked = false } = {} } = e;
    this.setState({
      canBeRehired: checked,
    });
    const { q, itemComment: { _id: id } = {} } = this.state;

    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/complete1On1',
      payload: {
        id,
        canBeRehired: checked,
        content: q,
      },
    });
  };

  render() {
    const { itemComment = {}, q, isEdit, selectButton } = this.state;
    const {
      // loading,
      myId,
      handleReviewRequest = () => {},
      openFormReason = () => {},
      loadingReview,
      id = '',
      isOnHold = false,
      status = '',
    } = this.props;

    const {
      updatedAt,
      ownerComment: { _id: ownerCommentId = '', generalInfo: { firstName = '' } = {} } = {},
      canBeRehired: originCanBeRehired = false,
    } = itemComment;
    const time = moment(updatedAt).format('DD.MM.YY | h:mm A');
    const isOwner = myId === ownerCommentId;
    const checkDisable = status !== 'IN-PROGRESS';

    return (
      <div className={s.root}>
        <div className={s.header}>
          <span className={s.title}>
            {isOwner ? 'Your' : `${firstName}'s`} Closing Comments from 1-on-1
          </span>
          <div className={s.rightPart}>
            {!isEdit && isOwner && !checkDisable && (
              <div className={s.editBtn} onClick={this.handleOpenEdit}>
                <img style={{ margin: '0 2px 2px 0' }} src={editIcon} alt="edit-icon" />
                <span>Edit</span>
              </div>
            )}
            {isEdit && (
              <>
                <div className={s.handleCloseEdit} onClick={this.handleCloseEdit}>
                  <span>Cancel</span>
                </div>
                <div className={s.handleSave} onClick={this.handleSubmit}>
                  <span>Save</span>
                </div>
              </>
            )}
            <span className={s.time}>{time}</span>
          </div>
        </div>

        <div className={s.content}>
          <div className={s.textArea}>
            <TextArea
              className={s.box}
              allowClear={isEdit}
              value={q}
              onChange={this.handleChange}
              disabled={!isEdit}
            />
            <div className={s.canBeRehired}>
              <Checkbox
                disabled={checkDisable}
                defaultChecked={originCanBeRehired}
                onChange={this.handleCanBeRehired}
              >
                Can be rehired
              </Checkbox>{' '}
              <span>(This will remain private to yourself and the HR)</span>
            </div>
          </div>
        </div>
        {!isOnHold && !checkDisable && (
          <div className={s.buttonArea}>
            <span className={s.description}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={s.buttons}>
              <Button type="link" className={s.putOnHoldBtn} onClick={openFormReason}>
                Put-on-Hold
              </Button>
              <Button
                type="link"
                loading={loadingReview && selectButton === 'REJECTED'}
                className={s.rejectBtn}
                onClick={() => {
                  this.setState({ selectButton: 'REJECTED' });
                  handleReviewRequest('REJECTED', id);
                }}
              >
                Reject
              </Button>
              <Button
                type="primary"
                loading={loadingReview && selectButton === 'ACCEPTED'}
                onClick={() => {
                  this.setState({ selectButton: 'ACCEPTED' });
                  handleReviewRequest('ACCEPTED', id);
                }}
                disabled={!q}
              >
                Accept
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EditComment;
