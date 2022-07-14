import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
import NewJoineeImage from '@/assets/homePage/welcomeNewJoinee.png';
import AnniversaryImage from '@/assets/homePage/anniversary.png';
import { CELEBRATE_TYPE } from '@/utils/homePage';
import Card from './components/Card';
import styles from './index.less';

const avatars = [BirthdayImage, BirthdayImage2, BirthdayImage3, BirthdayImage4];

const Celebrating = (props) => {
  const { dispatch, homePage: { celebrationList = [] } = {} } = props;
  const [list, setList] = useState([]);

  const fetchCelebrationList = () => {
    return dispatch({
      type: 'homePage/fetchCelebrationList',
    });
  };

  useEffect(() => {
    fetchCelebrationList();
  }, []);

  const compare = (a, b) => {
    if (moment(a) > moment(b)) return 1;
    if (moment(a) < moment(b)) return -1;
    return 0;
  };

  const isPastDate = (date1, date2) => {
    return moment(date1).isBefore(moment(date2), 'day');
  };

  const addCurrentYearToExistingDate = (date) => {
    const currentYear = moment.utc().year();
    return moment(
      `${currentYear}/${moment.utc(date).format('MM')}/${moment.utc(date).format('DD')}`,
      'YYYY/MM/DD',
    );
  };

  const getAvatarImage = (type, avatarIndex) => {
    switch (type) {
      case CELEBRATE_TYPE.BIRTHDAY:
        return avatars[avatarIndex % avatars.length];
      case CELEBRATE_TYPE.ANNIVERSARY:
        return AnniversaryImage;
      case CELEBRATE_TYPE.NEWJOINEE:
        return NewJoineeImage;
      default:
        return '';
    }
  };

  const assignSortValue = (item, type) => {
    switch (type) {
      case CELEBRATE_TYPE.BIRTHDAY:
        return item.generalInfoInfo?.DOB;
      default:
        return item.joinDate;
    }
  };

  const formatData = () => {
    let tempList = JSON.parse(JSON.stringify(celebrationList));

    let avatarIndex = 0;
    tempList = tempList.map((x) => {
      const { type = '' } = x;
      if (!x.generalInfoInfo?.avatar) {
        avatarIndex += 1;
        return {
          ...x,
          generalInfoInfo: {
            ...x.generalInfoInfo,
            avatar: getAvatarImage(type, avatarIndex),
          },
        };
      }
      return { ...x, sortValue: assignSortValue(x, type) };
    });

    tempList = tempList.filter(
      (x) => !isPastDate(moment(addCurrentYearToExistingDate(x.sortValue)), moment()),
    );

    tempList.sort((a, b) =>
      compare(
        moment(addCurrentYearToExistingDate(a.sortValue)),
        moment(addCurrentYearToExistingDate(b.sortValue)),
      ),
    );

    setList(tempList);
  };

  useEffect(() => {
    formatData();
  }, [JSON.stringify(celebrationList)]);

  return (
    <div className={styles.Celebrating}>
      <p className={styles.titleText}>Lets celebrate</p>
      <Card list={list} refreshData={fetchCelebrationList} />
    </div>
  );
};

export default connect(({ homePage, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  homePage,
}))(Celebrating);
