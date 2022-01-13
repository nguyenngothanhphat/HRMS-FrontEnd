import { Carousel } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';
// import LikeIcon from '@/assets/homePage/like.svg';
// import CommentIcon from '@/assets/homePage/comment.svg';

const avatars = [BirthdayImage, BirthdayImage2, BirthdayImage3, BirthdayImage4];
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

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

  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  const isFutureDay = (date1, date2) => {
    return moment(date1).isAfter(date2);
  };

  const addCurrentYearToExistingDate = (date) => {
    const currentYear = moment().format('YYYY');
    return moment(
      `${currentYear}/${moment(date).format('MM')}/${moment(date).format('DD')}`,
      'YYYY/MM/DD',
    );
  };

  const formatData = () => {
    const todayList = birthdayInWeekList.filter((x) =>
      isTheSameDay(moment(), moment(x.generalInfoInfo?.DOB)),
    );
    const futureList = birthdayInWeekList.filter(
      (x) =>
        !todayList.some((y) => x._id === y._id) &&
        isFutureDay(moment(addCurrentYearToExistingDate(x.generalInfoInfo.DOB)), moment()),
    );

    let result = [...todayList, ...futureList];
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
  }, [JSON.stringify(birthdayInWeekList)]);

  const renderEmployeeName = (generalInfo) => {
    return (
      <UserProfilePopover placement="left" data={generalInfo}>
        <span className={styles.employeeName} onClick={() => {}}>
          {generalInfo.legalName}
        </span>
      </UserProfilePopover>
    );
  };

  const renderBirthdayContent = (generalInfo = {}) => {
    const { DOB = '' } = generalInfo || {};
    const isToday = isTheSameDay(moment(), moment(DOB));
    const employeeName = renderEmployeeName(generalInfo);
    const birthday = moment(DOB).locale('en').format('MMM Do');
    if (isToday)
      return (
        <span>
          {employeeName} is celebrating his birthday today. ({birthday})
        </span>
      );
    return (
      <span>
        Upcoming birthday: {employeeName} ({birthday})
      </span>
    );
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
      <Carousel
        infinite
        arrows
        dots
        autoplay
        autoplaySpeed={10000}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
      >
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
