import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AnniversaryImage from '@/assets/homePage/anniversary.png';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
import NewJoineeImage from '@/assets/homePage/welcomeNewJoinee.png';
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
      return x;
    });

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
