/* eslint-disable no-nested-ternary */
import { Carousel, Spin } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';
import LikeIcon from '@/assets/homePage/like.svg';
import CommentIcon from '@/assets/homePage/comment.svg';
import CommonModal from '@/components/CommonModal';
import CelebratingDetailModalContent from '../CelebratingDetailModalContent';
import LikedModalContent from '../LikedModalContent';
import { CELEBRATE_TYPE } from '@/utils/homePage';

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
    currentUser: { employee = {} } = {},
    refreshData = () => {},
    loadingRefresh = false,
  } = props;

  const [celebratingDetailModalVisible, setCelebratingDetailModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState('');
  const [likedModalVisible, setLikedModalVisible] = useState(false);

  // functions
  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const upsertCelebrationConversationEffect = (payload) => {
    return dispatch({
      type: 'homePage/upsertCelebrationConversationEffect',
      payload,
    });
  };

  const onLikeClick = async (item) => {
    const { likesComments: { likes = [] } = {} } = item;

    const employeeId = employee?._id;
    if (!likes.includes(employeeId)) {
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

  useEffect(() => {
    if (viewingItem) {
      const find = list.find((item) => item._id === viewingItem._id);
      setViewingItem(find);
    }
  }, [JSON.stringify(list)]);

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

  const renderCard = (card) => {
    const { likesComments: { likes = [], comments = [] } = {} } = card;
    const likedIds = likes.map((x) => x._id);
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={card.generalInfoInfo?.avatar || BirthdayImage} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{renderCardContent(card)}</p>

          <div className={styles.actions}>
            <div className={styles.likes}>
              <img
                src={LikeIcon}
                alt=""
                onClick={likedIds.includes(employee?._id) ? () => {} : () => onLikeClick(card)}
              />
              <span
                style={
                  likedIds.includes(employee?._id) ? { fontWeight: 500, color: '#2C6DF9' } : {}
                }
                onClick={() => {
                  setViewingItem(card);
                  setLikedModalVisible(true);
                }}
              >
                {likes.length || 0} Likes
              </span>
            </div>
            <div
              className={styles.comments}
              onClick={() => {
                setViewingItem(card);
                setCelebratingDetailModalVisible(true);
              }}
            >
              <img src={CommentIcon} alt="" />
              <span>{comments.length || 0} Comments</span>
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
          <img src={BirthdayImage} alt="" />
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
          <img src={previewImage || BirthdayImage} alt="" />
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
            ? list.length > 0
              ? list.map((x) => renderCard(x))
              : renderEmpty()
            : renderPreview()}
          {/* FOR PREVIEWING IN SETTINGS PAGE */}
        </Carousel>
      </Spin>
      <CommonModal
        visible={celebratingDetailModalVisible}
        onClose={() => setCelebratingDetailModalVisible(false)}
        title="Say Happy Birthday!"
        content={<CelebratingDetailModalContent item={viewingItem} refreshData={refreshData} />}
        width={500}
        hasFooter={false}
      />
      <CommonModal
        visible={likedModalVisible}
        onClose={() => setLikedModalVisible(false)}
        title="Likes"
        content={<LikedModalContent list={viewingItem?.likesComments?.likes || []} />}
        width={500}
        hasFooter={false}
      />
    </div>
  );
};

export default connect(({ loading, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  loadingRefresh: loading.effects['homePage/fetchCelebrationList'],
}))(Card);
