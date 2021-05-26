import React, { Component } from 'react';
import moment from 'moment';
import { Input, Button } from 'antd';
import { connect } from 'umi';
import editIcon from '@/assets/edit-off-boarding.svg';
import BlueLikeIcon from '@/assets/blueLikeIcon.svg';
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
    const { q, itemComment: { _id: id } = {} } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/complete1On1',
      payload: {
        id,
        content: q,
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

  render() {
    const { itemComment = {}, q, isEdit } = this.state;
    const {
      // loading,
      myId,
      // handleReviewRequest = () => {},
      // openFormReason = () => {},
      // loadingReview,
      // id = '',
      isOnHold = false,
    } = this.props;
    const {
      updatedAt,
      ownerComment: { _id: ownerCommentId = '', generalInfo: { firstName = '' } = {} } = {},
      canBeRehired = false,
    } = itemComment;
    const time = moment(updatedAt).format('DD.MM.YY | h:mm A');
    const isOwner = myId === ownerCommentId;
    return (
      <div className={s.root}>
        <div className={s.header}>
          <span className={s.title}>
            {isOwner ? 'Your' : `${firstName}'s`} Closing Comments from 1-on-1
          </span>
          <div className={s.rightPart}>
            {!isEdit && isOwner && (
              <div className={s.editBtn} onClick={this.handleOpenEdit}>
                <img style={{ margin: '0 2px 2px 0' }} src={editIcon} alt="edit-icon" />
                <span>Edit</span>
              </div>
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
            {!isOwner && canBeRehired && (
              <div className={s.canBeRehired}>
                <span className={s.text1}>* This candidate can be rehired</span>
              </div>
            )}
            {isOwner && (
              // && canBeRehired
              <div className={s.canBeRehired}>
                <img src={BlueLikeIcon} alt="like" />
                <span className={s.text2}>
                  Your comment for the 1-on-1 with Venkat has been recorded. Venkat and the HR
                  manager will be able to view this comment.
                </span>
              </div>
            )}
          </div>
        </div>
        {!isOnHold && isEdit && (
          <div className={s.buttonArea}>
            <span className={s.description}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={s.buttons}>
              <Button type="link" className={s.putOnHoldBtn} onClick={this.handleCloseEdit}>
                Cancel
              </Button>
              <Button
                type="primary"
                className={s.rejectBtn}
                onClick={this.handleSubmit}
                disabled={!q}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EditComment;
