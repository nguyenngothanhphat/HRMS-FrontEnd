import { Button, Input } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommentIcon from '@/assets/homePage/comment.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '@/components/UserProfilePopover';
import CommonModal from '../../../CommonModal';
import LikedModalContent from '../LikedModalContent';
import styles from './index.less';

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
  const [likedModalVisible, setLikedModalVisible] = useState(false);

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
    const { _id = '' } = comment.employeeInfo || {};
    const isMe = _id === employee?._id;

    return (
      <div className={styles.comment}>
        <div className={styles.author}>
          <img src={comment.employeeInfo?.generalInfoInfo?.avatar || MockAvatar} alt="" />
        </div>

        <div className={styles.content}>
          <p
            className={`${styles.authorName} ${isMe ? styles.isMe : null}`}
            onClick={() => onViewProfile(comment.employeeInfo?._id)}
          >
            {legalName}
          </p>
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
          <div className={styles.likes}>
            <img
              src={LikeIcon}
              alt=""
              onClick={likedIds.includes(employee?._id) ? () => {} : () => onLikeClick(card)}
            />
            <span
              style={likedIds.includes(employee?._id) ? { fontWeight: 500, color: '#2C6DF9' } : {}}
              onClick={() => setLikedModalVisible(true)}
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

  return (
    <div className={styles.CelebratingDetailModalContent}>
      {renderCard(item)}
      <CommonModal
        visible={likedModalVisible}
        onClose={() => setLikedModalVisible(false)}
        title="Likes"
        content={<LikedModalContent list={likes} />}
        width={500}
        hasFooter={false}
      />
    </div>
  );
};
export default connect(({ user: { currentUser } = {}, loading }) => ({
  currentUser,
  loadingComment: loading.effects['homePage/upsertBirthdayConversationEffect'],
}))(CelebratingDetailModalContent);
