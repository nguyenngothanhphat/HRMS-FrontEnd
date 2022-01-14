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

  const compare = (a, b) => {
    if (moment(a) > moment(b)) return 1;
    if (moment(a) < moment(b)) return -1;
    return 0;
  };

  const isPastDate = (date1, date2) => {
    return moment(date1).isBefore(date2, 'day');
  };

  const addCurrentYearToExistingDate = (date) => {
    const currentYear = moment().format('YYYY');
    return moment(
      `${currentYear}/${moment(date).format('MM')}/${moment(date).format('DD')}`,
      'YYYY/MM/DD',
    );
  };

  const formatData = () => {
    let result = [
      ...birthdayInWeekList.filter((x) => {
        return !isPastDate(moment(addCurrentYearToExistingDate(x.generalInfoInfo?.DOB)), moment());
      }),
    ];
    result.sort((a, b) =>
      compare(
        moment(addCurrentYearToExistingDate(a.generalInfoInfo.DOB)),
        moment(addCurrentYearToExistingDate(b.generalInfoInfo.DOB)),
      ),
    );
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

  const renderEmployeeName = (data) => {
    const { generalInfoInfo = {} } = data;
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
          {generalInfoInfo.legalName}
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

  const renderCard = (card) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={card.generalInfoInfo?.avatar || BirthdayImage} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{renderBirthdayContent(card)}</p>

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
