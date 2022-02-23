import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import { Input, Button } from 'antd';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';
import LikeIcon from '@/assets/homePage/like.svg';
import CommentIcon from '@/assets/homePage/comment.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

const comments = [
  {
    id: 1,
    avatar: MockAvatar,
    comment: 'Wishing you many more happy returns of the day',
  },
  {
    id: 2,
    avatar: MockAvatar,
    comment: 'Happy Birthday!',
  },
  {
    id: 3,
    avatar: MockAvatar,
    comment: 'Happy Birthday to you',
  },
];

const CelebratingDetailModalContent = (props) => {
  const { item = {} } = props;

  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

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

  const renderComment = (comment) => {
    return (
      <div className={styles.comment}>
        <div className={styles.author}>
          <img src={comment.avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.content}>
          <p>{comment.comment}</p>
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
            <img src={LikeIcon} alt="" />
            <span>{card.likes || 0} Likes</span>
          </div>
          <div className={styles.comments}>
            <img src={CommentIcon} alt="" />
            <span>{card.comments || 0} Comments</span>
          </div>
        </div>
        <div className={styles.commentBox}>
          <Input
            className={styles.commentInput}
            placeholder="Add a comment..."
            suffix={<Button className={styles.commentBtn}>Submit</Button>}
          />
        </div>
        <div className={styles.commentsContainer}>
          {comments.map((x) => renderComment(x))}
          <span className={styles.loadMore}>Load more comments</span>
        </div>
      </div>
    );
  };

  return <div className={styles.CelebratingDetailModalContent}>{renderCard(item)}</div>;
};
export default connect(() => ({}))(CelebratingDetailModalContent);
