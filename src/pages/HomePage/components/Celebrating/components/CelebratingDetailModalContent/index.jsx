import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Input, Button, Tooltip } from 'antd';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';
import LikeIcon from '@/assets/homePage/like.svg';
import CommentIcon from '@/assets/homePage/comment.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

const COMMENT_DEFAULT_COUNT = 3;

const CelebratingDetailModalContent = (props) => {
  const {
    dispatch,
    item = {},
    currentUser: { employee = {} } = {},
    refreshData = () => {},
    loadingComment = false,
  } = props;

  const { likesComments: { likes = [], comments = [] } = {} } = item;

  const [activeComments, setActiveComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  const likedIds = likes.map((x) => x.employeeInfo?._id);

  // functions
  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const handleActiveComments = (list, number) => {
    const activeCommentsTemp = list.slice(0, number);
    setActiveComments(activeCommentsTemp);
  };

  const upsertBirthdayConversationEffect = (payload) => {
    return dispatch({
      type: 'homePage/upsertBirthdayConversationEffect',
      payload,
    });
  };

  const onLikeClick = async () => {
    const employeeId = employee?._id;
    if (!likedIds.includes(employeeId)) {
      const payload = {
        employee: item._id,
        year: moment().year(),
        likes: [...likedIds, employeeId],
        comments,
      };
      const res = await upsertBirthdayConversationEffect(payload);
      if (res.statusCode === 200) {
        refreshData();
      }
    }
  };

  const onCommentClick = async () => {
    const employeeId = employee?._id;
    const originalComments = comments.map((x) => {
      return {
        content: x.content,
        employee: x.employee,
      };
    });

    const payload = {
      employee: item._id,
      year: moment().year(),
      likes: likedIds,
      comments: [
        ...originalComments,
        {
          content: commentContent,
          employee: employeeId,
        },
      ],
    };
    const res = await upsertBirthdayConversationEffect(payload);
    if (res.statusCode === 200) {
      setCommentContent('');
      handleActiveComments(comments, comments.length + 1);
      refreshData();
    }
  };

  const onChangeCommentInput = (e = {}) => {
    setCommentContent(e.target.value);
  };

  const onViewMoreClick = () => {
    handleActiveComments(comments, activeComments.length + COMMENT_DEFAULT_COUNT);
  };

  useEffect(() => {
    if (comments.length - 1 === activeComments.length) {
      handleActiveComments(comments, comments.length);
    } else {
      handleActiveComments(comments, COMMENT_DEFAULT_COUNT);
    }
  }, [JSON.stringify(comments)]);

  // render UI
  const renderEmployeeName = (data) => {
    return (
      <UserProfilePopover
        placement="left"
        data={{
          ...data,
          ...data.generalInfoInfo,
        }}
      >
        <span
          className={styles.employeeName}
          onClick={() => onViewProfileClick(data?.generalInfoInfo?.userId)}
        >
          {data?.generalInfoInfo.legalName}
        </span>
      </UserProfilePopover>
    );
  };

  const getGender = (gender) => {
    switch (gender) {
      case 'Male':
        return 'his';
      case 'Female':
        return 'her';
      default:
        return 'his/her';
    }
  };
  const renderBirthdayContent = (data = {}) => {
    const { DOB = '', gender = '' } = data?.generalInfoInfo || {};
    const isToday = isTheSameDay(moment(), moment(DOB));
    const employeeName = renderEmployeeName(data);
    const birthday = moment(DOB).locale('en').format('MMM Do');
    if (isToday)
      return (
        <span>
          {employeeName} is celebrating {getGender(gender)} birthday today. ({birthday})
        </span>
      );
    return (
      <span>
        Upcoming birthday: {employeeName} ({birthday})
      </span>
    );
  };

  const onViewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const renderComment = (comment) => {
    const { legalName = '' } = comment.employeeInfo?.generalInfoInfo;
    return (
      <div className={styles.comment}>
        <div className={styles.author} onClick={() => onViewProfile(comment.employeeInfo?._id)}>
          <img src={comment.employeeInfo?.generalInfoInfo?.avatar || MockAvatar} alt="" />
        </div>

        <div className={styles.content}>
          <p className={styles.authorName}>{legalName}</p>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  };

  const renderCard = (card) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.above}>
          <div className={styles.image}>
            <img src={card.generalInfoInfo?.avatar} alt="" />
          </div>
          <div className={styles.content}>
            <p className={styles.caption}>{renderBirthdayContent(card)}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.likes} onClick={onLikeClick}>
            <img src={LikeIcon} alt="" />
            <span
              style={likedIds.includes(employee?._id) ? { fontWeight: 500, color: '#2C6DF9' } : {}}
            >
              {likes.length || 0} Likes
            </span>
          </div>
          <div className={styles.comments}>
            <img src={CommentIcon} alt="" />
            <span>{comments.length || 0} Comments</span>
          </div>
        </div>
        <div className={styles.commentBox}>
          <Input
            className={styles.commentInput}
            placeholder="Add a comment..."
            onChange={onChangeCommentInput}
            value={commentContent}
            suffix={
              <Button
                className={styles.commentBtn}
                onClick={onCommentClick}
                disabled={loadingComment}
              >
                Submit
              </Button>
            }
          />
        </div>
        <div
          className={styles.commentsContainer}
          style={activeComments.length === 0 ? { border: 'none', marginTop: 0 } : {}}
        >
          {activeComments.map((x) => renderComment(x))}
          {activeComments.length !== comments.length && (
            <span className={styles.loadMore} onClick={onViewMoreClick}>
              Load more comments
            </span>
          )}
        </div>
      </div>
    );
  };

  return <div className={styles.CelebratingDetailModalContent}>{renderCard(item)}</div>;
};
export default connect(({ user: { currentUser } = {}, loading }) => ({
  currentUser,
  loadingComment: loading.effects['homePage/upsertBirthdayConversationEffect'],
}))(CelebratingDetailModalContent);
