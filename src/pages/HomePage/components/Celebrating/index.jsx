import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
import styles from './index.less';
// import LikeIcon from '@/assets/homePage/like.svg';
// import CommentIcon from '@/assets/homePage/comment.svg';
import Card from './components/Card';

const avatars = [BirthdayImage, BirthdayImage2, BirthdayImage3, BirthdayImage4];

const Celebrating = (props) => {
  const { dispatch, homePage: { birthdayInWeekList = [] } = {} } = props;
  const [birthdayList, setBirthdayList] = useState([]);

  const fetchBirthdayInWeekList = () => {
    return dispatch({
      type: 'homePage/fetchBirthdayInWeekList',
    });
  };

  useEffect(() => {
    fetchBirthdayInWeekList();
  }, []);

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

  return (
    <div className={styles.Celebrating}>
      <p className={styles.titleText}>Lets celebrate</p>
      <Card birthdayList={birthdayList} />
    </div>
  );
};

export default connect(({ homePage, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  homePage,
}))(Celebrating);
