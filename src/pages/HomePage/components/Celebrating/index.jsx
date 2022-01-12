import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
// import LikeIcon from '@/assets/homePage/like.svg';
// import CommentIcon from '@/assets/homePage/comment.svg';

const avatars = [BirthdayImage, BirthdayImage2, BirthdayImage3, BirthdayImage4];

const Celebrating = (props) => {
  const { dispatch, dashboard: { birthdayInWeekList = [] } = {} } = props;
  const [birthdayList, setBirthdayList] = useState([]);
  const fetchBirthdayInWeekList = () => {
    return dispatch({
      type: 'dashboard/fetchBirthdayInWeekList',
    });
  };
  useEffect(() => {
    fetchBirthdayInWeekList();
  }, []);

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const formatData = () => {
    const todayList = birthdayInWeekList.filter((x) =>
      isTheSameDay(moment(), moment(x.generalInfoInfo?.DOB)),
    );
    const rest = birthdayInWeekList.filter((x) => !todayList.some((y) => x._id === y._id));

    let result = [...todayList, ...rest];
    let avatarIndex = 0;
    result = result.map((x) => {
      if (!x.generalInfoInfo?.avatar) {
        avatarIndex += 1;
        return {
          ...x,
          generalInfoInfo: {
            ...x.generalInfoInfo,
            avatar: avatars[avatarIndex % avatars.length],
          },
        };
      }
      return x;
    });

    setBirthdayList(result);
  };

  useEffect(() => {
    formatData();
  }, []);

  const renderBirthdayContent = (generalInfo = {}) => {
    const { DOB = '', legalName = '' } = generalInfo || {};
    const isToday = isTheSameDay(moment(), moment(DOB));
    const birthday = moment(DOB).format('MM/DD/YYYY');
    if (isToday) return `${legalName} is celebrating his birthday today. (${birthday})`;
    return `Upcoming birthday: ${legalName} (${birthday})`;
  };

  const renderCard = (card) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={card.generalInfoInfo?.avatar || BirthdayImage} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{renderBirthdayContent(card.generalInfoInfo)}</p>

          {/* HIDE - NOT AVAILABLE YET  */}
          {/* <div className={styles.actions}>
            <div className={styles.likes}>
              <img src={LikeIcon} alt="" />
              <span>{card.likes || 0} Likes</span>
            </div>
            <div className={styles.comments}>
              <img src={CommentIcon} alt="" />
              <span>{card.comments || 0} Comments</span>
            </div>
          </div> */}
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

  return (
    <div className={styles.Celebrating}>
      <p className={styles.titleText}>Lets celebrate</p>
      <Carousel infinite arrows dots>
        {birthdayList.length > 0 ? birthdayList.map((x) => renderCard(x)) : renderEmpty()}
      </Carousel>
    </div>
  );
};

export default connect(({ dashboard, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  dashboard,
}))(Celebrating);
