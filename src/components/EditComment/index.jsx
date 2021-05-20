import React, { Component } from 'react';
import moment from 'moment';
import { Input, Button } from 'antd';
import { connect } from 'umi';
import editIcon from '@/assets/edit-off-boarding.svg';
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
    const { loading, myId } = this.props;
    const {
      updatedAt,
      ownerComment: { _id: ownerCommentId = '', generalInfo: { firstName = '' } = {} } = {},
    } = itemComment;
    const time = moment(updatedAt).format('DD.MM.YY | h:mm A');
    const isOwner = myId === ownerCommentId;
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <div className={s.viewTop__name}>{firstName} Closing Comments from 1-on-1</div>
          <div className={s.viewTop__right}>
            {!isEdit && isOwner && (
              <div className={s.viewTop__right__edit} onClick={this.handleOpenEdit}>
                <img style={{ margin: '0 2px 2px 0' }} src={editIcon} alt="edit-icon" />
                <span>Edit</span>
              </div>
            )}
            <div className={s.viewTop__right__time}>{time}</div>
          </div>
        </div>
        <TextArea
          className={s.boxComment}
          value={q}
          onChange={this.handleChange}
          disabled={!isEdit}
        />
        <span style={{ color: '#FD4546' }}>* This candidate can be rehired</span>
        {isEdit && (
          <div className={s.viewBottom}>
            <Button className={s.btnCancel} onClick={this.handleCloseEdit}>
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={!q}
              className={s.btnSubmit}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default EditComment;
