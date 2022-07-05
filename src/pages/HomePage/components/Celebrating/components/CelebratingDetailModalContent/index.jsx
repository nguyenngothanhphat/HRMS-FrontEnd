import { Button, Input, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommentIcon from '@/assets/homePage/comment.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '@/components/UserProfilePopover';
import CommonModal from '@/components/CommonModal';
import PostLikedModalContent from '@/components/PostLikedModalContent';
import styles from './index.less';
import { CELEBRATE_TYPE } from '@/utils/homePage';

const COMMENT_DEFAULT_COUNT = 3;
const ACTION = {
  LIKE: 1,
  COMMENT: 2,
};

const CelebratingDetailModalContent = (props) => {
  const {
    dispatch,
    item = {},
    currentUser: { employee = {} } = {},
    refreshData = () => {},
    loadingComment = false,
    loadingRefresh = false,
  } = props;

  const { likesComments: { likes = [], comments = [] } = {} } = item;

  const [activeComments, setActiveComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [likedModalVisible, setLikedModalVisible] = useState(false);
  const [action, setAction] = useState('');

  const likedIds = likes.map((x) => x._id);

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

  const upsertCelebrationConversationEffect = (payload) => {
    return dispatch({
      type: 'homePage/upsertCelebrationConversationEffect',
      payload,
    });
  };

  const onLikeClick = async () => {
    setAction(ACTION.LIKE);

    const employeeId = employee?._id;
    if (!likedIds.includes(employeeId)) {
      const payload = {
        employee: item._id,
        likes: [employeeId],
        type: item.type,
      };
      const res = await upsertCelebrationConversationEffect(payload);
      if (res.statusCode === 200) {
        refreshData();
      }
    }
  };

  const onCommentClick = async () => {
    if (commentContent) {
      setAction(ACTION.COMMENT);

      const employeeId = employee?._id;

      const payload = {
        employee: item._id,
        comments: [
          {
            content: commentContent,
            employee: employeeId,
          },
        ],
        type: item.type,
      };
      const res = await upsertCelebrationConversationEffect(payload);
      if (res.statusCode === 200) {
        setCommentContent('');
        handleActiveComments(comments, comments.length + 1);
        refreshData();
      }
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
  const renderCardContent = (data = {}) => {
    const employeeName = renderEmployeeName(data);

    if (data.type === CELEBRATE_TYPE.BIRTHDAY) {
      const { DOB = '', gender = '' } = data?.generalInfoInfo || {};
      const isToday = isTheSameDay(moment(), moment(DOB));
      const birthday = moment.utc(DOB).locale('en').format('MMM Do');
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
    }
    if (data.type === CELEBRATE_TYPE.ANNIVERSARY) {
      const { joinDate = '' } = data;
      return (
        <span>
          {employeeName} joined our company on{' '}
          {moment.utc(joinDate).locale('en').format('MMM Do, YYYY')}.
        </span>
      );
    }
    if (data.type === CELEBRATE_TYPE.NEWJOINEE) {
      return <span>Welcome to new member: {employeeName}.</span>;
    }
    return '';
  };

  const onViewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const renderComment = (comment) => {
    const { legalName = '' } = comment.employee?.generalInfoInfo || {};
    const { _id = '' } = comment.employee || {};
    const isMe = _id === employee?._id;

    return (
      <div className={styles.comment}>
        <div className={styles.author}>
          <img src={comment.employee?.generalInfoInfo?.avatar || MockAvatar} alt="" />
        </div>

        <div className={styles.content}>
          <p
            className={`${styles.authorName} ${isMe ? styles.isMe : null}`}
            onClick={() => onViewProfile(comment.employee?.generalInfoInfo?.userId)}
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
            <p className={styles.caption}>{renderCardContent(card)}</p>
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
                disabled={action === ACTION.COMMENT && (loadingComment || !commentContent)}
              >
                Submit
              </Button>
            }
          />
        </div>
        <Spin spinning={action === ACTION.COMMENT && (loadingRefresh || loadingComment)}>
          <div
            className={styles.commentsContainer}
            style={
              activeComments.length === 0
                ? {
                    border: 'none',
                    marginTop:
                      action === ACTION.COMMENT && (loadingRefresh || loadingComment) ? '16px' : 0,
                  }
                : {}
            }
          >
            {activeComments.map((x) => renderComment(x))}
            {activeComments.length !== comments.length && (
              <span className={styles.loadMore} onClick={onViewMoreClick}>
                Load more comments
              </span>
            )}
          </div>
        </Spin>
      </div>
    );
  };

  return (
    <div className={styles.CelebratingDetailModalContent}>
      <Spin spinning={loadingRefresh && action === ACTION.LIKE}>{renderCard(item)}</Spin>
      <CommonModal
        visible={likedModalVisible}
        onClose={() => setLikedModalVisible(false)}
        title="Likes"
        content={<PostLikedModalContent list={likes} />}
        width={500}
        hasFooter={false}
      />
    </div>
  );
};
export default connect(({ user: { currentUser } = {}, loading }) => ({
  currentUser,
  loadingComment: loading.effects['homePage/upsertCelebrationConversationEffect'],
  loadingRefresh: loading.effects['homePage/fetchCelebrationList'],
}))(CelebratingDetailModalContent);
