/* eslint-disable no-nested-ternary */
import { Carousel, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import CommentIcon from '@/assets/homePage/comment.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import PlaceholderImage from '@/assets/homePage/previewImage.png';
import CommonModal from '@/components/CommonModal';
import PostLikedModalContent from '@/components/PostLikedModalContent';
import UserProfilePopover from '@/components/UserProfilePopover';
import { CELEBRATE_TYPE, LIKE_ACTION, POST_OR_CMT, roundNumber, TAB_IDS } from '@/utils/homePage';
import { getCompanyName, singularify } from '@/utils/utils';
import CelebratingDetailModalContent from '../CelebratingDetailModalContent';
import styles from './index.less';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const Card = (props) => {
  const {
    dispatch,
    list = [],
    previewing = false,
    // FOR PREVIEWING IN SETTINGS PAGE
    contentPreview: { previewImage = '', previewDescription = '' } = {},
    loadingRefresh = false,
    loadingReactPost = false,
    homePage: { reactionList = [], reactionTotal = 0 } = {},
    loadingFetchReactList = false,
    activePostID = '',
    setActivePostID = () => {},
    loadingFetchOnePost = false,
  } = props;

  const [celebratingDetailModalVisible, setCelebratingDetailModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState('');
  const [likedModalVisible, setLikedModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isReactPostOrCmt, setIsReactPostOrCmt] = useState('');

  // functions
  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const getPostReactionListEffect = (postId, type) => {
    return dispatch({
      type: 'homePage/fetchPostReactionListEffect',
      payload: {
        post: postId,
        type,
        page: 1,
        limit: Math.floor(reactionList.length / 5) * 5 + 5,
      },
    });
  };

  const reactAnniversaryEffect = (postIdProp, type = LIKE_ACTION.LIKE) => {
    return dispatch({
      type: 'homePage/reactAnniversaryEffect',
      payload: {
        post: postIdProp,
        type,
      },
    });
  };

  const refreshThisPost = (postId) => {
    return dispatch({
      type: 'homePage/fetchAnniversaryByIdEffect',
      payload: {
        post: postId,
      },
      varName: TAB_IDS.ANNIVERSARY,
    });
  };

  // add comment
  const onLikePost = async (postId, type) => {
    setIsReactPostOrCmt(POST_OR_CMT.POST);
    setActivePostID(postId);
    const res = await reactAnniversaryEffect(postId, type);
    if (res.statusCode === 200) {
      await refreshThisPost(postId);
      setIsReactPostOrCmt('');
    }
  };

  const formatData = (arr) => {
    return arr.map((x) => {
      return {
        ...x,
        likes: x.likesComments?.likes || [],
        comments: x.likesComments?.comments || [],
      };
    });
  };

  useEffect(() => {
    const dataTemp = formatData(list);
    setData(dataTemp);
    if (viewingItem) {
      const find = dataTemp.find((item) => item._id === viewingItem._id);
      setViewingItem(find);
    }
  }, [JSON.stringify(list)]);

  const onViewWhoLiked = (card) => {
    getPostReactionListEffect(card?._id);
    setViewingItem(card);
    setLikedModalVisible(true);
  };

  // render UI
  const renderEmployeeName = (emp = {}) => {
    return (
      <UserProfilePopover
        placement="left"
        data={{
          ...emp,
          ...emp.generalInfoInfo,
        }}
      >
        <span
          className={styles.employeeName}
          onClick={() => onViewProfileClick(emp?.generalInfoInfo?.userId)}
        >
          {emp?.generalInfoInfo?.legalName}
        </span>
      </UserProfilePopover>
    );
  };

  const renderCardContent = (card = {}) => {
    const { createdBy = {}, eventType = '', eventDate = '' } = card;
    const employeeName = renderEmployeeName(createdBy);

    if (eventType === CELEBRATE_TYPE.BIRTHDAY) {
      const isToday = isTheSameDay(moment(), moment(eventDate));
      const birthday = moment.utc(eventDate).locale('en').format('MMM Do');
      if (isToday)
        return (
          <span>
            Happy Birthday {employeeName} ({birthday}) !!!
          </span>
        );
      return (
        <span>
          Upcoming birthday: {employeeName} ({birthday})
        </span>
      );
    }
    if (eventType === CELEBRATE_TYPE.ANNIVERSARY) {
      const yearCount = roundNumber(
        moment.utc().diff(moment.utc(createdBy?.joinDate).format('YYYY-MM-DD'), 'years', true),
      );
      return (
        <span>
          Congratulations {employeeName} on completing {yearCount} {singularify('year', yearCount)}{' '}
          with {getCompanyName()} !!!
        </span>
      );
    }
    if (eventType === CELEBRATE_TYPE.NEWJOINEE) {
      return (
        <span>
          {employeeName} ({moment.utc(eventDate).locale('en').format('MMM Do, YYYY')}) - Welcome to
          the team Newbie !!!
        </span>
      );
    }
    return '';
  };

  const renderCard = (card) => {
    const { totalReact: { asObject = {} } = {}, totalComment = 0 } = card;
    const liked = card.react === LIKE_ACTION.LIKE;

    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img
            src={card.createdBy?.generalInfoInfo?.avatar || BirthdayImage}
            alt=""
            onError={(e) => {
              e.target.src = PlaceholderImage;
            }}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{renderCardContent(card)}</p>

          <div className={styles.actions}>
            <Spin
              spinning={
                (loadingFetchOnePost ||
                  (loadingReactPost && isReactPostOrCmt === POST_OR_CMT.POST) ||
                  loadingRefresh) &&
                card._id === activePostID
              }
              indicator={null}
            >
              <div className={styles.likes}>
                <img
                  src={liked ? LikedIcon : LikeIcon}
                  alt=""
                  onClick={() => onLikePost(card?._id, LIKE_ACTION.LIKE)}
                />
                <span
                  style={liked ? { fontWeight: 500, color: '#2C6DF9' } : {}}
                  onClick={() => onViewWhoLiked(card)}
                >
                  {asObject[LIKE_ACTION.LIKE] || 0}{' '}
                  {singularify('Like', asObject[LIKE_ACTION.LIKE])}
                </span>
              </div>
            </Spin>
            <div
              className={styles.comments}
              onClick={() => {
                setViewingItem(card);
                setCelebratingDetailModalVisible(true);
              }}
            >
              <img src={CommentIcon} alt="" />
              <span>
                {totalComment || 0} {singularify('Comment', totalComment)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img
            src={BirthdayImage}
            alt=""
            onError={(e) => {
              e.target.src = PlaceholderImage;
            }}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>No birthday today</p>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img
            src={previewImage || BirthdayImage}
            alt=""
            onError={(e) => {
              e.target.src = PlaceholderImage;
            }}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{previewDescription || 'Content here'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Card}>
      <Spin spinning={loadingRefresh && !celebratingDetailModalVisible}>
        <Carousel
          infinite
          arrows
          dots
          autoplay={!celebratingDetailModalVisible}
          autoplaySpeed={10000}
          lazyLoad="ondemand"
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
        >
          {!previewing
            ? data.length > 0
              ? data.map((x) => renderCard(x))
              : renderEmpty()
            : renderPreview()}
          {/* FOR PREVIEWING IN SETTINGS PAGE */}
        </Carousel>
      </Spin>
      <CommonModal
        visible={celebratingDetailModalVisible}
        onClose={() => setCelebratingDetailModalVisible(false)}
        title={
          viewingItem.eventType === CELEBRATE_TYPE.BIRTHDAY
            ? 'Say Happy Birthday!'
            : 'Say Congratulations!'
        }
        content={
          celebratingDetailModalVisible ? (
            <CelebratingDetailModalContent
              item={viewingItem}
              onLikePost={onLikePost}
              setIsReactPostOrCmt={setIsReactPostOrCmt}
              isReactPostOrCmt={isReactPostOrCmt}
              getPostReactionListEffect={getPostReactionListEffect}
              activePostID={activePostID}
              setActivePostID={setActivePostID}
            />
          ) : null
        }
        width={600}
        hasFooter={false}
        maskClosable
      />
      <CommonModal
        visible={likedModalVisible}
        onClose={() => setLikedModalVisible(false)}
        title="Likes"
        content={
          <PostLikedModalContent
            list={reactionList.map((x) => x.employee)}
            loading={loadingFetchReactList}
            total={reactionTotal}
            loadMore={getPostReactionListEffect}
          />
        }
        width={500}
        maskClosable
        hasFooter={false}
      />
    </div>
  );
};

export default connect(
  ({ loading, homePage, user: { currentUser = {}, permissions = {} } = {} }) => ({
    currentUser,
    permissions,
    homePage,
    loadingRefresh: loading.effects['homePage/fetchCelebrationList'],
    loadingReactPost: loading.effects['homePage/reactAnniversaryEffect'],
    loadingFetchReactList: loading.effects['homePage/fetchPostReactionListEffect'],
    loadingFetchOnePost: loading.effects['homePage/fetchAnniversaryByIdEffect'],
  }),
)(Card);
